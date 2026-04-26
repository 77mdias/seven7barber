# Tech Stack: NestJS Backend

## Overview
NestJS TypeScript backend with modular architecture.

## Architecture
```
src/
├── main.ts               # Bootstrap
├── app.module.ts        # Root module
├── auth/                # Authentication module
├── users/               # User management
├── appointments/        # Booking system
├── services/            # Service catalog
├── reviews/             # Reviews
├── vouchers/            # Vouchers
└── admin/               # Admin functions
```

## Modules Structure
```typescript
@Module({
  imports: [/* other modules */],
  controllers: [/* REST controllers */],
  providers: [/* services */],
  exports: [/* exported services */],
})
export class ModuleName {}
```

## Services
```typescript
@Injectable()
export class ServiceName {
  constructor(private prisma: PrismaService) {}
  
  async method(args: Type): Promise<Result> {
    return this.prisma.model.findFirst();
  }
}
```

## Controllers
```typescript
@Controller('resource')
export class ResourceController {
  constructor(private service: ResourceService) {}
  
  @Get()
  async findAll(): Promise<Result[]> {
    return this.service.findAll();
  }
  
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateDto): Promise<Result> {
    return this.service.create(dto);
  }
}
```

## Testing (Vitest + Supertest)
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { supertest } from '@supertest/supertest';

describe('AuthController', () => {
  let app: INestApplication;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = module.createNestApplication();
    await app.init();
  });
  
  it('POST /auth/login', async () => {
    return supertest(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201);
  });
});
```

## Commands
```bash
bun run dev          # Watch mode
bun run build        # Build
bun run start        # Production
bun run test         # Run tests
bun run test:watch   # Watch mode
bun run test:coverage # Coverage
bun run prisma migrate # Migrations
```

## Tags
#tech-stack #backend #nestjs #typescript
