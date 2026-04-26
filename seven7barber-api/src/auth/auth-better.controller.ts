import { Controller, Req, All, Res } from "@nestjs/common";
import { toNodeHandler } from "better-auth/node";
import { createBetterAuth } from "./better-auth";
import { PrismaService } from "../prisma/prisma.service";

@Controller("auth")
export class BetterAuthController {
  private auth;
  private handler;

  constructor(private readonly prisma: PrismaService) {
    this.auth = createBetterAuth(prisma);
    this.handler = toNodeHandler(this.auth);
  }

  @All("*path")
  handleAll(@Req() req: any, @Res() res: any): void {
    const origin = req.headers.origin || "http://localhost:3001";
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

    if (req.method === "OPTIONS") {
      res.status(204).send();
      return;
    }

    this.handler(req, res);
  }
}
