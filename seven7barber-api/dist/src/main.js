"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const logger_service_1 = require("./common/logger.service");
const request_logger_middleware_1 = require("./common/request-logger.middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: new logger_service_1.LoggerServiceImpl(),
    });
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Seven7Barber API')
        .setDescription('Barbershop appointment booking platform API')
        .setVersion('1.0')
        .addTag('health', 'Health check endpoints')
        .addTag('auth', 'Authentication endpoints')
        .addTag('appointments', 'Booking management')
        .addTag('services', 'Barbershop services')
        .addTag('barbers', 'Barber management')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    if (process.env.NODE_ENV === 'production') {
        app.use(request_logger_middleware_1.requestLoggerMiddleware);
    }
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map