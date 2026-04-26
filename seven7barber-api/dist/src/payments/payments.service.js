"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = exports.PaymentStatus = exports.PaymentMethod = void 0;
const common_1 = require("@nestjs/common");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["PIX"] = "PIX";
    PaymentMethod["BOLETO"] = "BOLETO";
    PaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["APPROVED"] = "APPROVED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
const mockSessions = new Map();
let PaymentsService = class PaymentsService {
    sessions = mockSessions;
    async createPaymentSession(dto) {
        if (!dto.appointmentId || dto.appointmentId === 'invalid-id') {
            throw new common_1.BadRequestException('Appointment not found');
        }
        const sessionId = `session-${Date.now()}`;
        const session = {
            id: sessionId,
            appointmentId: dto.appointmentId,
            status: 'PENDING',
            amount: dto.amount,
            method: dto.method,
            createdAt: new Date(),
        };
        this.sessions.set(sessionId, session);
        const result = {
            sessionId: session.id,
            status: session.status,
            amount: session.amount,
            method: session.method,
            createdAt: session.createdAt,
        };
        if (dto.method === 'PIX') {
            result.qrCode = `mock-pix-qr-${session.id}`;
        }
        if (dto.method === 'BOLETO') {
            result.receiptUrl = `http://mockboleto.com/${session.id}`;
        }
        return result;
    }
    async processPaymentCallback(dto) {
        const session = this.sessions.get(dto.sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Payment session not found');
        }
        const validSignature = 'valid-signature';
        if (dto.signature !== validSignature) {
            throw new common_1.BadRequestException('Invalid signature');
        }
        session.status = dto.status;
        this.sessions.set(dto.sessionId, session);
        return {
            sessionId: session.id,
            status: session.status,
        };
    }
    async getPaymentSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Payment session not found');
        }
        return {
            sessionId: session.id,
            status: session.status,
            amount: session.amount,
            method: session.method,
            updatedAt: session.updatedAt,
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)()
], PaymentsService);
//# sourceMappingURL=payments.service.js.map