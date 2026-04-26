import { Controller, Req, All, Res, Next } from "@nestjs/common";
import { toNodeHandler } from "better-auth/node";
import { createBetterAuth } from "./better-auth";
import { PrismaService } from "../prisma/prisma.service";
import { Request, Response } from "express";

@Controller("auth")
export class BetterAuthController {
  private auth;
  private handler;

  constructor(private readonly prisma: PrismaService) {
    this.auth = createBetterAuth(prisma);
    this.handler = toNodeHandler(this.auth);
  }

  @All("*")
  async handleAll(@Req() req: any, @Res() res: any) {
    return this.handler(req, res);
  }
}
