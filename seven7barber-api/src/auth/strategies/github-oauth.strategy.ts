import { Injectable, BadRequestException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { OAuthProviderStrategy } from './oauth-provider.strategy';
import {
  OAuthTokenResponse,
  OAuthUserInfo,
} from '../interfaces/oauth.interface';

@Injectable()
export class GitHubOAuthStrategy implements OAuthProviderStrategy {
  readonly provider = 'github';

  buildAuthorizationUrl(
    clientId: string,
    redirectUri: string,
    scope: string,
    state: string,
  ): string {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      state,
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  async exchangeCode(params: {
    httpService: any;
    clientId: string;
    clientSecret: string;
    code: string;
    redirectUri: string;
  }): Promise<OAuthTokenResponse> {
    const response: any = await firstValueFrom(
      params.httpService.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: params.clientId,
          client_secret: params.clientSecret,
          code: params.code,
          redirect_uri: params.redirectUri,
          grant_type: 'authorization_code',
        },
      ),
    );
    return response.data;
  }

  async getUserInfo(params: {
    httpService: any;
    accessToken: string;
  }): Promise<OAuthUserInfo> {
    const response: any = await firstValueFrom(
      params.httpService.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${params.accessToken}` },
      }),
    );
    const data = response.data;
    return {
      email: data.email,
      name: data.name || data.login,
      avatar: data.avatar_url,
      providerId: String(data.id),
    };
  }
}
