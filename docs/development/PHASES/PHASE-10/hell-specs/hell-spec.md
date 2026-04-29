# HELL Specification: Phase 10 — Future Enhancements

**Project:** seven7barber
**Phase:** 10
**Status:** 🔥 ACTIVE
**Created:** 2026-04-27
**Patterns_Used:** [Information_Expert, Creator, Protected_Variations, Controller]

---

## 1. Requisitos Funcionais

### 1.1 Real OAuth (REQ-FEAT-01)

| ID | Requirement | Priority |
|----|-------------|----------|
| OAUTH-01 | Suportar GitHub OAuth2 com scopes: email, name, avatar | MUST |
| OAUTH-02 | Suportar Google OAuth2 com scopes: email, profile, avatar | MUST |
| OAUTH-03 | Suportar Discord OAuth2 com scopes: email, identify, avatar | MUST |
| OAUTH-04 | Account linking: mesmo email = mesmo user, múltiplos provedores por conta | MUST |
| OAUTH-05 | Access token guardado encriptado na BD | MUST |
| OAUTH-06 | Refresh token como future work — documentar como deferred feature | SHOULD |
| OAUTH-07 | Retry logic com rate limit (5 requests/minuto por provider) | MUST |

**Actors:** User (cliente), OAuth Provider (GitHub/Google/Discord)

**Use Cases:**
1. User clica "Login com GitHub" → redirect OAuth → callback com code → exchange token → create/link account → session
2. User tenta login com email existente via OAuth → linked automatically if email match
3. User tenta login com OAuth mas email já existe com password → error "email já registado"

**Edge Cases:**
- OAuth provider down → show error, fallback to email/password
- Token exchange fails → retry 3x with exponential backoff
- User revokes OAuth app → next login fails, prompt re-authorization

---

### 1.2 Push Notifications (REQ-FEAT-02)

| ID | Requirement | Priority |
|----|-------------|----------|
| PUSH-01 | Notificar via WhatsApp em PT | MUST |
| PUSH-02 | Triggers: cancelamento, alteração horário, lembrete 2h antes | MUST |
| PUSH-03 | Opt-out por utilizador (toggle global) | MUST |
| PUSH-04 | Webhook Twilio para delivery confirmation | MUST |
| PUSH-05 | Retry: 3 tentativas com backoff exponencial (1min, 5min, 15min) | MUST |
| PUSH-06 | Templates com variáveis: nome_cliente, servico, data, hora, local | MUST |

**Actors:** User (cliente), Twilio WhatsApp API, Appointment Service

**Use Cases:**
1. Appointment cancelled → notification template → Twilio API → webhook confirms delivery
2. Appointment modified → notification template with old/new values → send
3. 2h before appointment → reminder template → send
4. User disables WhatsApp → no notifications sent, log opt-out

**Edge Cases:**
- Twilio API rate limit → queue and retry
- Invalid phone number → mark as failed, alert admin
- Undelivered after 3 retries → mark as failed, store for manual review

---

### 1.3 Loyalty Program (REQ-FEAT-03)

| ID | Requirement | Priority |
|----|-------------|----------|
| LOYAL-01 | Conversão: 50 pontos = R$5.00 (1pt = R$0.10) | MUST |
| LOYAL-02 | Earn: appointment completed (dynamic based on price) | MUST |
| LOYAL-03 | Earn: review submitted (10 pontos) | MUST |
| LOYAL-04 | Earn: referral friend completed appointment (20 pontos) | MUST |
| LOYAL-05 | Earn: birthday bonus (25 pontos, no birthday month?) | MUST |
| LOYAL-06 | 5 tiers: Bronze (0), Prata (500), Ouro (1500), Diamante (5000), Radiante (10000) | MUST |
| LOYAL-07 | Expiração: tier points = 1 ano, conversion points = 2 meses | MUST |
| LOYAL-08 | Resgate: desconto monetary + serviços gratuitos | MUST |
| LOYAL-09 | Cancellation → points marked "pending_reversal" → confirmed on appointment actual cancellation | MUST |
| LOYAL-10 | Tier recalculated at each earn (upgrade only, never downgrade until expiry check) | MUST |

**Services gratuitos resgatáveis (definidos):**
- 500 pts: Corte básico (30min)
- 1000 pts: Corte + barba (60min)
- 2000 pts: Tratamento capilar premium (90min)

**Actors:** User (cliente), Appointment Service, Review Service, Referral Service

**Use Cases:**
1. Appointment completed → calculate points (price * 0.10) → add to user balance → check tier upgrade
2. User submits review → award 10 pts → check tier
3. Referral friend completes appointment → award 20 pts to referrer → check tier
4. User birthday → award 25 pts (once per year, checked by month)
5. User requests redemption → validate balance → deduct points → generate voucher

**Edge Cases:**
- Points expire → auto-deduct from balance, notify user
- Tier downgrade at expiry check → downgrade tier, notify benefits lost
- Insufficient points for redemption → error message
- Double-award prevention → idempotency key per appointment

