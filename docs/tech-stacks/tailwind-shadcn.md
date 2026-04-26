# Tech Stack: Tailwind CSS + shadcn/ui

## Overview
Utility-first CSS with accessible component library built on Radix primitives.

## Tailwind Configuration
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    screens: {
      sm: '480px', md: '768px', lg: '976px', xl: '1440px',
    },
    colors: {
      primary: {
        DEFAULT: '#732F3B',
        dark: '#401021',
      },
      neutral: {
        900: '#111111',
        800: '#272727',
        400: '#bababa',
        50: '#ffffff',
      },
    },
    fontFamily: {
      heading: ['Oswald', 'sans-serif'],
      body: ['Poppins', 'sans-serif'],
    },
    extend: {
      spacing: { '128': '32rem' },
      borderRadius: { '4xl': '2rem' },
    },
  },
};
```

## Utility Classes
```tsx
// Layout
<div className="flex items-center justify-between gap-4">
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

// Typography
<h1 className="font-heading text-primary">Title</h1>
<p className="font-body text-neutral-400">Body</p>

// Spacing
<div className="p-4 md:p-6 lg:p-8">

// Responsive
<div className="hidden md:block">...</div>
<div className="w-full lg:w-1/2">
```

## shadcn/ui Components
```bash
# Add component
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add card input label

# Add all
npx shadcn@latest add --all
```

## Component Usage
```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<Card>
  <CardHeader>
    <h2 className="font-heading text-xl">Title</h2>
  </CardHeader>
  <CardContent>
    <form className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </div>
    </form>
  </CardContent>
  <CardFooter className="justify-end">
    <Button type="submit">Submit</Button>
  </CardFooter>
</Card>
```

## Design System (Razorcuts)
| Token | Value | Usage |
|-------|-------|-------|
| primary | #732F3B | Buttons, accents |
| primary-dark | #401021 | Hover states |
| neutral-900 | #111111 | Text, backgrounds |
| neutral-800 | #272727 | Secondary backgrounds |
| neutral-400 | #bababa | Borders, disabled |
| neutral-50 | #ffffff | Cards, inputs |

## Tags
#tech-stack #css #tailwind #ui
