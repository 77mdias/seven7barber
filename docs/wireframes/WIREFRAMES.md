# Tempest Seven7Barber - Wireframes Overview

**Version:** 2.0
**Date:** 2026-04-25
**Design System:** Razorcuts + Esports Motion System

This document references the wireframes for Tempest Seven7Barber, based on the Razorcuts design system enhanced with motion and interaction patterns from the BnB Esports design system.

---

## 1. Wireframe Files

All wireframes are created using Pencil MCP and saved as `.pen` files in `/docs/wireframes/`.

### 1.1 Wireframe Files
- `landing.pen` - Home/landing page
- `services.pen` - Services catalog
- `booking-wizard.pen` - 3-step booking flow
- `dashboard.pen` - User dashboard
- `auth.pen` - Login/Register pages
- `admin.pen` - Admin dashboard

---

## 2. Design System Reference

### 2.1 Color Palette (Razorcuts + Esports)

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Primary | #732F3B | `--primary` | Buttons, accents, CTA |
| Primary Dark | #401021 | `--primary-dark` | Hover states |
| Primary Red (Esports) | #D92323 | `--p5-red` | Highlights, alerts |
| Black | #111111 | `--foreground` | Headers, dark sections |
| Dark Gray | #272727 | - | Body text |
| Muted | #bababa | `--muted` | Secondary text |
| White | #ffffff | `--background` | Backgrounds |
| Light | #f9f9f9 | - | Alternating sections |
| Surface Dark | #1a1a1a | `--p5-black` | Dark surfaces (esports) |
| Surface Grey | #2F2F2F | `--p5-grey` | Cards, panels |
| Page BG Dark | #202020 | - | Dark mode background |

### 2.2 Typography

| Style | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| H1 | Oswald | 66px | 700 | Page titles |
| H2 | Oswald | 40px | 600 | Section titles |
| H3 | Poppins | 28px | 600 | Card headings |
| H4 | Poppins | 22px | 600 | Subheadings |
| Body | Poppins | 17px | 400 | Paragraphs |
| Caption | Poppins | 13px | 400 | Helper text |
| **Esports Display** | Anton | 72px | - | Hero headlines, CTAs |
| **Esports Heading** | Anton | 48px | - | Section titles |
| **Esports Sub** | Anton | 32px | - | Card titles |
| **Marker Accent** | Permanent Marker | 24px | - | Handwritten accents |

### 2.3 Spacing

- Base unit: 8px
- Scale: 8, 16, 24, 32, 40, 48, 64, 80px
- Container max-width: 1200px

---

## 3. Esports Motion System (BnB Integration)

### 3.1 Keyframe Animations

```css
/* Slide In with Skew */
@keyframes slideInLeft {
    from { transform: translateX(-100%) skewX(-10deg); opacity: 0; }
    to { transform: translateX(0) skewX(-10deg); opacity: 1; }
}
@keyframes slideInRight {
    from { transform: translateX(100%) skewX(-10deg); opacity: 0; }
    to { transform: translateX(0) skewX(-10deg); opacity: 1; }
}

/* Pulse with Rotation (logo, featured elements) */
@keyframes pulse-p5 {
    0% { transform: scale(1) rotate(-3deg); }
    50% { transform: scale(1.05) rotate(-3deg); }
    100% { transform: scale(1) rotate(-3deg); }
}

/* Usage Classes */
.animate-enter-left { animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-enter-right { animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-pulse-slow { animation: pulse-p5 3s infinite; }
```

### 3.2 Clip Paths

```css
.clip-jagged { clip-path: polygon(0 0, 100% 0, 98% 100%, 2% 98%); }
.clip-slant-right { clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%); }
.clip-slant-left { clip-path: polygon(10% 0, 100% 0, 100% 100%, 0% 100%); }
```

### 3.3 Hard Shadows

```css
.text-shadow-hard { text-shadow: 4px 4px 0px #000; }
.box-shadow-hard { box-shadow: 8px 8px 0px #000; }
```

