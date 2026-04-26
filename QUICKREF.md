# Quick Reference — Seven7Barber Development

**Last Updated:** 2026-04-26

---

## 1. Prerequisites

```bash
# Required tools
- Bun (package manager)     → https://bun.sh
- Docker + Docker Compose   → https://docker.com
- PostgreSQL client (psql)  → Optional, for direct DB access
```

---

## 2. Quick Start (5 minutes)

### 2.1 Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/seven7barber.git
cd seven7barber

# Install all dependencies (from root)
bun install
```

### 2.2 Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values (minimal setup for dev):
cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://seven7barber:seven7barber_dev@localhost:5432/seven7barber"

# JWT (generate a random string)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# Mock Auth (set to true for development)
USE_MOCK_AUTH="true"

# API URL (frontend uses this)
NEXT_PUBLIC_API_URL="http://localhost:3001"
EOF
```

### 2.3 Start Infrastructure

```bash
# Start PostgreSQL with Docker
docker compose up -d postgres

# Wait for PostgreSQL to be ready (5 seconds)
sleep 5
```

### 2.4 Setup Database

```bash
# Navigate to API directory
cd seven7barber-api

# Run migrations
bun run prisma migrate dev --name init

# (Optional) Seed database with sample data
# bun run prisma db seed
```

### 2.5 Start Development Servers

```bash
# Terminal 1: Start API (NestJS)
cd seven7barber-api
bun run dev

# Terminal 2: Start Web (Next.js)
cd seven7barber-web
bun run dev
```

### 2.6 Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |
| API Docs (Swagger) | http://localhost:3001/api/docs |
| Health Check | http://localhost:3001/health |

---

## 3. Development Commands

### 3.1 Root Commands (from project root)

```bash
bun install              # Install all workspace dependencies
bun run dev              # Start full stack (API + Web)
bun run build            # Build all packages
bun run lint             # Lint all code
bun run type-check       # TypeScript check
```

### 3.2 API Commands (from seven7barber-api/)

```bash
bun run dev              # Start in watch mode (reloads on changes)
bun run build            # Build for production
bun run start            # Run production build
bun run start:dev        # Start with nest watch

# Database
bun run prisma migrate   # Run migrations
bun run prisma studio    # Open Prisma Studio (GUI)
bun run prisma generate  # Regenerate Prisma client
bun run prisma db push   # Push schema without migration

# Testing
bun test                 # Run all tests
bun run test:watch       # Watch mode
bun run test:cov         # Coverage report
bun test src/auth/       # Test specific module
```

### 3.3 Web Commands (from seven7barber-web/)

```bash
bun run dev              # Start Next.js dev server
bun run build            # Build for production
bun run lint             # Lint code
```

---

## 4. Testing the Application

### 4.1 API Tests

```bash
cd seven7barber-api

# Run all tests
bun test

# Run with coverage
bun run test:cov

# Run specific test file
bun test src/auth/auth.service.spec.ts

# Run in watch mode
bun run test:watch
```

### 4.2 Manual API Testing

```bash
# Health check
curl http://localhost:3001/health

# Get services (public)
curl http://localhost:3001/services

# Register a user
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'

# Use mock auth (no registration needed)
# Set USE_MOCK_AUTH=true in .env and use these credentials:
# Client: client@barber.com / devpassword123
# Barber: barber@barber.com / devpassword123
# Admin: admin@barber.com / devpassword123
```

### 4.3 Browser Testing

1. Open http://localhost:5173
2. Click "Login" or "Register"
3. Use mock credentials:
   - **Email:** `client@barber.com`
   - **Password:** `devpassword123`
4. Explore the dashboard, services, and booking wizard

---

## 5. Project Structure

