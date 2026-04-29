import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { OAuthProviderStrategy } from './oauth-provider.strategy';
import {
  OAuthTokenResponse,
  OAuthUserInfo,
} from '../interfaces/oauth.interface';

@Injectable()
export class GoogleOAuthStrategy implements OAuthProviderStrategy {
  readonly provider = 'google';

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
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeCode(params: {
    httpService: any;
    clientId: string;
    clientSecret: string;
    code: string;
    redirectUri: string;
  }): Promise<OAuthTokenResponse> {
    const response = await firstValueFrom(
      params.httpService.post('https://oauth2.googleapis.com/token', {
        client_id: params.clientId,
        client_secret: params.clientSecret,
        code: params.code,
        redirect_uri: params.redirectUri,
        grant_type: 'authorization_code',
      }),
    );
    return response.data;
  }

  async getUserInfo(params: {
    httpService: any;
    accessToken: string;
  }): Promise<OAuthUserInfo> {
    const response = await firstValueFrom(
      params.httpService.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${params.accessToken}` },
        },
      ),
    );
    const data = response.data;
    return {
      email: data.email,
      name: data.name,
      avatar: data.picture,
      providerId: data.id,
    };
  }
}
