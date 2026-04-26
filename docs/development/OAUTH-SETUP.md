# OAuth Setup Guide — Seven7Barber

## Quick Start (Development with Mock Auth)

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Set `USE_MOCK_AUTH=true` (already default in .env.example)

3. Login with mock credentials:
- **Client:** `client@seven7barber.dev` / `devpassword123`
- **Barber:** `barber@seven7barber.dev` / `devpassword123`
- **Admin:** `admin@seven7barber.dev` / `devpassword123`

## Real OAuth Setup

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create New OAuth App:
   - Application name: `Seven7Barber Dev`
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:5173/api/auth/callback/github`
3. Generate Client Secret
4. Add to `.env`:
```bash
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → APIs & Services → Credentials
3. Create OAuth Client ID
4. Authorized redirect URI: `http://localhost:5173/api/auth/callback/google`
5. Add to `.env`:
```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

### Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create Application
3. OAuth2 → Add Redirect URL: `http://localhost:5173/api/auth/callback/discord`
4. Copy Client ID and Secret
5. Add to `.env`:
```bash
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
```

## Disable Mock Auth (Production)

In your `.env`:
```bash
USE_MOCK_AUTH=false
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `USE_MOCK_AUTH` | `true` = use mock login, `false` = real OAuth | Yes (dev) |
| `NEXTAUTH_SECRET` | Secret for NextAuth JWT signing | Yes |
| `NEXTAUTH_URL` | Base URL for OAuth callbacks | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID | For GitHub OAuth |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret | For GitHub OAuth |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | For Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | For Google OAuth |
| `DISCORD_CLIENT_ID` | Discord OAuth client ID | For Discord OAuth |
| `DISCORD_CLIENT_SECRET` | Discord OAuth client secret | For Discord OAuth |

## Troubleshooting

### "OAuth callback error"
- Check `NEXTAUTH_URL` matches your local URL exactly
- Ensure callback URL in OAuth provider matches

### "Invalid credentials" with mock auth
- Verify `USE_MOCK_AUTH=true` is set
- Check you're using exact email: `client@seven7barber.dev`
- Check password: `devpassword123` (all lowercase)

### Session expires immediately
- Check `NEXTAUTH_SECRET` is set (minimum 32 characters)
- Run: `openssl rand -base64 32` to generate