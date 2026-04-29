export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface OAuthUserInfo {
  email: string;
  name: string;
  avatar: string | null;
  providerId: string;
}

export interface OAuthAuthorizationUrlParams {
  provider: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  state?: string;
}
