import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuthService } from './oauth.service';
import { PrismaService } from '../prisma/prisma.service';
import { EncryptionService } from './encryption.service';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { OAuthProvider } from './enums/oauth-provider.enum';
import { OAuthUserInfo, OAuthTokenResponse } from './interfaces/oauth.interface';

describe('OAuthService', () => {
  let service: OAuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let encryptionService: jest.Mocked<EncryptionService>;
  let httpService: jest.Mocked<HttpService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    image: null,
    verified: true,
    role: 'CLIENT' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOAuthAccount = {
    id: 'oauth-acc-1',
    accountId: 'github-12345',
    providerId: 'github',
    userId: 'user-123',
    accessToken: 'encrypted-token',
    refreshToken: null,
    idToken: null,
    accessTokenExpiresAt: null,
    refreshTokenExpiresAt: null,
    scope: 'email name avatar',
    password: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      account: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const mockEncryptionService = {
      encrypt: jest.fn().mockResolvedValue('encrypted-token'),
      decrypt: jest.fn().mockResolvedValue('decrypted-token'),
    };

    const mockHttpService = {
      post: jest.fn(),
      get: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        const config: Record<string, string> = {
          'OAUTH_GITHUB_CLIENT_ID': 'test-github-client-id',
          'OAUTH_GOOGLE_CLIENT_ID': 'test-google-client-id',
          'OAUTH_DISCORD_CLIENT_ID': 'test-discord-client-id',
          'OAUTH_REDIRECT_URI': 'http://localhost:3000/auth/oauth/callback/github',
        };
        return config[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EncryptionService, useValue: mockEncryptionService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<OAuthService>(OAuthService);
    prismaService = module.get(PrismaService);
    encryptionService = module.get(EncryptionService);
    httpService = module.get(HttpService);
  });

  describe('C1 | RED | should getAuthorizationUrl returns valid GitHub OAuth URL | ✅ FAIL', () => {
    it('should return a valid GitHub authorization URL with correct scopes', async () => {
      const result = await service.getAuthorizationUrl(OAuthProvider.GITHUB);

      expect(result).toContain('github.com/login/oauth/authorize');
      expect(result).toContain('scope=email+name+avatar');
      expect(result).toContain('client_id');
      expect(result).toContain('redirect_uri');
    });
  });

  describe('C2 | RED | should handleGitHubCallback creates new user with OAuth account | ✅ FAIL', () => {
    it('should create user and OAuth account when email does not exist', async () => {
      const code = 'test-auth-code';
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'ghp_testtoken123',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: null,
      };
      const userInfo: OAuthUserInfo = {
        email: 'newuser@example.com',
        name: 'New User',
        avatar: 'https://avatars.githubusercontent.com/u/12345',
        providerId: '12345',
      };

      prismaService.user.findUnique.mockResolvedValue(null);
      httpService.post.mockResolvedValue({ data: tokenResponse });
      httpService.get.mockResolvedValue({ data: userInfo });
      prismaService.user.create.mockResolvedValue({ ...mockUser, email: userInfo.email, name: userInfo.name, image: userInfo.avatar });
      prismaService.account.create.mockResolvedValue({ ...mockOAuthAccount, userId: mockUser.id });

      const result = await service.handleOAuthCallback(OAuthProvider.GITHUB, code);

      expect(prismaService.user.create).toHaveBeenCalled();
      expect(prismaService.account.create).toHaveBeenCalled();
      expect(result.user.email).toBe(userInfo.email);
    });
  });

  describe('C3 | RED | should handleGitHubCallback links to existing user | ✅ FAIL', () => {
    it('should link OAuth account when user with same email exists', async () => {
      const code = 'test-auth-code';
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'ghp_testtoken456',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: null,
      };
      const userInfo: OAuthUserInfo = {
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://avatars.githubusercontent.com/u/67890',
        providerId: '67890',
      };

      prismaService.user.findUnique.mockResolvedValue(mockUser);
      httpService.post.mockResolvedValue({ data: tokenResponse });
      httpService.get.mockResolvedValue({ data: userInfo });
      prismaService.account.create.mockResolvedValue({ ...mockOAuthAccount, userId: mockUser.id });

      const result = await service.handleOAuthCallback(OAuthProvider.GITHUB, code);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: userInfo.email } });
      expect(prismaService.account.create).toHaveBeenCalled();
      expect(result.user.email).toBe('test@example.com');
    });
  });

  describe('C4 | RED | should throw ConflictException when email exists with password | ✅ FAIL', () => {
    it('should throw ConflictException if user has password set (account merging not allowed)', async () => {
      const code = 'test-auth-code';
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'ghp_testtoken789',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: null,
      };
      const userInfo: OAuthUserInfo = {
        email: 'passworduser@example.com',
        name: 'Password User',
        avatar: 'https://avatars.githubusercontent.com/u/11111',
        providerId: '11111',
      };

      const userWithPassword = { ...mockUser, email: 'passworduser@example.com', password: 'hashed-password' };
      prismaService.user.findUnique.mockResolvedValue(userWithPassword);
      httpService.post.mockResolvedValue({ data: tokenResponse });
      httpService.get.mockResolvedValue({ data: userInfo });

      await expect(service.handleOAuthCallback(OAuthProvider.GITHUB, code))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('C5 | RED | should encrypt access token before storing | ✅ FAIL', () => {
    it('should encrypt access token before saving to database', async () => {
      const code = 'test-auth-code';
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'ghp_plaintext_token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: null,
      };
      const userInfo: OAuthUserInfo = {
        email: 'enc-test@example.com',
        name: 'Encrypt Test',
        avatar: null,
        providerId: '22222',
      };

      prismaService.user.findUnique.mockResolvedValue(null);
      httpService.post.mockResolvedValue({ data: tokenResponse });
      httpService.get.mockResolvedValue({ data: userInfo });
      prismaService.user.create.mockResolvedValue({ ...mockUser, email: userInfo.email });
      prismaService.account.create.mockImplementation(async (data: any) => ({ ...mockOAuthAccount, ...data }));

      await service.handleOAuthCallback(OAuthProvider.GITHUB, code);

      expect(encryptionService.encrypt).toHaveBeenCalledWith('ghp_plaintext_token');
    });
  });

  describe('C6 | RED | should getAuthorizationUrl returns valid Google OAuth URL | ✅ FAIL', () => {
    it('should return a valid Google authorization URL with correct scopes', async () => {
      const result = await service.getAuthorizationUrl(OAuthProvider.GOOGLE);

      expect(result).toContain('accounts.google.com/o/oauth2/v2/auth');
      expect(result).toContain('scope=email+profile+avatar');
      expect(result).toContain('client_id');
    });
  });

  describe('C7 | RED | should getAuthorizationUrl returns valid Discord OAuth URL | ✅ FAIL', () => {
    it('should return a valid Discord authorization URL with correct scopes', async () => {
      const result = await service.getAuthorizationUrl(OAuthProvider.DISCORD);

      expect(result).toContain('discord.com/api/oauth2/authorize');
      expect(result).toContain('scope=email+identify+avatar');
      expect(result).toContain('client_id');
    });
  });

  describe('C8 | RED | should handleOAuthCallback applies rate limiting | ✅ FAIL', () => {
    it('should throw BadRequestException when rate limit exceeded (5 requests/min)', async () => {
      const code = 'test-code';

      // Mock rate limit exceeded
      httpService.post.mockRejectedValue({ response: { status: 429 } });

      await expect(service.handleOAuthCallback(OAuthProvider.GITHUB, code))
        .rejects.toThrow(BadRequestException);
    });
  });
});