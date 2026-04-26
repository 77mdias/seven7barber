import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerServiceImpl } from './common/logger.service';
import { requestLoggerMiddleware } from './common/request-logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerServiceImpl(),
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger Documentation
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

  // Request logging in production
  if (process.env.NODE_ENV === 'production') {
    app.use(requestLoggerMiddleware);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();