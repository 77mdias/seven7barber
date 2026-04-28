# UI-SPEC: Landing Page Redesign — Seven7Barber

## Overview
Redesign da landing page para melhorar legibilidade, alinhamento visual, e utilização das imagens disponíveis no projeto. Corrigir problemas de alinhamento ("layout quebrado") e criar uma experiência mais premium e profissional.

---

## 1. Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#732F3B` (wine) | CTAs, accents, brand |
| Primary Dark | `#401021` | Hover states |
| Dark | `#111111` | Backgrounds, text |
| Dark Surface | `#1a1a1a` | Cards, elevated surfaces |
| Neutral | `#272727` | Borders, dividers |
| Light Gray | `#f5f5f5` | Section backgrounds |
| White | `#ffffff` | Text on dark, cards |
| Muted Text | `#9ca3af` | Secondary text |

### Typography
| Element | Font | Size | Weight | Transform |
|---------|------|------|--------|-----------|
| H1 Hero | Oswald | 6xl-8xl | 700 | Uppercase |
| H2 Section | Oswald | 4xl-5xl | 700 | None |
| H3 Card | Oswald | 2xl | 600 | Uppercase |
| Body | Poppins | base-lg | 400 | None |
| Button | Oswald | lg-xl | 700 | Uppercase |
| Nav | Poppins | sm | 500 | Uppercase |

### Spacing System
- Section padding: `py-20 md:py-28`
- Container max-width: `max-w-7xl`
- Card padding: `p-6 md:p-8`
- Grid gap: `gap-6 md:gap-8`

---

## 2. Layout Structure

### Header (Sticky)
- Height: `h-18` (72px)
- Background: `#111` with bottom border `#732F3B`
- Logo: Left aligned
- Nav: Center aligned (hidden mobile)
- Auth: Right aligned
- **Fix:** Use flexbox with `justify-between` consistently

### Hero Section
- **Change:** Replace CSS halftone with actual background image
- Background: `51943c9b3f3aed1120454f188d1dc47c.jpg` (barber shop interior)
- Overlay: Dark gradient `from-[#111]/90 to-[#111]/40`
- Content: Left aligned, max-width container
- Visual: Remove skewed "7" element, use image-based hero
- **Fix:** Remove excessive skew transforms causing alignment issues

### Services Section
- Background: `#f5f5f5` (light gray)
- Cards: 3-column grid on desktop, 1-column mobile
- **Change:** Add images to service cards
  - Corte: `c001fb2632bc52f5bae3b95d6a39f4c2.jpg`
  - Barba: `972695398256212.jpg`
  - Combo: `fotos-oficina-da-barba-piracicaba-un-oagmenos (9).jpg`
- Card style: White bg, subtle shadow, image top, content bottom
- **Fix:** Remove `.card-esports` class, use clean card design

### About Section (New)
- Background image: `download.png`
- Content overlay with stats/info
- Professional layout with shop details

### CTA Banner
- Background: `#111` with subtle pattern
- Centered content
- Clear hierarchy: heading → text → button

### Footer
- Background: `#111`
- Border top: `#732F3B`
- Clean 3-column layout (brand, links, social)

---

## 3. Component Specifications

### Image Components
```tsx
// Hero Background
<div className="relative h-[80vh] min-h-[600px]">
  <Image src="/images/51943c9b3f3aed1120454f188d1dc47c.jpg" fill className="object-cover" />
  <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/80 to-transparent" />
  {/* Content */}
</div>

// Service Card Image
<div className="relative h-48 overflow-hidden rounded-t-lg">
  <Image src={service.image} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
</div>
```

### Button Styles
- Primary: `bg-[#732F3B] text-white hover:bg-[#401021]`
- Remove clip-path (causes alignment issues)
- Use standard rounded corners: `rounded-lg`
- Padding: `px-8 py-4`

### Card Styles
- Background: `bg-white`
- Border: `border border-gray-100`
- Shadow: `shadow-sm hover:shadow-lg`
- Rounded: `rounded-xl`
- Overflow: `overflow-hidden` (for images)

---

## 4. Alignment Fixes

### Issues Identified
1. **Skew transforms** causing content misalignment
2. **Clip-path** on buttons creating uneven spacing
3. **Absolute positioning** without proper container constraints
4. **Inconsistent padding** across sections

### Solutions
1. Remove all `skewX/skewY` transforms from content
2. Replace `clip-path: polygon()` with standard border-radius
3. Use flexbox/grid for all layouts
4. Standardize section padding: `py-20 px-4 md:px-8`

---

## 5. Responsive Breakpoints

| Breakpoint | Layout Changes |
|------------|----------------|
| Mobile (<768px) | Single column, stacked nav, full-width cards |
| Tablet (768-1024px) | 2-column grid, side nav |
| Desktop (>1024px) | 3-column grid, horizontal nav |

---

## 6. Animations

### Keep (Simplified)
- Fade-in on scroll (intersection observer)
- Hover scale on cards: `hover:scale-[1.02]`
- Button transitions: `transition-colors duration-200`

### Remove
- `slideInLeft/slideInRight` (jarring with skew)
- `pulse-p5` animation
- Complex clip-path animations

---

## 7. Images Usage Map

| Image | Usage | Section |
|-------|-------|---------|
| `51943c9b3f3aed1120454f188d1dc47c.jpg` | Hero background | Hero |
| `c001fb2632bc52f5bae3b95d6a39f4c2.jpg` | Service card | Corte |
| `972695398256212.jpg` | Service card | Barba |
| `fotos-oficina-da-barba-piracicaba-un-oagmenos (9).jpg` | Service card | Combo |
| `download.png` | About section bg | About |
| `maquininhas.jpeg` | Equipment showcase | About |
| `passo_1.webp` | How it works | CTA |

---

## 8. Success Criteria

- [ ] All sections properly aligned (no overflow/misalignment)
- [ ] Images loading correctly from `/public/images/`
- [ ] Responsive on mobile/tablet/desktop
- [ ] No skew transforms breaking layout
- [ ] Consistent spacing throughout
- [ ] Clear visual hierarchy
- [ ] Accessible color contrast
- [ ] Fast image loading with Next.js Image optimization

---

## UI-SPEC COMPLETE
