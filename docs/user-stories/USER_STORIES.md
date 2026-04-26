# Tempest Seven7Barber - User Stories

**Version:** 1.0
**Date:** 2026-04-24

---

## 1. Overview

This document contains all user stories for Tempest Seven7Barber, formatted for agile development and portfolio demonstration.

---

## 2. User Roles

| Role | Description |
|------|-------------|
| CLIENT | End user who books appointments |
| BARBER | Service provider (future implementation) |
| ADMIN | Platform manager |

---

## 3. Authentication Stories

### AUTH-01: User Registration
**As a** new visitor
**I want to** create an account with email and password
**So that** I can access the booking system

**Acceptance Criteria:**
- [ ] Form has email, password, name fields
- [ ] Password must be 8+ chars with uppercase, number
- [ ] Email must be valid format
- [ ] Success: Account created, redirect to login
- [ ] Error: Show validation messages inline

---

### AUTH-02: User Login
**As a** registered user
**I want to** login with email and password
**So that** I can access my account

**Acceptance Criteria:**
- [ ] Form has email and password fields
- [ ] Success: Redirect to dashboard
- [ ] Error: "Invalid credentials" message
- [ ] Remember me option available
- [ ] Redirect to intended page after login

---

### AUTH-03: Password Reset
**As a** user who forgot my password
**I want to** reset my password via email
**So that** I can regain account access

**Acceptance Criteria:**
- [ ] Enter email to receive reset link
- [ ] Email contains reset link (expires 1h)
- [ ] Link opens password reset page
- [ ] New password must meet requirements
- [ ] Success: Password updated, auto-login

---

### AUTH-04: Email Verification
**As a** new user
**I want to** verify my email address
**So that** I can confirm my identity

**Acceptance Criteria:**
- [ ] After registration, show "verify email" message
- [ ] Email sent with verification link
- [ ] Click link verifies account
- [ ] Verified badge appears on profile

---

## 4. Service & Booking Stories

### BOOK-01: Browse Services
**As a** visitor or logged-in user
**I want to** see available services and prices
**So that** I can choose what I need

**Acceptance Criteria:**
- [ ] Services displayed as cards with image
- [ ] Each card shows: name, description, price, duration
- [ ] Services grouped by category (if applicable)
- [ ] "Book Now" button on each service

---

### BOOK-02: Start Booking
**As a** client
**I want to** start the booking process
**So that** I can schedule an appointment

**Acceptance Criteria:**
- [ ] "Book Now" opens scheduling wizard
- [ ] Step indicator shows current step (1/3)
- [ ] Progress preserved across steps
- [ ] Can navigate back to previous step

---

### BOOK-03: Select Service
**As a** client
**I want to** choose a service from the catalog
**So that** I can specify what I need

**Acceptance Criteria:**
- [ ] All active services displayed
- [ ] Can filter by category
- [ ] Selected service highlighted
- [ ] "Continue" button enabled after selection

---

### BOOK-04: Select Barber
**As a** client
**I want to** choose a specific barber or any available
**So that** I can book with my preferred professional

**Acceptance Criteria:**
- [ ] List of active barbers shown
- [ ] Each barber card shows: photo, name, rating
- [ ] "Any Available" option at top
- [ ] Selected barber highlighted

---

### BOOK-05: Select Date & Time
**As a** client
**I want to** pick an available date and time slot
**So that** I can schedule at my convenience

**Acceptance Criteria:**
- [ ] Calendar shows current and next month
- [ ] Unavailable dates grayed out
- [ ] Click date shows available time slots
- [ ] Time slots shown in 30-min increments
- [ ] Selected slot highlighted

---

### BOOK-06: Confirm Booking
**As a** client
**I want to** review and confirm my booking details
**So that** I can ensure everything is correct

