import { Controller, Req, Post, Get, Body } from "@nestjs/common";
import { createBetterAuth } from "./better-auth";
import { PrismaService } from "../prisma/prisma.service";

@Controller("auth")
export class BetterAuthController {
  private auth;

  constructor(private readonly prisma: PrismaService) {
    this.auth = createBetterAuth(prisma);
  }

  // Delegate all requests to better-auth handler
  @Post("sign-in")
  async signIn(@Req() request: Request) {
    return this.auth.handler(request);
  }

  @Post("sign-up")
  async signUp(@Req() request: Request) {
    return this.auth.handler(request);
  }

  @Post("sign-out")
  async signOut(@Req() request: Request) {
    return this.auth.handler(request);
  }

  @Get("session")
  async getSession(@Req() request: Request) {
    return this.auth.handler(request);
  }
}
