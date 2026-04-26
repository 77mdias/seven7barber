"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VouchersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VouchersService = class VouchersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateVoucher(code, userId) {
        const voucher = await this.prisma.voucher.findUnique({
            where: { code },
        });
        if (!voucher) {
            throw new common_1.BadRequestException('Voucher not found');
        }
        if (!voucher.isActive) {
            throw new common_1.BadRequestException('Voucher is no longer active');
        }
        if (voucher.expiresAt && voucher.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Voucher has expired');
        }
        if (userId && voucher.minServices > 0) {
            const userAppointmentCount = await this.prisma.appointment.count({
                where: {
                    clientId: userId,
                    status: 'COMPLETED',
                },
            });
            if (userAppointmentCount < voucher.minServices) {
                throw new common_1.BadRequestException(`This voucher requires at least ${voucher.minServices} completed services`);
            }
        }
        return {
            valid: true,
            voucher: {
                id: voucher.id,
                code: voucher.code,
                type: voucher.type,
                value: parseFloat(voucher.value.toString()),
            },
        };
    }
    async applyVoucher(code, appointmentValue, userId) {
        const validation = await this.validateVoucher(code, userId);
        const voucher = validation.voucher;
        if (voucher.type === 'DISCOUNT_PERCENTAGE') {
            const discount = appointmentValue
                ? (appointmentValue * voucher.value) / 100
                : 0;
            return {
                discount: parseFloat(discount.toFixed(2)),
                finalValue: appointmentValue
                    ? parseFloat((appointmentValue - discount).toFixed(2))
                    : 0,
                type: 'percentage',
                value: voucher.value,
            };
        }
        if (voucher.type === 'DISCOUNT_FIXED') {
            const discount = voucher.value;
            return {
                discount: parseFloat(discount.toString()),
                finalValue: appointmentValue
                    ? parseFloat(Math.max(0, appointmentValue - discount).toFixed(2))
                    : 0,
                type: 'fixed',
                value: voucher.value,
            };
        }
        if (voucher.type === 'FREE_SERVICE') {
            return {
                discount: appointmentValue || 0,
                finalValue: 0,
                type: 'free_service',
                value: 0,
            };
        }
        if (voucher.type === 'CASHBACK') {
            const cashback = appointmentValue ? (appointmentValue * voucher.value) / 100 : 0;
            return {
                discount: 0,
                cashbackAmount: parseFloat(cashback.toFixed(2)),
                finalValue: appointmentValue || 0,
                type: 'cashback',
                value: voucher.value,
            };
        }
        return { discount: 0, finalValue: appointmentValue || 0 };
    }
    async createVoucher(data) {
        return this.prisma.voucher.create({
            data: {
                code: data.code.toUpperCase(),
                type: data.type,
                value: data.value,
                minServices: data.minServices || 0,
                expiresAt: data.expiresAt,
                isActive: true,
            },
        });
    }
    async deactivateVoucher(id) {
        return this.prisma.voucher.update({
            where: { id },
            data: { isActive: false },
        });
    }
};
exports.VouchersService = VouchersService;
exports.VouchersService = VouchersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VouchersService);
//# sourceMappingURL=vouchers.service.js.map