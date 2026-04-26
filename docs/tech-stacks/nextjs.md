# Tech Stack: Next.js 15 (Vinext)

## Overview
Next.js 15 with App Router, React 19, TypeScript strict mode.

## Core Patterns

### Server Components vs Client Components
```
Server Component: default, no "use client" directive
Client Component: add "use client" at top of file
```
Server Components can pass Server Functions as props to Client Components.

### Server Functions (Server Actions)
```typescript
// actions.ts - use server at top
"use server";

export async function createAppointment(formData: FormData) {
  "use server";
  // server-side logic
  return await db.appointment.create({ data: {...} });
}
```
```tsx
// Server Component passes function as prop
import { createAppointment } from './actions';
<ClientButton onClick={createAppointment} />
```
```tsx
// Client Component uses it
"use client";
export default function ClientButton({ onClick }) {
  return <button onClick={() => onClick()}>Create</button>
}
```

### Forms with useActionState (React 19)
```tsx
const [state, action, isPending] = useActionState(asyncFunction, null);
<form action={action}>
  <button disabled={isPending}>Submit</button>
</form>
```

### Hooks (React 19)
- `useState` - state management
- `useEffect` - side effects, cleanup with return
- `useCallback(fn, deps)` - memoized callbacks
- `useMemo(() => value, deps)` - memoized values
- `useContext` - consume context
- `useActionState` - form submission state
- `useFormStatus` - parent form pending status

### Context Pattern
```tsx
const ThemeContext = createContext(null);

function Providers({ children }) {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## Directory Structure
```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Auth route group
│   ├── (main)/           # Main app route group
│   └── api/              # API routes if needed
├── components/
│   ├── ui/               # shadcn/ui components
│   └── */                # Feature components
├── lib/                  # Utilities
│   └── prisma.ts         # Prisma client singleton
└── server/               # Server Actions
```

## Key Libraries
- **Forms:** React Hook Form + Zod
- **UI:** shadcn/ui + Tailwind CSS
- **State:** React Context + Server Actions

## Commands
```bash
bun run dev      # Dev server
bun run build    # Production build
bun run lint     # Lint
bun run type-check
```

## Tags
#tech-stack #frontend #nextjs #react
