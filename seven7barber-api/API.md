# Seven7Barber API Documentation

## Base URL
- Production: `https://api.seven7barber.com`
- Development: `http://localhost:3000`

## Authentication
JWT Bearer token authentication.

## Endpoints

### Health
- `GET /health` - Service health check
- `GET /health/live` - Liveness probe
- `GET /health/ready` - Readiness probe

### Metrics
- `GET /metrics` - System metrics (requests, uptime, memory, CPU)

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh token

### Appointments
- `GET /appointments` - List user appointments
- `POST /appointments` - Create appointment
- `GET /appointments/:id` - Get appointment details
- `PATCH /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment

### Services
- `GET /services` - List all services
- `GET /services/:id` - Get service details

### Barbers
- `GET /barbers` - List all barbers
- `GET /barbers/:id` - Get barber details

## Interactive Docs
Visit `/api/docs` for Swagger UI with interactive documentation.