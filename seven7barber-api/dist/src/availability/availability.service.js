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
exports.AvailabilityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AvailabilityService = class AvailabilityService {
    prisma;
    DEFAULT_WORKING_HOURS = {
        start: '09:00',
        end: '19:00',
        bufferMinutes: 15,
    };
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAvailableSlots(date, serviceIds) {
        const dateStr = date.toISOString().split('T')[0];
        const barbers = await this.prisma.user.findMany({
            where: { role: 'BARBER' },
        });
        if (barbers.length === 0) {
            return [];
        }
        const services = await this.prisma.service.findMany({
            where: { id: { in: serviceIds } },
        });
        const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
        const workingHours = this.getWorkingHours();
        const startOfDay = new Date(`${dateStr}T00:00:00`);
        const endOfDay = new Date(`${dateStr}T23:59:59`);
        const existingAppointments = await this.prisma.appointment.findMany({
            where: {
                dateTime: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                status: { in: ['SCHEDULED', 'CONFIRMED'] },
            },
            include: { service: true },
        });
        const slots = [];
        const slotInterval = 30;
        const [startHour, startMin] = workingHours.start.split(':').map(Number);
        const [endHour, endMin] = workingHours.end.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        for (const barber of barbers) {
            const barberAppointments = existingAppointments.filter((a) => a.barberId === barber.id);
            for (let mins = startMinutes; mins + totalDuration + workingHours.bufferMinutes <= endMinutes; mins += slotInterval) {
                const slotTime = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
                const slotEndTime = `${String(Math.floor((mins + totalDuration) / 60)).padStart(2, '0')}:${String((mins + totalDuration) % 60).padStart(2, '0')}`;
                const hasConflict = barberAppointments.some((appt) => {
                    const apptTime = appt.dateTime;
                    const apptMins = apptTime.getHours() * 60 + apptTime.getMinutes();
                    const apptEndMins = apptMins + appt.service.duration + workingHours.bufferMinutes;
                    return (mins < apptEndMins && mins + totalDuration > apptMins);
                });
                if (!hasConflict) {
                    slots.push({
                        time: slotTime,
                        barberId: barber.id,
                        barberName: barber.name,
                        date: dateStr,
                    });
                }
            }
        }
        return slots;
    }
    getWorkingHours() {
        return this.DEFAULT_WORKING_HOURS;
    }
};
exports.AvailabilityService = AvailabilityService;
exports.AvailabilityService = AvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AvailabilityService);
//# sourceMappingURL=availability.service.js.map