import { OAuthTokenResponse, OAuthUserInfo } from '../interfaces/oauth.interface';

export interface OAuthProviderStrategy {
  readonly provider: string;

  /**
   * Build the full authorization URL for this provider
   */
  buildAuthorizationUrl(
    clientId: string,
    redirectUri: string,
    scope: string,
    state: string,
  ): string;

  /**
   * Exchange authorization code for tokens
   */
  exchangeCode(params: {
    httpService: any;
    clientId: string;
    clientSecret: string;
    code: string;
    redirectUri: string;
  }): Promise<OAuthTokenResponse>;

  /**
   * Fetch and normalize user info from provider API
   */
  getUserInfo(params: {
    httpService: any;
    accessToken: string;
  }): Promise<OAuthUserInfo>;
}
