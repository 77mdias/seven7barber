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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTodayAppointments() {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        return this.prisma.appointment.findMany({
            where: {
                dateTime: { gte: startOfDay, lte: endOfDay },
            },
            include: {
                client: { select: { id: true, name: true, email: true } },
                barber: { select: { id: true, name: true } },
                service: { select: { id: true, name: true, price: true, duration: true } },
            },
            orderBy: { dateTime: 'asc' },
        });
    }
    async getAppointments(filters) {
        const where = {};
        if (filters.startDate || filters.endDate) {
            where.dateTime = {};
            if (filters.startDate)
                where.dateTime.gte = new Date(filters.startDate);
            if (filters.endDate)
                where.dateTime.lte = new Date(filters.endDate);
        }
        if (filters.status)
            where.status = filters.status;
        if (filters.barberId)
            where.barberId = filters.barberId;
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const [appointments, total] = await Promise.all([
            this.prisma.appointment.findMany({
                where,
                include: {
                    client: { select: { id: true, name: true, email: true } },
                    barber: { select: { id: true, name: true } },
                    service: { select: { id: true, name: true, price: true } },
                },
                orderBy: { dateTime: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.appointment.count({ where }),
        ]);
        return { appointments, total, page, limit };
    }
    async updateAppointmentStatus(id, status) {
        const validStatuses = ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status: ${status}`);
        }
        const current = await this.prisma.appointment.findUnique({ where: { id } });
        if (current?.status === 'COMPLETED') {
            throw new Error('Cannot change status of completed appointment');
        }
        return this.prisma.appointment.update({
            where: { id },
            data: { status: status },
        });
    }
    async getClients(search) {
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const clients = await this.prisma.user.findMany({
            where: { ...where, role: 'CLIENT' },
            include: {
                _count: { select: { appointments: true } },
            },
        });
        return clients.map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            appointmentCount: c._count?.appointments ?? 0,
            createdAt: c.createdAt,
        }));
    }
    async getBarbers() {
        const barbers = await this.prisma.user.findMany({
            where: { role: 'BARBER' },
            include: {
                barberJobs: {
                    where: { status: 'COMPLETED' },
                    include: { service: true },
                },
                reviews: true,
            },
        });
        return barbers.map((b) => ({
            id: b.id,
            name: b.name,
            image: b.image,
            totalAppointments: b.barberJobs.length,
            avgRating: b.reviews.length > 0
                ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
                : 0,
            specialties: [...new Set(b.barberJobs.map((j) => j.service.name))],
        }));
    }
    async getOverviewMetrics() {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const [todayAppointments, weekAppointments, weekCompleted, reviews,] = await Promise.all([
            this.prisma.appointment.count({
                where: { dateTime: { gte: startOfDay, lte: endOfDay } },
            }),
            this.prisma.appointment.findMany({
                where: { dateTime: { gte: weekAgo } },
                include: { service: true },
            }),
            this.prisma.appointment.count({
                where: { dateTime: { gte: weekAgo }, status: 'COMPLETED' },
            }),
            this.prisma.serviceHistory.findMany({
                where: {
                    createdAt: { gte: weekAgo },
                },
            }),
        ]);
        const weekRevenue = weekAppointments
            .filter((a) => a.status === 'COMPLETED')
            .reduce((sum, a) => sum + parseFloat(a.service.price.toString()), 0);
        return {
            todayAppointments,
            weekRevenue: parseFloat(weekRevenue.toFixed(2)),
            completionRate: weekAppointments.length > 0
                ? (weekCompleted / weekAppointments.length) * 100
                : 0,
            avgRating: reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map