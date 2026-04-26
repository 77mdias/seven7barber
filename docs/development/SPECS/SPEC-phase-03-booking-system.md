---
title: "SPEC: PHASE-03 Booking System Implementation"
type: "spec"
status: "draft"
phase: "03"
created: "2026-04-26"
---

# SPEC: PHASE-03 Booking System Implementation

## Overview

This spec covers the implementation details for the PHASE-03 Booking System tasks:
- TASK-012: Web Service Catalog View
- TASK-013: API Availability Engine
- TASK-014: Booking Wizard (Frontend)
- TASK-015: Appointment History Dashboard
- TASK-016: Mock OAuth Setup

## TASK-012: Web Service Catalog View

### Implementation

**Page:** `seven7barber-web/src/app/services/page.tsx`

```typescript
// Server Action
async function getServices(category?: string): Promise<Service[]>

// Page structure
- Grid layout with responsive columns (1/2/3/4 based on breakpoints)
- ServiceCard component with halftone hover effect
- Category filter via URL search params: ?category=cut
- Search by service name via: ?search=corte
```

**ServiceCard Component:** `seven7barber-web/src/components/booking/service-card.tsx`
- Props: `{ id, name, description, price, duration, category }`
- States: default, hover (scale + shadow), loading (skeleton)
- Design: Primary border, price badge, duration indicator

**API Integration:**
- `GET /services` via fetch to `NEXT_PUBLIC_API_URL/services`
- Category filter: `GET /services?category=X`
- Caching: SWR with 5-minute revalidation

### Criteria Checklist
- [x] Page `/services` with grid of cards
- [x] Card showing: name, description, price, duration, category
- [ ] Filter by category (URL params)
- [ ] Search by name
- [ ] Loading skeleton state
- [ ] Empty state when no services

---

## TASK-013: API Availability Engine

### Schema Updates

```prisma
model TimeSlot {
  id        String   @id @default(uuid())
  barberId  String
  date      DateTime @db.Date
  startTime DateTime
  endTime   DateTime
  isBooked  Boolean  @default(false)
  createdAt DateTime @default(now())

  barber    User     @relation(fields: [barberId], references: [id])

  @@index([barberId, date])
  @@index([date, isBooked])
}

model WorkingHours {
  id        String   @id @default(uuid())
  barberId  String   @unique
  dayOfWeek Int      // 0=Sunday, 6=Saturday
  startTime String   // "09:00"
  endTime   String   // "18:00"
  isActive  Boolean  @default(true)

  barber    User     @relation(fields: [barberId], references: [id])
}
```

### Module Structure

**Module:** `seven7barber-api/src/availability/availability.module.ts`
```typescript
@Module({
  imports: [PrismaModule],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
```

**Controller:** `seven7barber-api/src/availability/availability.controller.ts`
```
GET /availability?date=YYYY-MM-DD&serviceIds=1,2,3&barberId=optional
```

**Service:** `seven7barber-api/src/availability/availability.service.ts`

```typescript
interface AvailableSlot {
  slotId: string;
  barberId: string;
  barberName: string;
  startTime: string;
  endTime: string;
}

class AvailabilityService {
  async getAvailableSlots(
    date: string,
    serviceIds: string[],
    barberId?: string
  ): Promise<AvailableSlot[]>

  private calculateSlotDuration(serviceIds: string[]): number
  private getBarberWorkingHours(barberId: string, dayOfWeek: number): WorkingHours | null
  private filterBookedSlots(slots: TimeSlot[], existingAppointments: Appointment[]): TimeSlot[]
  private generateTimeSlots(workingHours: WorkingHours, duration: number, date: Date): TimeSlot[]
}
```

**Logic:**
1. Sum service durations (all selected services)
2. Add 15-minute buffer between appointments
3. Get barber working hours for the day
4. Generate all possible slots for the duration
5. Filter out already booked slots
6. Filter out slots that don't fit the service duration

