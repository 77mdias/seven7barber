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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VouchersController = void 0;
const common_1 = require("@nestjs/common");
const vouchers_service_1 = require("./vouchers.service");
let VouchersController = class VouchersController {
    vouchersService;
    constructor(vouchersService) {
        this.vouchersService = vouchersService;
    }
    async validateVoucher(body) {
        return this.vouchersService.validateVoucher(body.code, body.userId);
    }
    async applyVoucher(body) {
        return this.vouchersService.applyVoucher(body.code, body.appointmentValue, body.userId);
    }
    async createVoucher(body) {
        return this.vouchersService.createVoucher({
            ...body,
            expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
        });
    }
    async listVouchers() {
        return { message: 'Admin endpoint - implement with pagination' };
    }
    async deactivateVoucher(id) {
        return this.vouchersService.deactivateVoucher(id);
    }
};
exports.VouchersController = VouchersController;
__decorate([
    (0, common_1.Post)('validate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VouchersController.prototype, "validateVoucher", null);
__decorate([
    (0, common_1.Post)('apply'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VouchersController.prototype, "applyVoucher", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VouchersController.prototype, "createVoucher", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VouchersController.prototype, "listVouchers", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VouchersController.prototype, "deactivateVoucher", null);
exports.VouchersController = VouchersController = __decorate([
    (0, common_1.Controller)('vouchers'),
    __metadata("design:paramtypes", [vouchers_service_1.VouchersService])
], VouchersController);
//# sourceMappingURL=vouchers.controller.js.map