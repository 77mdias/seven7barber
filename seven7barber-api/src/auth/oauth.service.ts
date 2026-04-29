import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
  OAuthProvider,
  OAUTH_SCOPES,
  OAUTH_RETRY_CONFIG,
} from './enums/oauth-provider.enum';
import {
  OAuthTokenResponse,
  OAuthUserInfo,
} from './interfaces/oauth.interface';
import { PrismaService } from '../prisma/prisma.service';
import { EncryptionService } from './encryption.service';
import { JwtService } from '@nestjs/jwt';
import { OAuthStrategyFactory } from './strategies/oauth-strategy.factory';

@Injectable()
export class OAuthService {
  private rateLimitStore = new Map<
    string,
    { count: number; resetAt: number }
  >();

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
    private jwtService: JwtService,
    private oauthStrategyFactory: OAuthStrategyFactory,
  ) {}

  getAuthorizationUrl(provider: OAuthProvider): string {
    const clientId = this.configService.get<string>(
      `OAUTH_${provider.toUpperCase()}_CLIENT_ID`,
    )!;
    const redirectUri = this.configService.get<string>('OAUTH_REDIRECT_URI')!;
    const scope = OAUTH_SCOPES[provider];
    const state = this.generateState();

    const strategy = this.oauthStrategyFactory.getStrategy(provider);
    return strategy.buildAuthorizationUrl(clientId, redirectUri, scope, state);
  }

  async handleOAuthCallback(
    provider: OAuthProvider,
    code: string,
  ): Promise<{ user: any; access_token: string }> {
    // Check rate limit
    this.checkRateLimit(provider);

    // Exchange code for token with retry
    const tokenResponse = await this.exchangeCodeWithRetry(provider, code);

    // Get user info
    const userInfo = await this.getUserInfoWithRetry(
      provider,
      tokenResponse.access_token,
    );

    // Find or create user
    const user = await this.findOrCreateOAuthUser(
      provider,
      userInfo,
      tokenResponse,
    );

    // Generate JWT
    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return { user, access_token };
  }

  private checkRateLimit(provider: OAuthProvider): void {
    const now = Date.now();
    const key = `oauth:${provider}`;
    const limit = OAUTH_RETRY_CONFIG.rateLimit;

    let record = this.rateLimitStore.get(key);
    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + limit.windowMs };
      this.rateLimitStore.set(key, record);
    }

    if (record.count >= limit.maxRequests) {
      throw new BadRequestException(
        'Too many OAuth requests. Please try again later.',
      );
    }

    record.count++;
  }

  private async exchangeCodeWithRetry(
    provider: OAuthProvider,
    code: string,
  ): Promise<OAuthTokenResponse> {
    const clientId = this.configService.get<string>(
      `OAUTH_${provider.toUpperCase()}_CLIENT_ID`,
    )!;
    const clientSecret = this.configService.get<string>(
      `OAUTH_${provider.toUpperCase()}_CLIENT_SECRET`,
    )!;
    const redirectUri = this.configService.get<string>('OAUTH_REDIRECT_URI')!;
    const strategy = this.oauthStrategyFactory.getStrategy(provider);

    let lastError: Error | undefined;
    for (let attempt = 0; attempt < OAUTH_RETRY_CONFIG.maxAttempts; attempt++) {
      try {
        return await strategy.exchangeCode({
          httpService: this.httpService,
          clientId,
          clientSecret,
          code,
          redirectUri,
        });
      } catch (error) {
        lastError = error;
        if (attempt < OAUTH_RETRY_CONFIG.maxAttempts - 1) {
          await this.delay(OAUTH_RETRY_CONFIG.backoffMs[attempt]);
        }
      }
    }
    throw new BadRequestException(
      `OAuth token exchange failed: ${lastError?.message}`,
    );
  }

  private async getUserInfoWithRetry(
    provider: OAuthProvider,
    accessToken: string,
  ): Promise<OAuthUserInfo> {
    const strategy = this.oauthStrategyFactory.getStrategy(provider);

    let lastError: Error | undefined;
    for (let attempt = 0; attempt < OAUTH_RETRY_CONFIG.maxAttempts; attempt++) {
      try {
        return await strategy.getUserInfo({
          httpService: this.httpService,
          accessToken,
        });
      } catch (error) {
        lastError = error;
        if (attempt < OAUTH_RETRY_CONFIG.maxAttempts - 1) {
          await this.delay(OAUTH_RETRY_CONFIG.backoffMs[attempt]);
        }
      }
    }
    throw new BadRequestException(
      `Failed to get user info: ${lastError?.message}`,
    );
  }

  private async findOrCreateOAuthUser(
    provider: OAuthProvider,
    userInfo: OAuthUserInfo,
    tokenResponse: OAuthTokenResponse,
  ): Promise<any> {
    // Check if user with this email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    if (existingUser) {
      // If user has a password set, they cannot use OAuth account linking
      if (existingUser.password) {
        throw new ConflictException(
          'An account with this email already exists. Please login with your password.',
        );
      }

      // Link OAuth account to existing user
      await this.linkOAuthAccount(
        existingUser.id,
        provider,
        userInfo,
        tokenResponse,
      );

      // Update user info if changed
      const updatedUser = await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: userInfo.name,
          image: userInfo.avatar || existingUser.image,
        },
      });

      return updatedUser;
    }

    // Create new user with OAuth account
    const user = await this.prisma.user.create({
      data: {
        email: userInfo.email,
        name: userInfo.name,
        image: userInfo.avatar,
        verified: true,
        accounts: {
          create: {
            accountId: userInfo.providerId,
            providerId: provider.toString(),
            accessToken: await this.encryptionService.encrypt(
              tokenResponse.access_token,
            ),
            refreshToken: tokenResponse.refresh_token
              ? await this.encryptionService.encrypt(
                  tokenResponse.refresh_token,
                )
              : null,
            accessTokenExpiresAt: new Date(
              Date.now() + tokenResponse.expires_in * 1000,
            ),
            refreshTokenExpiresAt: tokenResponse.refresh_token
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
              : null,
            scope: OAUTH_SCOPES[provider],
          },
        },
      },
    });

    return user;
  }

  private async linkOAuthAccount(
    userId: string,
    provider: OAuthProvider,
    userInfo: OAuthUserInfo,
    tokenResponse: OAuthTokenResponse,
  ): Promise<void> {
    // Check if this OAuth account is already linked
    const existingAccount = await this.prisma.account.findFirst({
      where: {
        userId,
        providerId: provider.toString(),
        accountId: userInfo.providerId,
      },
    });

    if (existingAccount) {
      // Update tokens
      await this.prisma.account.update({
        where: { id: existingAccount.id },
        data: {
          accessToken: await this.encryptionService.encrypt(
            tokenResponse.access_token,
          ),
          refreshToken: tokenResponse.refresh_token
            ? await this.encryptionService.encrypt(tokenResponse.refresh_token)
            : null,
          accessTokenExpiresAt: new Date(
            Date.now() + tokenResponse.expires_in * 1000,
          ),
        },
      });
    } else {
      // Create new OAuth account link
      await this.prisma.account.create({
        data: {
          userId,
          accountId: userInfo.providerId,
          providerId: provider.toString(),
          accessToken: await this.encryptionService.encrypt(
            tokenResponse.access_token,
          ),
          refreshToken: tokenResponse.refresh_token
            ? await this.encryptionService.encrypt(tokenResponse.refresh_token)
            : null,
          accessTokenExpiresAt: new Date(
            Date.now() + tokenResponse.expires_in * 1000,
          ),
          refreshTokenExpiresAt: tokenResponse.refresh_token
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            : null,
          scope: OAUTH_SCOPES[provider],
        },
      });
    }
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
