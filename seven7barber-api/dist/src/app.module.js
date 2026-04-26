"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const email_module_1 = require("./email/email.module");
const services_module_1 = require("./services/services.module");
const availability_module_1 = require("./availability/availability.module");
const admin_module_1 = require("./admin/admin.module");
const reviews_module_1 = require("./reviews/reviews.module");
const vouchers_module_1 = require("./vouchers/vouchers.module");
const payments_module_1 = require("./payments/payments.module");
const health_module_1 = require("./health/health.module");
const metrics_module_1 = require("./metrics/metrics.module");
const notifications_module_1 = require("./notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, user_module_1.UserModule, auth_module_1.AuthModule, email_module_1.EmailModule, services_module_1.ServicesModule, availability_module_1.AvailabilityModule, admin_module_1.AdminModule, reviews_module_1.ReviewsModule, vouchers_module_1.VouchersModule, payments_module_1.PaymentsModule, notifications_module_1.NotificationsModule, health_module_1.HealthModule, metrics_module_1.MetricsModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map