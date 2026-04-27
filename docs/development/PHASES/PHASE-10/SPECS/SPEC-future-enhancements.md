# SPEC: Future Enhancements — PHASE-10

**Phase:** 10
**Type:** Feature Specification
**Status:** 🔮 PROPOSTO
**Last Updated:** 2026-04-27

---

## 1. Overview

Technical specifications for the 6 future enhancement features proposed for PHASE-10. These features extend the core booking system with OAuth, notifications, loyalty, waitlist, recurring, and multi-location capabilities.

---

## 2. Feature Specifications

### 2.1 Real OAuth Providers

**Status:** 🔮 PROPOSTO
**Priority:** P0 (HIGH)

**Technical Requirements:**
- Environment variables: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`
- OAuth callback URL: `/api/auth/callback/[provider]`
- User linking: Match OAuth email to existing user or create new
- Token storage: Encrypted with AES-256 (from PHASE-09 REQ-HARD-05)

**API Endpoints:**
```
GET  /auth/github          → Redirect to GitHub OAuth
GET  /auth/github/callback → Handle OAuth callback
GET  /auth/google         → Redirect to Google OAuth
GET  /auth/google/callback → Handle OAuth callback
GET  /auth/discord         → Redirect to Discord OAuth
GET  /auth/discord/callback → Handle OAuth callback
```

**Database Changes:**
```prisma
model User {
  // ... existing fields
  oauthProviders OAuthProvider[]
}

model OAuthProvider {
  id        String   @id @default(cuid())
  userId    String
  provider  String   // "github" | "google" | "discord"
  providerId String  // ID from OAuth provider
  email     String
  user      User     @relation(fields: [userId], references: [id])

  @@unique([provider, providerId])
}
```

---

### 2.2 Push Notifications (Twilio)

**Status:** 🔮 PROPOSTO
**Priority:** P1 (MEDIUM)

**Technical Requirements:**
- Twilio Account SID, Auth Token, Phone Numbers
- WhatsApp Business API via Twilio
- Notification preferences per user (SMS/WhatsApp/Email)

**API Endpoints:**
```
POST /notifications/send       → Send notification
GET  /notifications/preferences → Get user preferences
PUT  /notifications/preferences → Update preferences
```

**Database Changes:**
```prisma
model NotificationPreference {
  id              String  @id @default(cuid())
  userId          String  @unique
  smsEnabled      Boolean @default(true)
  whatsappEnabled Boolean @default(false)
  emailEnabled    Boolean @default(true)
  reminderHours   Int     @default(24) // Hours before appointment
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String   // "reminder" | "confirmation" | "cancellation" | "review_request"
  channel   String   // "sms" | "whatsapp" | "email"
  status    String   // "pending" | "sent" | "failed"
  sentAt    DateTime?
  createdAt DateTime @default(now())
}
```

---

### 2.3 Loyalty Program

**Status:** 🔮 PROPOSTO
**Priority:** P2 (MEDIUM)

**Technical Requirements:**
- Points calculation: 1 point per R$1 spent (configurable)
- Tier thresholds: Bronze (0-500), Silver (500-2000), Gold (2000+)
- Points expiration: 12 months from earning

**API Endpoints:**
```
GET  /loyalty/points          → Get user points balance
GET  /loyalty/tier            → Get user tier status
GET  /loyalty/transactions     → Points history
POST /loyalty/redeem           → Redeem points for discount
GET  /loyalty/rewards          → Available rewards
```

**Database Changes:**
```prisma
model LoyaltyProgram {
  id            String   @id @default(cuid())
  name          String
  description   String?
  pointsCost    Int      // Points needed for redemption
  discountType  String   // "percentage" | "fixed"
  discountValue Float
  isActive      Boolean  @default(true)
}

model LoyaltyTransaction {
  id          String    @id @default(cuid())
  userId      String
  type        String    // "earn" | "redeem" | "expire"
  points      Int
  balance     Int       // Points after transaction
  referenceId String?   // Appointment ID if applicable
  description String?
  expiresAt   DateTime?
  createdAt   DateTime  @default(now())
}

