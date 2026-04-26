# Tech Stack: Zod Validation

## Overview
TypeScript-first schema validation with static type inference.

## Basic Schemas
```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100).optional(),
  age: z.number().min(0).max(150).optional(),
  role: z.enum(['CLIENT', 'BARBER', 'ADMIN']),
  createdAt: z.date(),
});

type User = z.infer<typeof UserSchema>;
```

## Common Validators
```typescript
z.string().min(1).max(255)
z.string().email()
z.string().url()
z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
z.number().min(0).max(1000)
z.number().int()
z.boolean()
z.enum(['A', 'B', 'C'])
z.array(z.string())
z.object({ name: z.string() })
z.union([z.string(), z.number()])
z.optional()
z.nullable()
z.default(0)
z.transform(val => val.trim())
```

## Parsing
```typescript
const result = UserSchema.safeParse(data);

if (!result.success) {
  const errors = result.error.flatten();
  console.log(errors.fieldErrors);
} else {
  const user: User = result.data;
}
```

## With React Hook Form
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema } from './schemas';

function UserForm() {
  const form = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: { email: '', name: '' },
  });
  
  return (
    <form onSubmit={form.handleSubmit((data) => console.log(data))}>
      <input {...form.register('email')} />
      {form.formState.errors.email && (
        <span>{form.formState.errors.email.message}</span>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Form Methods
```typescript
form.handleSubmit((data) => {
  // data is already validated and typed
});

form.watch('fieldName');           // Watch field
form.watch();                     // Watch all
form.reset();                     // Reset form
form.setError('field', {          // Set manual error
  type: 'manual',
  message: 'Custom error',
});
```

## Common Patterns
```typescript
// Partial for updates
const UpdateUserSchema = UserSchema.partial();

// Pick/omit fields
const PublicUserSchema = UserSchema.pick({ id: true, email: true });
const PrivateUserSchema = UserSchema.omit({ password: true });

// Array schema
const UserListSchema = z.array(UserSchema);

// Nested
const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  zip: z.string().regex(/^\d{5}/),
});

const UserWithAddressSchema = UserSchema.extend({
  address: AddressSchema,
});
```

## Tags
#tech-stack #validation #zod #typescript
