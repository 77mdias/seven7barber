export enum OAuthProvider {
  GITHUB = 'github',
  GOOGLE = 'google',
  DISCORD = 'discord',
}

export const OAUTH_SCOPES = {
  [OAuthProvider.GITHUB]: 'email name avatar',
  [OAuthProvider.GOOGLE]: 'email profile avatar',
  [OAuthProvider.DISCORD]: 'email identify avatar',
} as const;

export const OAUTH_RETRY_CONFIG = {
  maxAttempts: 3,
  backoffMs: [1000, 3000, 10000],
  rateLimit: {
    maxRequests: 5,
    windowMs: 60000,
  },
} as const;