model UserLoyalty {
  id             String   @id @default(cuid())
  userId         String   @unique
  currentPoints  Int      @default(0)
  lifetimePoints Int      @default(0)
  tier           String   @default("bronze") // "bronze" | "silver" | "gold"
  updatedAt      DateTime @updatedAt
}
```

---

### 2.4 Waiting List

**Status:** 🔮 PROPOSTO
**Priority:** P1 (MEDIUM)

**Technical Requirements:**
- Queue position based on signup time (FIFO)
- Automatic slot notification when opening occurs
- Time-limited acceptance window (30 minutes)

**API Endpoints:**
```
POST /waitlist/join        → Join waitlist for slot
DELETE /waitlist/leave/:id → Leave waitlist
GET  /waitlist/status/:id → Check position
```

**Database Changes:**
```prisma
model WaitlistEntry {
  id          String    @id @default(cuid())
  userId      String
  serviceId   String
  barberId    String
  date        DateTime
  time        String
  position    Int       // Queue position
  status      String    // "waiting" | "notified" | "booked" | "expired" | "cancelled"
  notifiedAt  DateTime?
  expiresAt   DateTime?
  createdAt   DateTime  @default(now())
}
```

---

### 2.5 Recurring Appointments

**Status:** 🔮 PROPOSTO
**Priority:** P3 (LOW)

**Technical Requirements:**
- Recurrence patterns: weekly, bi-weekly, monthly
- Maximum 12 future occurrences
- Auto-notify 7 days before each occurrence

**API Endpoints:**
```
POST /appointments/recurring     → Create recurring series
GET  /appointments/recurring/:id → Get series details
DELETE /appointments/recurring/:id → Cancel series
GET  /appointments/recurring/:id/instances → All instances
```

**Database Changes:**
```prisma
model RecurringPattern {
  id              String   @id @default(cuid())
  userId          String
  serviceId       String
  barberId        String
  dayOfWeek       Int?     // 0-6 for weekly
  dayOfMonth      Int?     // 1-31 for monthly
  time            String   // HH:mm format
  occurrences     Int      @default(12)
  createdAt       DateTime @default(now())

  instances       Appointment[]
}

model Appointment {
  // ... existing fields
  recurringPatternId String?
  recurringPattern   RecurringPattern? @relation(fields: [recurringPatternId], references: [id])
  isRecurringInstance Boolean @default(false)
}
```

---

### 2.6 Multi-Location

**Status:** 🔮 PROPOSTO
**Priority:** P4 (LOW)

**Technical Requirements:**
- Each location has own address, hours, contact
- Services can be location-specific or global
- Barbers assigned to one or more locations

**Database Changes:**
```prisma
model Location {
  id          String   @id @default(cuid())
  name        String
  address     String
  city        String
  state       String
  zipCode     String
  phone       String
  email       String?
  openingHours Json    // { "monday": { "open": "09:00", "close": "19:00" }, ... }
  isActive    Boolean  @default(true)

  barbers     BarberLocation[]
  services    ServiceLocation[]
}

model BarberLocation {
  id        String   @id @default(cuid())
  barberId  String
  locationId String
  barber    Barber   @relation(fields: [barberId], references: [id])
  location  Location @relation(fields: [locationId], references: [id])

  @@unique([barberId, locationId])
}

model ServiceLocation {
  id         String   @id @default(cuid())
  serviceId  String
  locationId String
  price      Float?   // Override default price if needed
  service    Service  @relation(fields: [serviceId], references: [id])
  location   Location @relation(fields: [locationId], references: [id])

  @@unique([serviceId, locationId])
}

model Appointment {
  // ... existing fields
  locationId String?
}
```

---

## 3. Common Requirements

### 3.1 Error Handling
- All endpoints return structured error responses
- Validation via Zod schemas
- Appropriate HTTP status codes

### 3.2 Authentication
- All endpoints require JWT authentication (existing system)
- Admin-only endpoints require ADMIN role

### 3.3 Testing
- Unit tests for service layer
- Integration tests for API endpoints
- Mock Twilio for notification tests

---

## 4. Dependencies

- PHASE-09: Security Hardening II (OAuth encryption, rate limiting)
- Existing: User, Appointment, Service, Barber models

---

## 5. References

- [PROPOSAL-future-enhancements.md](../../../PROPOSALS/PROPOSAL-future-enhancements.md)
- [PHASE-09 phase-board.md](../PHASE-09/phase-board.md)
- [ROADMAP.md](../../../ROADMAP.md)
