import { Injectable, NestMiddleware, Req, Res } from "@nestjs/common";
import { createBetterAuth } from "./better-auth";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BetterAuthMiddleware implements NestMiddleware {
  private auth;

  constructor(private readonly prisma: PrismaService) {
    this.auth = createBetterAuth(prisma);
  }

  async use(@Req() req: any, @Res() res: any): Promise<void> {
    console.log('BetterAuth middleware called:', req.method, req.url);
    try {
      // Create a proper Request object that better-auth expects
      const protocol = req.protocol || 'http';
      const host = req.get('host') || 'localhost:3000';
      const originalUrl = req.originalUrl || req.url;
      const fullUrl = `${protocol}://${host}${originalUrl}`;

      // Create a standard Request object
      const request = new Request(fullUrl, {
        method: req.method,
        headers: req.headers as HeadersInit,
        body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? req.body : undefined,
      });

      const response = await this.auth.handler(request);

      // Set status code
      res.status(response.status || 200);

      // Set headers
      response.headers.forEach((value: string, key: string) => {
        res.setHeader(key, value);
      });

      // Send body
      const body = await response.text();
      if (body) {
        res.send(body);
      } else {
        res.end();
      }
    } catch (error) {
      console.error('BetterAuth middleware error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