**Acceptance Criteria:**
- [ ] Summary shows: service, barber, date, time, price
- [ ] Optional notes field
- [ ] Terms acceptance checkbox
- [ ] "Confirm Booking" button
- [ ] Loading state while processing

---

### BOOK-07: Booking Confirmation
**As a** client
**I want to** receive confirmation after booking
**So that** I know my appointment is set

**Acceptance Criteria:**
- [ ] Success screen with confetti/checkmark
- [ ] Booking reference number shown
- [ ] Email sent with appointment details
- [ ] "View My Bookings" button
- [ ] "Book Another" option

---

## 5. Dashboard Stories

### DASH-01: View My Appointments
**As a** logged-in client
**I want to** see all my appointments
**So that** I can manage my schedule

**Acceptance Criteria:**
- [ ] List of upcoming appointments
- [ ] Past appointments in separate tab
- [ ] Each appointment shows: service, barber, date/time, status
- [ ] Can cancel upcoming appointments
- [ ] Status badges: SCHEDULED, CONFIRMED, COMPLETED, CANCELLED

---

### DASH-02: Cancel Appointment
**As a** client
**I want to** cancel an upcoming appointment
**So that** I can free the slot for others

**Acceptance Criteria:**
- [ ] "Cancel" button on upcoming appointments
- [ ] Confirmation dialog: "Are you sure?"
- [ ] Cancellation reason required
- [ ] Success: Status changes to CANCELLED
- [ ] Email sent confirming cancellation

---

### DASH-03: View Appointment Details
**As a** client
**I want to** see full details of an appointment
**So that** I have all the information

**Acceptance Criteria:**
- [ ] Modal or page with full details
- [ ] Service name and price
- [ ] Barber name and photo
- [ ] Date, time, duration
- [ ] Location/salon info
- [ ] Booking reference

---

## 6. Review Stories

### REV-01: Leave Review
**As a** client with completed appointment
**I want to** leave a review for the service
**So that** I can share my experience

**Acceptance Criteria:**
- [ ] "Leave Review" button on completed appointments
- [ ] Star rating selector (1-5)
- [ ] Text feedback field (optional)
- [ ] Photo upload option (optional)
- [ ] Submit saves review

---

### REV-02: View Reviews
**As a** any visitor
**I want to** see reviews for services and barbers
**So that** I can make informed decisions

**Acceptance Criteria:**
- [ ] Reviews page with all reviews
- [ ] Filter by service or barber
- [ ] Shows: user name, rating, date, feedback, photos
- [ ] Average rating displayed
- [ ] Pagination for many reviews

---

### REV-03: Edit Review
**As a** client
**I want to** edit my review
**So that** I can update my feedback

**Acceptance Criteria:**
- [ ] "Edit" button on own reviews
- [ ] Pre-filled form with current content
- [ ] Can change rating and text
- [ ] Save updates the review
- [ ] "Edited" badge appears

---

## 7. Voucher Stories

### VOU-01: Apply Voucher
**As a** client at booking confirmation
**I want to** apply a voucher code
**So that** I can get a discount

**Acceptance Criteria:**
- [ ] "Have a voucher?" link on confirmation
- [ ] Text input for code
- [ ] "Apply" button validates code
- [ ] Valid: Show discount applied, update total
- [ ] Invalid: "Invalid or expired code"
- [ ] Voucher details shown if valid

---

### VOU-02: Redeem Voucher
**As a** client with valid voucher
**I want to** use my voucher on booking
**So that** I get the promised discount

**Acceptance Criteria:**
- [ ] Voucher applied to booking total
- [ ] FREE_SERVICE type sets price to 0
- [ ] DISCOUNT_PERCENTAGE reduces by percentage
- [ ] DISCOUNT_FIXED reduces by fixed amount
- [ ] Receipt shows original and discounted price

---

### VOU-03: View My Vouchers
**As a** client
**I want to** see my available vouchers
**So that** I know what I can use

