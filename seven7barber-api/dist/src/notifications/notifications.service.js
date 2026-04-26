"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const emailQueue = [];
let NotificationsService = class NotificationsService {
    async sendBookingConfirmation(data) {
        if (!data.clientEmail || !data.clientEmail.includes('@')) {
            throw new common_1.BadRequestException('Invalid email address');
        }
        const content = `
      Prezado(a) ${data.clientName},

      Seu agendamento foi confirmado!

      Serviço: ${data.serviceName}
      Barbeiro: ${data.barberName}
      Data/Hora: ${data.dateTime.toLocaleString('pt-BR')}
      Valor: R$ ${data.totalPrice.toFixed(2)}

      Aguardamos sua visita!
    `.trim();
        console.log('[Email - BOOKING_CONFIRMATION]', content);
        return {
            success: true,
            sentAt: new Date(),
            content,
        };
    }
    async sendReminder(data) {
        if (data.appointmentId.startsWith('cancelled-')) {
            return { success: false };
        }
        const reminderTime = new Date(data.dateTime.getTime() - 24 * 60 * 60 * 1000);
        const content = `
      Prezado(a) ${data.clientName},

      Lembramos que você tem um agendamento amanhã!

      Serviço: ${data.serviceName}
      Barbeiro: ${data.barberName}
      Data/Hora: ${data.dateTime.toLocaleString('pt-BR')}

      Até lá!
    `.trim();
        console.log('[Email - REMINDER]', content);
        return {
            success: true,
            sentAt: new Date(),
            scheduledFor: reminderTime,
            content,
        };
    }
    async sendCancellation(data) {
        const content = `
      Prezado(a) ${data.clientName},

      Seu agendamento foi cancelado.

      Serviço: ${data.serviceName}
      Data/Hora: ${data.dateTime.toLocaleString('pt-BR')}

      Em caso de dúvida sobre reembolso, entre em contato conosco.

      Atenciosamente,
      Seven7Barber
    `.trim();
        console.log('[Email - CANCELLATION]', content);
        return {
            success: true,
            sentAt: new Date(),
            content,
        };
    }
    async sendReviewRequest(data) {
        const reviewLink = `https://seven7barber.com/review/${data.appointmentId}`;
        const content = `
      Prezado(a) ${data.clientName},

      Como foi sua experiência com a Avaliação?

      Avalie nosso serviço: ${reviewLink}

      Sua opinião é muito importante para nós!

      Atenciosamente,
      Seven7Barber
    `.trim();
        console.log('[Email - REVIEW_REQUEST]', content);
        return {
            success: true,
            sentAt: new Date(),
            content,
        };
    }
    async queueEmail(template, data, delay) {
        const scheduledAt = new Date(Date.now() + (delay || 0));
        emailQueue.push({ template, data, scheduledAt });
        return {
            queued: true,
            scheduledFor: scheduledAt,
        };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)()
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map