---

### 1.4 Waiting List (REQ-FEAT-04)

| ID | Requirement | Priority |
|----|-------------|----------|
| WAIT-01 | FIFO com timestamp como desempate | MUST |
| WAIT-02 | Notificar top 3 quando slot abre | MUST |
| WAIT-03 | Timeout 30 minutos para confirmar após notificação | MUST |
| WAIT-04 | User pode sair voluntariamente a qualquer momento | MUST |
| WAIT-05 | Uma fila por combination (location + service + barber) | MUST |
| WAIT-06 | Slot cancelado vai para waitlist primeiro (5min), depois disponível para todos | MUST |

**Actors:** User (cliente), Appointment Service, Notification Service

**Use Cases:**
1. User joins waitlist → position assigned, estimated wait time shown
2. Slot opens → notify top 3 users → start 30min timer for each
3. User confirms → remove from waitlist, create appointment
4. Timer expires → remove from queue, notify next user
5. User cancels waitlist entry → remove from queue, no penalty

**Edge Cases:**
- User already has appointment for same slot → cannot join waitlist
- Slot still available after 5min waitlist hold → release to general availability
- All notified users timeout → slot released to general availability

---

### 1.5 Recurring Appointments (REQ-FEAT-05)

| ID | Requirement | Priority |
|----|-------------|----------|
| REC-01 | Padrões: Semanal, Bissemanal, Mensal | MUST |
| REC-02 | Limite: 12 marcações futuras por vez | MUST |
| REC-03 | Slot não existe → notificar user + pausar recurrência | MUST |
| REC-04 | Edição: "esta e futuras" (default), opção "só esta" | MUST |
| REC-05 | Cancelamento: "esta e futuras" (default), opção "só esta" | MUST |
| REC-06 | Paragem automática: account delete, barber exit, 3 no-shows consecutivos | MUST |
| REC-07 | Confirmação manual por instância (barbeiro confirma cada uma) | MUST |

**Actors:** User (cliente), Barber, Appointment Service

**Use Cases:**
1. User creates recurring → define pattern, service, barber, preferred slot → generate up to 12 future instances → pause if slot unavailable
2. User edits future instance → update only that instance or all future based on choice
3. User cancels "this and future" → cancel all pending, stop recurrence
4. Barber confirms appointment → mark as confirmed, advance recurrence window
5. No-show detected → increment counter, if 3 consecutive → pause recurrence + notify user

**Edge Cases:**
- Barber leaves platform → pause all recurrences for that barber, notify users
- Slot time changes (barber unavailable) → notify affected users, pause recurrence
- Month doesn't have day X (e.g., 31st) → use last day of month

---

### 1.6 Multi-Location (REQ-FEAT-06)

| ID | Requirement | Priority |
|----|-------------|----------|
| LOC-01 | User pode ter múltiplas locations com "favorite" default | MUST |
| LOC-02 | Cada location tem agenda independente (horário, barbers, serviços) | MUST |
| LOC-03 | Admin por location + Admin global | MUST |
| LOC-04 | Super-admin vê stats agregadas cross-location | MUST |
| LOC-05 | Cada location: nome próprio, morada, contacts | MUST |
| LOC-06 | Booking flow: filtro por localização; clientes vêem todas | MUST |

**Location timezone:** Brasília (America/Sao_Paulo) para todos

**Actors:** User (cliente), Admin (location), Super Admin (global)

**Use Cases:**
1. User selects location → show available barbers/services for that location
2. Location admin views dashboard → only sees their location data
3. Super admin views reports → sees aggregated data across all locations
4. User sets favorite location → pre-selected in booking flow
5. New location added → admin can configure services/barbers for that location

**Edge Cases:**
- Service not available at selected location → show only available locations
- Barber works at multiple locations → shown if slot available at selected location
- Location deactivated → bookings disabled, existing bookings handled gracefully

---

## 2. Requisitos Não-Funcionais

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-01 | OAuth response time < 3s (provider dependent) | SHOULD |
| NFR-02 | Notification delivery < 30s after trigger | SHOULD |
| NFR-03 | Loyalty points calculation idempotent | MUST |
| NFR-04 | Waitlist position accurate within 1 second | MUST |
| NFR-05 | Recurring generation completes within 5s | MUST |
| NFR-06 | Location switch不影响现有 appointments | MUST |

---

## 3. Domain Model (GRASP)

### 3.1 Entities

| Entity | Information Expert | Creator | Notes |
|--------|-------------------|---------|-------|
| User | User (owns auth, preferences) | Auth module | Contains OAuth links |
| OAuthAccount | User (belongs to user) | Auth module | Provider + tokens encripted |
| Appointment | User (books it), Barber (confirms), Location (where) | BookingService |  |
| LoyaltyAccount | User (owner) | LoyaltyService | Tier, points balance |
| LoyaltyTransaction | LoyaltyAccount (belongs to) | LoyaltyService | Idempotency key |
| WaitlistEntry | User (joins), Location+Service+Barber (combo) | WaitlistService | position, timestamp |
| RecurringPattern | User (owner), Barber, Service, Location | RecurringService | Pattern type + preferred slot |
| Location | - | SuperAdmin | Name, address, contacts |
| Admin | Location (if location admin) | SuperAdmin | Role = location/global |