```
seven7barber/
├── seven7barber-api/          # NestJS Backend
│   ├── src/
│   │   ├── auth/             # JWT authentication
│   │   ├── users/            # User management
│   │   ├── appointments/     # Booking system
│   │   ├── services/        # Service catalog
│   │   ├── barbers/          # Barber profiles
│   │   ├── availability/     # Slot calculation
│   │   ├── reviews/          # Ratings & feedback
│   │   ├── vouchers/         # Promotions
│   │   ├── payments/         # Mock payment gateway
│   │   ├── notifications/    # Email notifications
│   │   ├── admin/            # Admin dashboard
│   │   ├── health/           # Health endpoints
│   │   ├── metrics/          # Metrics endpoint
│   │   └── common/           # Shared utilities
│   └── prisma/
│       └── schema.prisma     # Database schema
│
├── seven7barber-web/          # Next.js Frontend
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   │   ├── (auth)/        # Login, register pages
│   │   │   ├── booking/       # Booking wizard
│   │   │   ├── services/      # Service catalog
│   │   │   ├── dashboard/    # User dashboard
│   │   │   └── admin/         # Admin pages
│   │   └── components/       # React components
│   └── public/               # Static assets
│
├── docker-compose.yml         # Local development
└── .env.example              # Environment template
```

---

## 6. Key Features to Test

### 6.1 Authentication ✅
- [ ] Register with email/password
- [ ] Login with credentials
- [ ] Mock login (client@barber.com / devpassword123)
- [ ] JWT token validation

### 6.2 Services Catalog ✅
- [ ] View all services
- [ ] Filter by category
- [ ] Search services

### 6.3 Booking Wizard ✅
- [ ] Step 1: Select service
- [ ] Step 2: Select barber
- [ ] Step 3: Select date/time
- [ ] Step 4: Confirm booking
- [ ] View confirmation

### 6.4 Dashboard ✅
- [ ] View appointment history
- [ ] See upcoming appointments
- [ ] Cancel appointments

### 6.5 Admin Dashboard ✅
- [ ] View metrics (mock data)
- [ ] Manage services (CRUD)
- [ ] View all appointments

### 6.6 Reviews & Vouchers ✅
- [ ] Leave review after appointment
- [ ] Apply voucher code
- [ ] Create voucher (admin)

---

## 7. Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
docker compose restart postgres

# Check logs
docker compose logs postgres

# Verify DATABASE_URL in .env
cat .env | grep DATABASE_URL
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3001  # For API
lsof -i :5173  # For Web

# Kill process
kill -9 <PID>

# Or use a different port
PORT=3002 bun run dev
```

### Prisma Errors

```bash
# Reset database
cd seven7barber-api
bun run prisma migrate reset

# Regenerate client
bun run prisma generate
```

### Clean Install

```bash
# Remove node_modules and reinstall
rm -rf node_modules
rm bun.lock
bun install
```

---

## 8. Environment Variables Reference

### Backend (seven7barber-api/.env)

```env
# Required
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
JWT_SECRET="your-secret-key"

# Optional (with defaults)
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"

# Mock Auth (development)
USE_MOCK_AUTH="true"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Email (mock in dev)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""

# Payment (mock)
ABACATE_PAY_API_KEY="test_key"
ABACATE_PAY_SANDBOX="true"
```

### Frontend (seven7barber-web/.env)

```env
# Required
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Optional
NEXT_PUBLIC_CLOUDINARY_CLOUD=""
```

---

## 9. Useful Links

| Resource | URL |
|----------|-----|
| Swagger API Docs | http://localhost:3001/api/docs |
| Prisma Studio | `cd seven7barber-api && bun run prisma studio` |
| Health Check | http://localhost:3001/health |
| Metrics | http://localhost:3001/metrics |

---

## 10. Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot connect to database" | Run `docker compose up -d postgres` |
| "Module not found" | Run `bun install` in both api and web folders |
| "Port already in use" | Kill process using port or change port |
| "Prisma client error" | Run `bun run prisma generate` |
| "Mock auth not working" | Ensure `USE_MOCK_AUTH="true"` in .env |

---

**Happy coding! 🚀**