### Cache Strategy
- Cache key: `availability:${date}:${barberId || 'all'}:${serviceIds.join(',')}`
- TTL: 5 minutes
- Invalidation: On appointment create/update/cancel

### Criteria Checklist
- [ ] GET /availability?date&serviceIds endpoint
- [ ] Return slots per barber
- [ ] Consider working hours
- [ ] Block booked slots
- [ ] Consider service duration
- [ ] 15-minute buffer between slots

---

## TASK-014: Booking Wizard (Frontend)

### Component Structure

```
seven7barber-web/src/app/booking/
├── page.tsx                 # Main booking page (redirect to wizard)
├── wizard/
│   ├── page.tsx            # Wizard container
│   ├── step-service.tsx    # Step 1: Service selection
│   ├── step-barber.tsx     # Step 2: Barber selection
│   ├── step-datetime.tsx   # Step 3: Date/time selection
│   ├── step-confirm.tsx    # Step 4: Summary & confirm
│   ├── wizard-context.tsx  # React context for state
│   └── wizard-nav.tsx      # Navigation controls
```

**WizardContext State:**
```typescript
interface BookingWizardState {
  currentStep: number;       // 0-3
  serviceId: string | null;
  serviceIds: string[];      // Multiple services
  barberId: string | null;
  slotId: string | null;
  slotTime: string | null;
  isSubmitting: boolean;
  stepStartedAt: number;
}

interface BookingWizardActions {
  setServices: (ids: string[]) => void;
  setBarber: (id: string | null) => void;
  setSlot: (slotId: string, time: string) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  submit: () => Promise<{ success: boolean; appointmentId?: string }>;
}
```

**Step 1 - Service Selection:**
- Grid of service cards (multi-select with checkboxes)
- Running total of price and duration
- "Continue" button enabled when at least one service selected

**Step 2 - Barber Selection:**
- Cards with photo, name, specialties
- "Any available" option (first available barber)
- Skip option (barber is optional)

**Step 3 - Date/Time:**
- Calendar component (date picker)
- Available slots grid (fetched from `/availability` endpoint)
- Visual indication of selected slot

**Step 4 - Confirmation:**
- Summary of selections
- Total price
- "Confirm Booking" button
- Success/error handling

**URL State:**
- Query params: `?step=1&service=svc-1,svc-2&barber=barber-1&slot=slot-123`
- State persisted in URL for shareability

### Criteria Checklist
- [ ] Step 1: Multi-select services with cart
- [ ] Step 2: Barber selection cards with "any available"
- [ ] Step 3: Slot selection with calendar
- [ ] Step 4: Summary before confirm
- [ ] Validation before advancing
- [ ] State in URL params
- [ ] Server Action for booking creation

---

## TASK-015: Appointment History Dashboard

### Page Structure

```
seven7barber-web/src/app/dashboard/
├── layout.tsx              # Dashboard layout with sidebar
├── appointments/
│   ├── page.tsx           # Appointments list
│   └── [id]/
│       └── page.tsx       # Appointment detail
```

**Server Actions:**
```typescript
async function getClientAppointments(filters?: {
  status?: 'upcoming' | 'completed' | 'cancelled';
}): Promise<Appointment[]>

async function cancelAppointment(id: string): Promise<{ success: boolean }>
```

**Components:**
- `AppointmentCard`: service name, barber name, date/time, status badge, price
- `AppointmentFilters`: tab-based filter (upcoming/completed/cancelled)
- `EmptyState`: illustration + CTA when no appointments

**Status Badges:**
- SCHEDULED/CONFIRMED: `bg-blue-100 text-blue-800`
- COMPLETED: `bg-green-100 text-green-800`
- CANCELLED: `bg-red-100 text-red-800`
- NO_SHOW: `bg-gray-100 text-gray-800`

**Cancel Logic:**
- Only allowed for pending/scheduled appointments
- Must be 24+ hours before appointment time
- Uses PATCH /appointments/:id with status CANCELLED