### 3.2 Value Objects

| VO | Attributes | Immutable |
|----|------------|------------|
| Tier | name, minPoints, benefits | Yes |
| LoyaltyPoints | amount, type (earn/redeem/expire), expiresAt | Yes |
| RecurrencePattern | type (WEEKLY/BIWEEKLY/MONTHLY), preferredTime, preferredDay | Yes |
| WaitlistPosition | position, joinedAt | Yes |
| OAuthProvider | provider (GITHUB/GOOGLE/DISCORD), scopes | Yes |

### 3.3 Aggregates

```
User (Aggregate Root)
├── OAuthAccount[]
├── LoyaltyAccount
│   └── LoyaltyTransaction[]
├── WaitlistEntry[]
└── RecurringPattern[]

Location (Aggregate Root)
├── Service[]
└── Barber[] (assigned)

Appointment (Aggregate Root)
├── (references RecurringPattern if recurring)
└── (references WaitlistEntry if from waitlist)
```

---

## 4. Variation Points

### 4.1 OAuth Provider Implementation

**Interface:** `IOAuthProvider`
```typescript
interface IOAuthProvider {
  provider: OAuthProviderEnum;
  scopes: string[];
  exchangeCode(code: string): Promise<OAuthTokenResponse>;
  getUserInfo(accessToken: string): Promise<OAuthUserInfo>;
  refreshToken(refreshToken: string): Promise<OAuthTokenResponse>;
}
```

**Stable:** OAuth flow, user linking logic, token storage
**Variation:** Provider-specific API changes → implement new provider class

### 4.2 Notification Channel

**Interface:** `INotificationChannel`
```typescript
interface INotificationChannel {
  send(template: NotificationTemplate, recipient: User): Promise<DeliveryReceipt>;
}
```

**Stable:** Template engine, queue management, retry logic
**Variation:** WhatsApp → SMS fallback (future), Push → Email fallback (future)

### 4.3 Points Calculation Engine

**Interface:** `IPointsCalculator`
```typescript
interface IPointsCalculator {
  calculateEarn(type: EarnType, context: AppointmentContext): Points;
}
```

**Stable:** Tier logic, expiration rules, redemption validation
**Variation:** New earn types (referral, birthday) → extend enum + implement

### 4.4 Waitlist Position Calculator

**Interface:** `IWaitlistPositionStrategy`
```typescript
interface IWaitlistPositionStrategy {
  calculate(queue: WaitlistEntry[], newEntry: WaitlistEntry): number;
}
```

**Stable:** Entry management, notification triggers
**Variation:** Priority-based (future) → implement strategy pattern

### 4.5 Recurrence Generator

**Interface:** `IRecurrenceGenerator`
```typescript
interface IRecurrenceGenerator {
  generateNext(pattern: RecurrencePattern, lastDate: Date): Date | null;
  generateBatch(pattern: RecurrencePattern, count: number): Date[];
}
```

**Stable:** Pattern validation, limit enforcement, pause logic
**Variation:** New patterns (bi-weekly) → implement new method

### 4.6 Location Assignment

**Interface:** `ILocationAssigner`
```typescript
interface ILocationAssigner {
  assign(user: User, location: Location): void;
  getFavorite(user: User): Location | null;
}
```

**Stable:** User-location relationship, favorite logic
**Variation:** GPS-based auto-assignment (future) → implement strategy

---

## 5. Ubiquitous Language

| Term | Definition |
|------|------------|
| OAuth Account | Linked social login per user per provider |
| Loyalty Account | Per-user points balance + tier standing |
| Loyalty Transaction | Immutable record of points earned/redeemed/expired |
| Waitlist Entry | User's position in queue for a specific slot combination |
| Recurring Pattern | Template that generates future appointments automatically |
| Location | Physical barbershop branch with independent config |
| Tier | Rank in loyalty program with benefits (Bronze/Prata/Ouro/Diamante/Radiante) |
| Pending Reversal | Points marked to be removed if cancelled appointment is confirmed |
| Conversion Points | Points earned from purchases, redeemable for discounts |
| Tier Points | Points that count toward tier升级, never expire while tier active |
| Preferred Location | User's default location for faster booking |
| Location Admin | Admin who manages one specific location |
| Super Admin | Admin who manages all locations |

---

## 6. Gate Check

- [x] All requirements have priority (MUST/SHOULD/COULD/WONT)
- [x] Domain modeled with Entities, VOs, Aggregates
- [x] Variation points identified with interfaces
- [x] Glossary documented

**Gate Status:** ✅ PASS — Ready for TDD implementation