# SPEC: Code Quality & Polish — Phase 08

**Phase:** 08
**Status:** PLANNING
**Created:** 2026-04-26

---

## 1. Overview

This specification defines the code quality requirements for Phase 08. All MEDIUM severity findings from REVIEW.md must be resolved.

---

## 2. REQ-QUAL-01: Admin Error Handling

### Problem
`admin.service.ts:70-71` uses `throw new Error()` instead of NestJS exceptions.

### Solution
Replace with proper NestJS exceptions:

```typescript
// Before
throw new Error('Appointment not found');

// After
throw new NotFoundException('Appointment not found');

// Before
throw new Error('Invalid date range');

// After  
throw new BadRequestException('Invalid date range');
```

---

## 3. REQ-QUAL-02: Admin Input Validation

### Problem
No input validation on date filters, no pagination limit.

### Solution
Add DTO validation and pagination:

```typescript
// GetBookingsDto
@IsOptional()
@IsDateString()
startDate?: string;

@IsOptional()
@IsDateString()
endDate?: string;

@IsOptional()
@IsInt()
@Min(1)
@Max(100)
limit?: number = 50;
```

---

## 4. REQ-QUAL-03: Double Zod Validation

### Problem
`services.controller.ts:24` validates with Zod in controller and again in service.

### Solution
Single validation point — validate in controller, pass parsed DTO to service.

```typescript
// Controller
const dto = createServiceSchema.parse(body);
return this.servicesService.create(dto);

// Service receives already-parsed object, no need to parse again
```

---

## 5. REQ-QUAL-04: Barbers Data Leak

### Problem
`barbers.service.ts` has no `select` clause, returns full User model including password hash.

### Solution
Add explicit select clause:

```typescript
const barbers = await this.prisma.user.findMany({
  where: { role: 'BARBER', verified: true },
  select: {
    id: true,
    email: true,
    name: true,
    role: true,
    avatarUrl: true,
    createdAt: true,
    // Explicitly exclude: password, verified, etc.
  }
});
```

---

## 6. REQ-QUAL-05: Error Boundaries

### Problem
No `error.tsx` files in any web route.

### Solution
Create error.tsx for all routes:

```
seven7barber-web/src/app/
├── (auth)/
│   └── error.tsx
├── (main)/
│   └── error.tsx
├── booking/
│   └── error.tsx
├── dashboard/
│   └── error.tsx
├── admin/
│   └── error.tsx
└── error.tsx (root)
```

Example error boundary:
```tsx
'use client'

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

---

## 7. REQ-QUAL-06: Non-Functional UI

### Problems
- `dashboard/appointments/page.tsx:155` — Cancel button has no handler
- `page.tsx:60` — Hero CTA button does nothing

### Solutions

**Cancel button:**
```tsx
const handleCancel = async (appointmentId: string) => {
  try {
    await cancelAppointment(appointmentId);
    router.refresh();
  } catch (error) {
    // show toast
  }
};
```

**Hero CTA:**
```tsx
<Link href="/booking">
  <Button className="...">Book Now</Button>
</Link>
```

---

## 8. REQ-QUAL-07: Case Sensitive Voucher

### Problem
`vouchers.service.ts:9-10` voucher code lookup is case-sensitive.

### Solution
Normalize to uppercase in lookup:

```typescript
const normalizedCode = code.toUpperCase().trim();
const voucher = await this.prisma.voucher.findFirst({
  where: { code: normalizedCode }
});
```

---

## 9. REQ-QUAL-08: Noop Provider Wrapper

### Problem
`providers.tsx` is a no-op wrapper component.

### Solution
Either implement properly or remove:

**Option A: Implement**
```tsx
export function Providers({ children }) {
  const [session] = useSession();
  // Add context providers
  
  return <SessionProvider>{children}</SessionProvider>;
}
```

**Option B: Remove**
Remove the wrapper and use `SessionProvider` directly in layout.

---

## 10. Additional Cleanup (LOW)

| # | File | Issue | Fix |
|---|------|-------|-----|
| L1 | Multiple files | `any` types pervasive | Add proper types |
| L3 | auth.middleware.ts | Error response may leak stack traces | Sanitize error messages |
| L9 | sitemap.ts | noIndex pages included | Filter out noIndex |
| L10 | step-indicator.tsx | Unused `Link` import | Remove import |

---

## 11. Test Scenarios

| # | Scenario | Expected Result |
|---|----------|------------------|
| T1 | Admin error | 404/400 NestJS exception, not 500 |
| T2 | Barbers list API | No password hashes in response |
| T3 | Trigger error boundary | Graceful error UI, not white screen |
| T4 | Click cancel button | Appointment cancelled |
| T5 | Click hero CTA | Navigate to booking |
| T6 | Voucher code lowercase | Validates correctly |

---

## 12. Dependencies

- React error boundary patterns
- Proper TypeScript types for auth module