### 3.4 Halftone Patterns

```css
.bg-halftone {
    background-image: radial-gradient(#202020 20%, transparent 20%), radial-gradient(#202020 20%, transparent 20%);
    background-color: var(--p5-red);
    background-position: 0 0, 5px 5px;
    background-size: 10px 10px;
}
```

---

## 4. UI Components (Esports Style)

### 4.1 Navigation Buttons

```css
/* Primary - Wine Red */
.nav-btn {
    background: var(--primary);
    color: white;
    padding: 12px 24px;
    transform: skewX(-12deg);
    border: 2px solid black;
    transition: all 0.3s;
}
.nav-btn:hover {
    background: var(--primary-dark);
    transform: translateY(2px);
}

/* Dark Variant */
.nav-btn-dark {
    background: var(--foreground);
    color: white;
    border: 2px solid white;
}
.nav-btn-dark:hover {
    background: var(--p5-red);
}
```

### 4.2 CTA Button (Esports Style)

```css
.cta-btn {
    position: relative;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
}
.cta-btn-shadow {
    position: absolute;
    inset: 0;
    background: var(--foreground);
    transform: translateX(8px) translateY(8px);
    clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%);
    z-index: 0;
}
.cta-btn-main {
    position: relative;
    background: var(--primary);
    color: white;
    padding: 20px 40px;
    clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%);
    border: 2px solid black;
    font-family: 'Oswald', sans-serif;
    font-size: 24px;
    text-transform: uppercase;
    letter-spacing: 2px;
    z-index: 1;
    transition: background 0.3s, color 0.3s;
}
.cta-btn:hover .cta-btn-main {
    background: white;
    color: var(--primary);
}
```

### 4.3 Social Icons

```css
.social-icon {
    width: 40px;
    height: 40px;
    background: white;
    color: var(--foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid transparent;
    transition: all 0.3s;
}
.social-icon:hover {
    background: var(--p5-red);
    color: white;
    border-color: white;
    transform: rotate(-12deg);
}
```

### 4.4 Input Fields (Esports Style)

```css
.input-esports {
    background: transparent;
    border: none;
    border-bottom: 2px solid white;
    padding: 12px 0;
    color: white;
    font-family: 'Oswald', sans-serif;
    font-size: 16px;
    width: 100%;
    outline: none;
    transition: border-color 0.3s;
}
.input-esports:focus {
    border-color: var(--primary);
}
```

### 4.5 Cards (Esports Style)

```css
.card-esports {
    background: var(--p5-grey);
    border: 2px solid var(--foreground);
    padding: 24px;
    transition: all 0.3s;
}
.card-esports:hover {
    transform: translateY(-4px);
    box-shadow: var(--box-shadow-hard);
}
```

### 4.6 Logo Block

```css
.logo-block {
    position: relative;
    display: inline-block;
    transform: rotate(-2deg);
    transition: transform 0.3s;
}
.logo-block:hover {
    transform: scale(1.1) rotate(-2deg);
}
.logo-front {
    background: var(--foreground);
    color: white;
    padding: 16px;
    clip-path: polygon(0 0, 100% 0, 98% 100%, 2% 98%);
    border: 2px solid white;
    position: relative;
    z-index: 10;
}
.logo-shadow {
    position: absolute;
    inset: 0;
    background: var(--p5-red);
    clip-path: polygon(0 0, 100% 0, 98% 100%, 2% 98%);
    transform: translateX(4px) translateY(4px);
    z-index: 0;
}
```

---

## 5. Page Wireframes

### 5.1 Landing Page

