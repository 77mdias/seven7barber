import { Injectable, BadRequestException } from '@nestjs/common';
import { OAuthProvider } from '../enums/oauth-provider.enum';
import { OAuthProviderStrategy } from './oauth-provider.strategy';
import { GitHubOAuthStrategy } from './github-oauth.strategy';
import { GoogleOAuthStrategy } from './google-oauth.strategy';
import { DiscordOAuthStrategy } from './discord-oauth.strategy';

@Injectable()
export class OAuthStrategyFactory {
  private readonly strategies: Map<string, OAuthProviderStrategy>;

  constructor(
    private readonly githubStrategy: GitHubOAuthStrategy,
    private readonly googleStrategy: GoogleOAuthStrategy,
    private readonly discordStrategy: DiscordOAuthStrategy,
  ) {
    this.strategies = new Map<string, OAuthProviderStrategy>([
      [OAuthProvider.GITHUB, this.githubStrategy],
      [OAuthProvider.GOOGLE, this.googleStrategy],
      [OAuthProvider.DISCORD, this.discordStrategy],
    ]);
  }

  getStrategy(provider: string): OAuthProviderStrategy {
    const strategy = this.strategies.get(provider);
    if (!strategy) {
      throw new BadRequestException(
        `Unsupported OAuth provider: ${provider}`,
      );
    }
    return strategy;
  }
}
