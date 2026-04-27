import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { OAuthService } from './oauth.service';
import { OAuthController } from './oauth.controller';
import { EncryptionService } from './encryption.service';
import { HttpModule } from '@nestjs/axios';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required');
}

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'auth',
        ttl: 60000,
        limit: 5,
      },
    ]),
    HttpModule,
  ],
  providers: [AuthService, JwtStrategy, RolesGuard, OAuthService, EncryptionService],
  controllers: [AuthController, OAuthController],
  exports: [AuthService, RolesGuard, ThrottlerModule, OAuthService, EncryptionService],
})
export class AuthModule {}