### Criteria Checklist
- [ ] `/dashboard/appointments` page listing
- [ ] AppointmentCard with all details
- [ ] Filters: upcoming, completed, cancelled
- [ ] Detail view (modal or page)
- [ ] Cancel action for eligible appointments
- [ ] Empty state

---

## TASK-016: Mock OAuth Setup

### Files to Create

**`.env.example`** (root and seven7barber-api):
```bash
# Auth Providers (OAuth)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:5173

# For development with mock providers:
USE_MOCK_AUTH=true
MOCK_USER_EMAIL=test@seven7barber.dev
MOCK_USER_PASSWORD=devpassword123
```

**`seven7barber-web/src/lib/auth.ts`** (mock providers):
```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const mockUsers = [
  {
    id: 'mock-client-1',
    email: 'client@seven7barber.dev',
    password: 'devpassword123',
    name: 'Test Client',
    role: 'CLIENT',
  },
  {
    id: 'mock-barber-1',
    email: 'barber@seven7barber.dev',
    password: 'devpassword123',
    name: 'Test Barber',
    role: 'BARBER',
  },
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'mock-credentials',
      name: 'Mock Development Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = mockUsers.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        );
        if (user) return { id: user.id, email: user.email, name: user.name, role: user.role };
        return null;
      },
    }),
    // Real OAuth providers (disabled when USE_MOCK_AUTH=true)
    ...(process.env.USE_MOCK_AUTH === 'true'
      ? []
      : [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          }),
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 days,
  },
};
```

### Documentation

**`docs/development/OAUTH-SETUP.md`:**
- How to set up real OAuth providers
- How to use mock auth for development
- Environment variable reference

### Criteria Checklist
- [ ] .env.example with OAuth vars
- [ ] Mock providers in NextAuth config
- [ ] NEXTAUTH_SECRET and NEXTAUTH_URL configured
- [ ] Documentation for real credentials setup
- [ ] Test login via mock provider

---

## Dependencies

```
TASK-012 (Web Service Catalog)
  └── TASK-011 (API Services) ✅ DONE

TASK-013 (Availability Engine)
  └── TASK-011 (API Services)
  └── Prisma schema updates

TASK-014 (Booking Wizard)
  └── TASK-012 (Service Catalog)
  └── TASK-013 (Availability Engine)
  └── wizard.spec.ts ✅ DONE (tests)

TASK-015 (Appointment Dashboard)
  └── TASK-014 (Booking Wizard)

TASK-016 (Mock OAuth)
  └── GAP-002 solution
  └── TASK-008 (Auth Integration)
```

---

## Implementation Order

1. **Schema Updates** (for TASK-013): Add TimeSlot, WorkingHours, update Service
2. **TASK-016**: Mock OAuth (independent, unblocks dev)
3. **TASK-013**: Availability Engine (backend, critical path)
4. **TASK-012**: Service Catalog (frontend, depends on TASK-011)
5. **TASK-014**: Booking Wizard (depends on TASK-012, TASK-013)
6. **TASK-015**: Dashboard (depends on TASK-014)

---

## Test Strategy

### TASK-013 (Availability Engine)
```typescript
describe('AvailabilityService', () => {
  describe('getAvailableSlots', () => {
    it('returns all slots when no appointments exist')
    it('filters out booked slots')
    it('sums service durations correctly')
    it('applies 15-minute buffer between slots')
    it('respects barber working hours')
  });
});
```

### TASK-014 (Booking Wizard)
```typescript
// Tests already in wizard.spec.ts
describe('Wizard Logic', () => {
  describe('Step Navigation', () => { /* C30-C34 */ });
  describe('Step Completion', () => { /* C35-C38 */ });
  describe('State Persistence', () => { /* C39-C40 */ });
  describe('Timeout Handling', () => { /* C41-C42 */ });
  describe('Submit State', () => { /* C43 */ });
});
```

### TASK-015 (Dashboard)
```typescript
describe('AppointmentDashboard', () => {
  it('displays upcoming appointments')
  it('filters by status correctly')
  it('shows cancel button for eligible appointments')
  it('displays empty state when no appointments')
});
```