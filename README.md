# Tempest Seven7Barber

> Full-stack barbershop appointment booking system - Portfolio demonstration project

---

## Project Overview

**Tempest Seven7Barber** is a complete barbershop management platform built for portfolio demonstration. It showcases full-stack development capabilities with modern technologies and best practices.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vinext (Next.js 15, React 19, TypeScript) |
| Backend | NestJS (TypeScript) |
| Database | PostgreSQL (Supabase) |
| Package Manager | Bun |
| Testing | Vitest + Supertest |
| Storage | Cloudinary |
| Payments | Abacate Pay (mock/sandbox) |
| Email | SMTP (custom domain) |
| Deploy | Cloudflare Pages + Render |
| Docker | Docker Compose (local only) |

### Design System

Based on **Razorcuts Design System** with:
- **Primary:** #732F3B (wine/rose)
- **Neutral:** #111111, #272727, #bababa, #ffffff
- **Typography:** Oswald (headings) + Poppins (body)

---

## Features

### Authentication
- Email/password registration and login
- OAuth (GitHub, Google, Discord)
- Password reset via email
- JWT-based sessions with refresh tokens
- Role-based access (CLIENT, BARBER, ADMIN)

### Appointment Booking
- 3-step wizard: Service → Barber → Date/Time
- Real-time availability checking
- Status tracking: SCHEDULED → CONFIRMED → COMPLETED
- Appointment history

### Services & Pricing
- Service catalog with images, descriptions, duration, prices
- Category filtering
- Admin service management

### Reviews & Ratings
- 1-5 star rating system
- Text feedback with photos
- Service history logging

### Vouchers & Promotions
- Voucher types: FREE_SERVICE, DISCOUNT_PERCENTAGE, DISCOUNT_FIXED, CASHBACK
- Code-based redemption
- Time-limited promotions

### Admin Dashboard
- Metrics display (mock data)
- Service management
- Promotion management

---

## Project Structure

```
seven7barber/
├── seven7barber-web/          # Vinext frontend
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # UI components
│   │   ├── lib/              # Utilities
│   │   └── server/           # Server Actions
│   └── ...
├── seven7barber-api/          # NestJS backend
│   ├── src/
│   │   ├── auth/             # Authentication
│   │   ├── users/           # User management
│   │   ├── appointments/    # Booking system
│   │   ├── services/        # Service catalog
│   │   ├── reviews/         # Reviews
│   │   ├── vouchers/        # Vouchers
│   │   └── admin/           # Admin functions
│   └── ...
├── docker-compose.yml         # Local development
├── package.json               # Workspace config
└── README.md
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (package manager)
- [Docker](https://www.docker.com/) + Docker Compose

### Local Development

1. **Clone the repositories:**
```bash
git clone https://github.com/yourusername/seven7barber-web.git
git clone https://github.com/yourusername/seven7barber-api.git
```

2. **Start infrastructure (PostgreSQL):**
```bash
docker-compose up -d postgres
```

3. **Setup Frontend:**
```bash
cd seven7barber-web
bun install
bun run dev
```

4. **Setup Backend:**
```bash
cd seven7barber-api
bun install
bun run prisma migrate dev
bun run dev
```

5. **Access the app:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Docker (Full Stack)

```bash
docker-compose up -d
```

---

## Environment Variables

### Frontend (seven7barber-web)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLOUDINARY_CLOUD=your_cloud_name
```

### Backend (seven7barber-api)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/seven7barber
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud
ABACATE_PAY_API_KEY=test_key
ABACATE_PAY_SANDBOX=true
SMTP_HOST=smtp.yourdomain.com
SMTP_USER=hello@yourdomain.com
SMTP_PASS=your_password
FRONTEND_URL=http://localhost:5173
```

---

## Scripts

### Common
```bash
bun install              # Install all dependencies
bun run dev              # Start development
bun run build            # Production build
bun run lint             # Lint code
bun run type-check       # TypeScript check
```

### Frontend
```bash
cd seven7barber-web
bun run dev              # Dev server
bun run build            # Build for production
```

### Backend
```bash
cd seven7barber-api
bun run dev              # Dev server (watch mode)
bun run build            # Build for production
bun run start            # Run production
bun run prisma migrate   # Run migrations
bun run test             # Run tests
```

---

## Testing

```bash
# All tests (from root or api folder)
bun test

# Watch mode
bun run test:watch

# Coverage report
bun run test:coverage

# Specific file
bun test src/auth/auth.service.spec.ts
```

---

## Documentation

- [Product Requirements (PRD)](docs/prd/PRD.md)
- [Technical Specification (SPEC)](docs/specs/SPEC.md)
- [Product Backlog](docs/product/BACKLOG.md)
- [Roadmap](docs/roadmap/ROADMAP.md)
- [User Stories](docs/user-stories/USER_STORIES.md)
- [Wireframes](docs/wireframes/WIREFRAMES.md)

---

## Deployment

### Frontend (Cloudflare Pages)

1. Connect `seven7barber-web` repo to Cloudflare Pages
2. Configure build settings:
   - Build command: `bun install && bun run build`
   - Build output: `.next`
3. Add environment variables in Cloudflare dashboard
4. Deploy on push to main

### Backend (Render)

1. Connect `seven7barber-api` repo to Render
2. Create Web Service:
   - Build command: `bun install && bun run build`
   - Start command: `bun run start`
3. Add environment variables in Render dashboard
4. Auto-deploy from main branch

---

## Database Schema

```
User
├── Account (OAuth)
├── Session
├── Appointment
├── ServiceHistory
└── UserVoucher

BarberProfile

Service

Appointment
└── ServiceHistory

Voucher
└── UserVoucher

Promotion
└── UserPromotion
```

---

## API Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/forgot-password` - Send reset email
- `POST /auth/reset-password` - Reset password
- `GET /auth/me` - Get current user

### Appointments
- `GET /appointments` - List appointments
- `POST /appointments` - Create appointment
- `GET /appointments/availability` - Get available slots
- `PATCH /appointments/:id` - Update status

### Services
- `GET /services` - List all services
- `POST /services` - Create service (admin)
- `PATCH /services/:id` - Update service (admin)

### Reviews
- `GET /reviews` - List reviews
- `POST /reviews` - Create review
- `PATCH /reviews/:id` - Update review

### Admin
- `GET /admin/metrics` - Dashboard metrics
- `GET /admin/services` - Manage services
- `GET /admin/promotions` - Manage promotions

---

## Portfolio Highlights

This project demonstrates:

✅ **Full-stack architecture** - Separate frontend and backend repositories
✅ **Modern framework** - Next.js 15 App Router, NestJS
✅ **Database design** - Prisma with PostgreSQL
✅ **Authentication** - JWT, OAuth, role-based access
✅ **Testing** - Vitest with integration tests
✅ **Cloud deployment** - Cloudflare Pages, Render
✅ **Design system** - Custom Razorcuts tokens
✅ **Docker** - Local development environment

---

## License

This project is for portfolio demonstration purposes.

---

## Contact

For questions or collaboration opportunities, reach out via:
- GitHub: [yourusername](https://github.com/yourusername)
- Email: hello@yourdomain.com