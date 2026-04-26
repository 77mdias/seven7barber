import { Controller, Req, All, Res } from '@nestjs/common';
import { toNodeHandler } from 'better-auth/node';
import { createBetterAuth } from './better-auth';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class BetterAuthController {
  private auth;
  private handler;

  constructor(private readonly prisma: PrismaService) {
    this.auth = createBetterAuth(prisma);
    this.handler = toNodeHandler(this.auth);
  }

  @All('*path')
  handleAll(@Req() req: any, @Res() res: any): void {
    if (req.method === 'OPTIONS') {
      res.status(204).send();
      return;
    }

    this.handler(req, res);
  }
}
