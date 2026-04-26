# Seven7Barber API

Barbershop appointment booking platform backend.

## Tech Stack

- **Runtime:** Bun
- **Framework:** NestJS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT

## Getting Started

### Prerequisites

- Bun 1.x
- PostgreSQL 14+

### Installation

```bash
# Install dependencies
bun install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Copy environment file
cp .env.example .env
# Edit .env with your values
```

### Development

```bash
# Start in watch mode
bun run start:dev

# Run tests
bun test

# Run tests in watch mode
bun run test:watch

# Type check
bun run type-check

# Lint
bun run lint
```

### Production

```bash
# Build
bun run build

# Run
bun run start:prod
```

### Docker

```bash
# Build image
docker build -t seven7barber-api:latest .

# Run container
docker run -p 3000:3000 --env-file .env seven7barber-api:latest
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /health/live | Liveness probe |
| GET | /health/ready | Readiness probe |
| GET | /api/docs | Swagger documentation |

Full documentation at `/api/docs`.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| JWT_SECRET | Secret for JWT signing | Yes |
| PORT | Server port (default: 3000) | No |
| LOG_LEVEL | Log level (info, debug, warn, error) | No |

## Project Structure

```
src/
├── main.ts           # Application entry
├── app.module.ts     # Root module
├── app.controller.ts # Root controller
├── health/           # Health check endpoints
├── metrics/           # System metrics endpoint
├── common/            # Shared utilities (logger, middleware)
├── auth/              # Authentication module
├── users/             # User management
├── appointments/      # Booking system
├── services/          # Barber services
└── ...
```

## License

MIT