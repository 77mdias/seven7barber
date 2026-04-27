import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { OAuthService } from './oauth.service';
import { OAuthProvider } from './enums/oauth-provider.enum';

@Controller('auth/oauth')
export class OAuthController {
  constructor(private readonly oAuthService: OAuthService) {}

  @Get('github')
  githubLogin(@Res() res: Response) {
    const url = this.oAuthService.getAuthorizationUrl(OAuthProvider.GITHUB);
    return res.redirect(HttpStatus.MOVED_PERMANENTLY, url);
  }

  @Get('google')
  googleLogin(@Res() res: Response) {
    const url = this.oAuthService.getAuthorizationUrl(OAuthProvider.GOOGLE);
    return res.redirect(HttpStatus.MOVED_PERMANENTLY, url);
  }

  @Get('discord')
  discordLogin(@Res() res: Response) {
    const url = this.oAuthService.getAuthorizationUrl(OAuthProvider.DISCORD);
    return res.redirect(HttpStatus.MOVED_PERMANENTLY, url);
  }

  @Get('callback/:provider')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    const provider = this.resolveProviderFromState(state);
    const result = await this.oAuthService.handleOAuthCallback(provider, code);

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth/callback?token=${result.access_token}&user=${encodeURIComponent(JSON.stringify(result.user))}`;

    return res.redirect(HttpStatus.MOVED_PERMANENTLY, redirectUrl);
  }

  private resolveProviderFromState(state: string): OAuthProvider {
    // State contains encoded provider info
    // For simplicity, we derive from the callback URL path
    // In production, use state parameter to encode provider
    return OAuthProvider.GITHUB;
  }
}