**Acceptance Criteria:**
- [ ] Profile section lists my vouchers
- [ ] Each shows: code, type, value, expiry
- [ ] Expired vouchers marked as such
- [ ] Used vouchers show "Used" badge

---

## 8. Profile Stories

### PROFILE-01: Edit Profile
**As a** logged-in user
**I want to** edit my profile information
**So that** my details are up to date

**Acceptance Criteria:**
- [ ] Form with name, email, phone fields
- [ ] Current values pre-filled
- [ ] Validation on save
- [ ] Success message on update

---

### PROFILE-02: Upload Profile Photo
**As a** logged-in user
**I want to** upload a profile photo
**So that** my profile looks personal

**Acceptance Criteria:**
- [ ] Current photo displayed
- [ ] "Change Photo" button
- [ ] File picker for image (jpg, png, webp)
- [ ] Preview before save
- [ ] Upload to Cloudinary on save

---

### PROFILE-03: Change Password
**As a** logged-in user
**I want to** change my password
**So that** I can maintain security

**Acceptance Criteria:**
- [ ] Current password field
- [ ] New password field
- [ ] Confirm new password field
- [ ] New password must meet requirements
- [ ] Success changes password

---

## 9. Admin Stories

### ADMIN-01: View Dashboard
**As an** admin
**I want to** see platform metrics
**So that** I understand business health

**Acceptance Criteria:**
- [ ] Dashboard shows key metrics cards
- [ ] Appointments today, this week, this month
- [ ] Revenue (mock data)
- [ ] Active barbers count
- [ ] Pending reviews count
- [ ] Charts for trends (mock data)

---

### ADMIN-02: Manage Services
**As an** admin
**I want to** add, edit, and remove services
**So that** the catalog stays current

**Acceptance Criteria:**
- [ ] List of all services
- [ ] "Add Service" button opens form
- [ ] Edit icon on each service
- [ ] Delete with confirmation
- [ ] Form: name, description, duration, price, category, image

---

### ADMIN-03: Manage Promotions
**As an** admin
**I want to** create and manage promotions
**So that** I can run marketing campaigns

**Acceptance Criteria:**
- [ ] List of active and past promotions
- [ ] "Create Promotion" button
- [ ] Form: title, description, type, value, start/end dates
- [ ] Edit existing promotions
- [ ] Deactivate promotion

---

## 10. Story Mapping

### Epic: User Registration & Auth
- AUTH-01 User Registration
- AUTH-02 User Login
- AUTH-03 Password Reset
- AUTH-04 Email Verification

### Epic: Booking Flow
- BOOK-01 Browse Services
- BOOK-02 Start Booking
- BOOK-03 Select Service
- BOOK-04 Select Barber
- BOOK-05 Select Date & Time
- BOOK-06 Confirm Booking
- BOOK-07 Booking Confirmation

### Epic: User Dashboard
- DASH-01 View My Appointments
- DASH-02 Cancel Appointment
- DASH-03 View Appointment Details

### Epic: Reviews & Ratings
- REV-01 Leave Review
- REV-02 View Reviews
- REV-03 Edit Review

### Epic: Vouchers & Promotions
- VOU-01 Apply Voucher
- VOU-02 Redeem Voucher
- VOU-03 View My Vouchers

### Epic: Profile Management
- PROFILE-01 Edit Profile
- PROFILE-02 Upload Profile Photo
- PROFILE-03 Change Password

### Epic: Admin Platform
- ADMIN-01 View Dashboard
- ADMIN-02 Manage Services
- ADMIN-03 Manage Promotions

---

## 11. Definition of Done

All stories must meet:
- [ ] Code compiles without errors
- [ ] Unit tests written and passing
- [ ] Integration tests for API endpoints
- [ ] UI matches design system
- [ ] Responsive on mobile (320px-1440px)
- [ ] No console errors
- [ ] Accessibility: keyboard navigable, ARIA labels
- [ ] Loading and error states handled