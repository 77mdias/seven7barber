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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const create_service_dto_1 = require("./dto/create-service.dto");
const update_service_dto_1 = require("./dto/update-service.dto");
let ServicesService = class ServicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.service.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const service = await this.prisma.service.findUnique({ where: { id } });
        if (!service)
            throw new common_1.NotFoundException(`Service ${id} not found`);
        return service;
    }
    async create(dto) {
        const parsed = create_service_dto_1.CreateServiceSchema.parse(dto);
        return this.prisma.service.create({
            data: {
                ...parsed,
                price: parsed.price,
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        const parsed = update_service_dto_1.UpdateServiceSchema.parse(dto);
        return this.prisma.service.update({
            where: { id },
            data: {
                ...parsed,
                ...(parsed.price !== undefined && { price: parsed.price }),
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.service.update({
            where: { id },
            data: { isActive: false },
        });
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map