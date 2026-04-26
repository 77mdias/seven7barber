import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerServiceImpl } from './common/logger.service';
import { requestLoggerMiddleware } from './common/request-logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerServiceImpl(),
  });

  // CORS - whitelist explicit origins
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3001',
    'http://localhost:5173',
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Documentation (dev only)
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Seven7Barber API')
      .setDescription('Barbershop appointment booking platform API')
      .setVersion('1.0')
      .addTag('health', 'Health check endpoints')
      .addTag('auth', 'Authentication endpoints')
      .addTag('appointments', 'Booking management')
      .addTag('services', 'Barbershop services')
      .addTag('barbers', 'Barber management')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Request logging in production
  if (process.env.NODE_ENV === 'production') {
    app.use(requestLoggerMiddleware);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
