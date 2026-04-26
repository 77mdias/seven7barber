# Seven7Barber Web

Barbershop appointment booking platform frontend.

## Tech Stack

- **Framework:** Next.js 16 (Vinext)
- **UI:** React 19 + shadcn/ui
- **Styling:** Tailwind CSS
- **Auth:** NextAuth.js

## Getting Started

### Prerequisites

- Bun 1.x
- Node.js 20+

### Installation

```bash
# Install dependencies
bun install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your values
```

### Development

```bash
# Start dev server
bun run dev

# Build
bun run build

# Start production
bun run start
```

### Docker

```bash
# Build image
docker build -t seven7barber-web:latest .

# Run container
docker run -p 3000:3000 seven7barber-web:latest
```

## Features

- User registration and login
- Service browsing
- Barber selection
- Appointment booking wizard
- User dashboard

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_API_URL | Backend API URL | Yes |
| NEXTAUTH_SECRET | NextAuth session secret | Yes |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/              # Utilities and config
└── server/           # Server actions
```

## Health Endpoint

The `/health` route provides a health check for the frontend:
- `GET /health` — Returns `{ status: 'ok', timestamp: ... }`

## License

MIT