```
┌─────────────────────────────────────────────────────────┐
│ NAV: Logo | Home | Services | About | Contact | Login   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────┐  ┌──────────────────────┐ │
│  │     HERO SECTION        │  │                      │ │
│  │                         │  │   HALFTONE PATTERN   │ │
│  │  SEVEN7BARBER           │  │   or SLIDER IMAGE    │ │
│  │                         │  │                      │ │
│  │  Estilo que Define      │  │   (esports clip-path │ │
│  │  Você                   │  │    ou skew effects)  │ │
│  │                         │  │                      │ │
│  │  [ BOOK NOW ]           │  │                      │ │
│  │  (CTA Esports Style)    │  │                      │ │
│  └─────────────────────────┘  └──────────────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  SERVICES SECTION (bg: light)                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                    │
│  │ Service │ │ Service │ │ Service │                    │
│  │  Card   │ │  Card   │ │  Card   │                    │
│  └─────────┘ └─────────┘ └─────────┘                    │
├─────────────────────────────────────────────────────────┤
│  ABOUT SECTION (bg: white)                             │
│  [ IMAGE ]  |  About content...                         │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                 │
│  Links | Social | Copyright                             │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Booking Wizard

```
┌─────────────────────────────────────────────────────────┐
│ HEADER: Logo | Progress: ● ● ○ | Exit                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  STEP INDICATOR                                         │
│  ━━━━━━━━━━━○━━━━━━━━━━━○━━━━━━━━━━━                    │
│  Service        Barber       Date/Time                  │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │                                                     ││
│  │            STEP CONTENT                             ││
│  │                                                     ││
│  │  (Step 1: Service cards grid)                       ││
│  │  (Step 2: Barber cards with ratings)               ││
│  │  (Step 3: Calendar + time slots)                   ││
│  │                                                     ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │ SUMMARY SIDEBAR (desktop) / BOTTOM (mobile)       ││
│  │ Selected: Service Name                             ││
│  │ Barber: Barber Name                                ││
│  │ Date: Selected Date                               ││
│  │ Time: Selected Time                               ││
│  │ Price: $XX.XX                                      ││
│  │                         [ Continue → ]            ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.3 User Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ NAV: Logo | Dashboard | My Appointments | Profile | ▼  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  WELCOME, USER NAME                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │ UPCOMING   │ │ COMPLETED  │ │ VOUCHERS   │          │
│  │    3       │ │    12      │ │     2      │          │
│  └────────────┘ └────────────┘ └────────────┘          │
│                                                         │
│  UPCOMING APPOINTMENTS                                  │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Haircut Classic │ John Silva                        ││
│  │ May 15, 2:30 PM │ ★★★★☆                           ││
│  │ [Cancel] [Reschedule]                              ││
│  └─────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────┐│
│  │ Beard Trim         │ Maria Santos                   ││
│  │ May 22, 4:00 PM    │ ★★★★★                        ││
│  │ [Cancel] [Reschedule]                              ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  [+ Book New Appointment]                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.4 Admin Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ ADMIN NAV: Logo | Dashboard | Services | Promotions | ▼│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  DASHBOARD                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ TODAY    │ │ WEEK     │ │ MONTH    │ │ REVENUE  │   │
│  │    8     │ │    45    │ │   180    │ │ $2,450   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │ CHARTS AREA (mock data visualization)              ││
│  │                                                     ││
│  │ [Bar chart: Appointments by day]                  ││
│  │                                                     ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  RECENT ACTIVITY                                        │
│  • John booked Haircut - 10 min ago                    │
│  • Maria completed Beard Trim - 1 hour ago            │
│  • New review from Client #45 - 2 hours ago           │
│                                                         │
│  [Manage Services]  [Manage Promotions]  [View All]   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.5 Auth Pages

