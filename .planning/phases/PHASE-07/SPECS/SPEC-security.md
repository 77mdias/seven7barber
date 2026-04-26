# SPEC: Security Hardening — Phase 07

**Phase:** 07
**Status:** PLANNING
**Created:** 2026-04-26

---

## 1. Overview

This specification defines the security hardening requirements for Phase 07. All HIGH severity findings from REVIEW.md must be resolved.

---

## 2. REQ-SEC-01: Availability Race Condition

### Problem
No atomic check-and-book in `availability.service.ts`. Two clients can book the same slot simultaneously.

### Solution
Use Prisma transaction with `SERIALIZABLE` isolation level.

```typescript
// In booking flow, wrap check-and-book in transaction
await this.prisma.$transaction(async (tx) => {
  // 1. Check if slot is still available
  const existing = await tx.appointment.findFirst({
    where: { barberId, dateTime, status: { not: 'CANCELLED' } }
  });
  if (existing) throw new BadRequestException('Slot no longer available');
  
  // 2. Create appointment
  return tx.appointment.create({ data });
}, { isolationLevel: 'Serializable' });
```

### Files
- `seven7barber-api/src/availability/availability.service.ts`
- `seven7barber-api/src/appointments/booking.service.ts`

---

## 3. REQ-SEC-02: Timezone Handling

### Problem
`getAvailableSlots` uses server local timezone for hour extraction, but `dateTime` stored in UTC.

### Solution
Ensure all dateTime operations use UTC. Use `toISOString()` and parse consistently.

```typescript
// Always store in UTC
const dateTimeUTC = new Date(dateStr + 'T' + timeStr + ':00.000Z');

// When comparing, ensure both sides are UTC
const slotMins = dateTimeUTC.getUTCHours() * 60 + dateTimeUTC.getUTCMinutes();
```

---

## 4. REQ-SEC-03: Voucher userId Spoofing

### Problem
`vouchers.controller.ts` accepts arbitrary `userId` from request body.

### Status
✅ PARTIALLY FIXED — Controller now uses `req.user.id`, but service still needs verification.

### Additional Fix
Verify `vouchers.service.ts` also uses authenticated user ID, not body-provided one.

---

## 5. REQ-SEC-04: Payment Signature Verification

### Problem
`payments.service.ts:88-89` uses hardcoded `'valid-signature'`.

### Solution
Implement proper signature verification using HMAC-SHA256 with a secret key from environment.

```typescript
import * as crypto from 'crypto';

const expectedSignature = crypto
  .createHmac('sha256', process.env.PAYMENT_WEBHOOK_SECRET)
  .update(JSON.stringify(dto))
  .digest('hex');

if (dto.signature !== expectedSignature) {
  throw new BadRequestException('Invalid signature');
}
```

### Environment Variable
```env
PAYMENT_WEBHOOK_SECRET=your_webhook_secret_here
```

---

## 6. REQ-SEC-05: OAuth Token Encryption

### Problem
`Account` model stores `accessToken`, `refreshToken`, `idToken` as plain strings.

### Solution
Encrypt tokens at rest using AES-256-GCM.

```typescript
import * as crypto from 'crypto';

const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY; // 32 bytes

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

export function decryptToken(encrypted: string): string {
  const [ivHex, authTagHex, encryptedData] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

---

## 7. REQ-SEC-06: Auth Response Validation

### Problem
`server/auth.ts` doesn't check `response.ok` on any endpoint.

### Solution
Add validation to all auth functions:

```typescript
export async function signIn(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, { ... });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Login failed');
  }
  return res.json();
}
```

### Files
- `seven7barber-web/src/server/auth.ts`
- `seven7barber-web/src/lib/auth-client.ts`

---

## 8. REQ-SEC-07: Token Refresh Mechanism

### Problem
JWT expires in 1 day but no `/auth/refresh` endpoint exists.

### Solution
Implement refresh token flow:

```typescript
// auth.controller.ts
@Post('refresh')
async refresh(@Body() dto: { refreshToken: string }) {
  // Verify refresh token
  // Generate new access token
  // Optionally rotate refresh token
}
```

### Prisma Schema Update
Add `refreshToken` field to `User` model with expiry.

---

## 9. REQ-SEC-08: Rate Limiting

### Problem
No brute force protection on auth endpoints.

### Solution
Add `@nestjs/throttler`:

```typescript
// auth.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 5, // 5 attempts per minute
    }]),
  ],
})
export class AuthModule {}
```

Apply to login/refresh endpoints.

---

## 10. Test Scenarios

| # | Scenario | Expected Result |
|---|----------|------------------|
| T1 | Two concurrent booking requests for same slot | Only one succeeds, other gets 400 |
| T2 | Payment callback with wrong signature | 400 BadRequest |
| T3 | Voucher validate as user A, userId in body is user B | Uses authenticated user A |
| T4 | Request with expired JWT | 401, prompt for refresh |
| T5 | 6th login attempt within 1 minute | 429 Too Many Requests |

---

## 11. Dependencies

- Node.js 18+
- @nestjs/throttler package
- PAYMENT_WEBHOOK_SECRET env var
- TOKEN_ENCRYPTION_KEY env var (32 hex chars)