```
┌─────────────────────────────────────────────────────────┐
│                        LOGIN                            │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │                                                     ││
│  │           [Logo / Brand]                            ││
│  │                                                     ││
│  │  Email *                                            ││
│  │  ┌─────────────────────────────────────────────┐   ││
│  │  │ email@example.com                          │   ││
│  │  └─────────────────────────────────────────────┘   ││
│  │                                                     ││
│  │  Password *                                        ││
│  │  ┌─────────────────────────────────────────────┐   ││
│  │  │ ••••••••                                    │   ││
│  │  └─────────────────────────────────────────────┘   ││
│  │                                                     ││
│  │  [ ] Remember me       [Forgot password?]        ││
│  │                                                     ││
│  │  [ LOGIN ]                                        ││
│  │                                                     ││
│  │  ───────────── OR ─────────────                   ││
│  │                                                     ││
│  │  [Continue with GitHub]                           ││
│  │  [Continue with Google]                           ││
│  │                                                     ││
│  │  Don't have an account? [Sign up]                 ││
│  │                                                     ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.6 Services Page

```
┌─────────────────────────────────────────────────────────┐
│ NAV: Logo | Services | Prices | Gallery | About | Login │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  OUR SERVICES                                           │
│  ┌─────────────────────────────────────────────────────┐│
│  │  [Filter: All | Haircut | Beard | Combo | ...]    ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │   IMAGE     │ │   IMAGE     │ │   IMAGE     │       │
│  │             │ │             │ │             │       │
│  │ Haircut     │ │ Beard Trim  │ │ Full Service│       │
│  │ Classic     │ │ & Shape     │ │ Package     │       │
│  │             │ │             │ │             │       │
│  │ $25 | 30min │ │ $20 | 20min │ │ $60 | 90min │       │
│  │             │ │             │ │             │       │
│  │ [Book Now]  │ │ [Book Now]  │ │ [Book Now]  │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │   ...       │ │   ...       │ │   ...       │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Component Specifications

### 6.1 Button States (Razorcuts + Esports)

| State | Style |
|-------|-------|
| Default | bg: #732F3B, text: white |
| Hover | bg: #401021, text: white, translateY(2px) |
| Active | bg: #401021, scale(0.98) |
| Disabled | bg: #ccc, text: #999 |
| Loading | spinner + disabled |
| **Esports CTA** | clip-path slant, hard shadow, skewX(-12deg) |

### 6.2 Card Style

```
background: #ffffff
border: 1px solid #eee
padding: 24px
hover: translateY(-4px), shadow increase

/* Esports Variant */
background: #2F2F2F
border: 2px solid #111
padding: 24px
hover: translateY(-4px), box-shadow: 8px 8px 0px #000
```

### 6.3 Form Input Style

```
height: 48px
border: 1px solid #eee
focus: border-color: #732F3B
error: border-color: red, message below

/* Esports Variant */
background: transparent
border: none
border-bottom: 2px solid white
focus: border-color: #732F3B
```

### 6.4 Navigation

```
fixed top
background: #111111
height: 60px
links: white, 14px, 500 weight
hover: bg: #732F3B

/* Esports variant: skewX(-12deg) buttons */
```

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, stacked |
| Tablet | 640-1024px | 2 columns |
| Desktop | > 1024px | 3 columns, sidebars |

---

## 8. Animation Usage Guidelines

### 8.1 When to Use Motion

| Element | Animation | Duration |
|---------|-----------|----------|
| Hero content enters | slideInLeft / slideInRight | 0.8s |
| Featured items (logos, offers) | pulse-p5 | 3s loop |
| Card hover | translateY(-4px) + shadow | 0.3s |
| Button hover | translateY(2px) | 0.3s |
| Social icon hover | rotate(-12deg) | 0.3s |
| Page transitions | fade + slide | 0.4s |

### 8.2 Easing

```css
/* Primary easing - snappy entrances */
cubic-bezier(0.16, 1, 0.3, 1)

/* Standard hover */
ease-out

/* Smooth loops */
ease-in-out
```

---

## 9. Wireframe Creation Notes

When creating wireframes in Pencil:
1. Use 1200px max-width container
2. 8px base spacing grid
3. Follow color palette exactly (Razorcuts primary + esports accents)
4. Use Oswald for headings, Poppins for body, Anton for display
5. Apply skew transforms for esports elements (-12deg skewX)
6. Use halftone patterns for hero backgrounds
7. Export to PNG for reference
8. Update this document with file paths

---

## 10. Reference Files

- Design System Esports Source: `/esports-tournament-96.aura.build (Cópia)/design-system.html`
- Original Razorcuts: See CLAUDE.md design tokens
- Wireframes: `/docs/wireframes/*.pen`