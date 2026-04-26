import { PrismaService } from '../prisma/prisma.service';
export declare class VouchersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validateVoucher(code: string, userId?: string): Promise<{
        valid: boolean;
        voucher: {
            id: string;
            code: string;
            type: import("@prisma/client").$Enums.VoucherType;
            value: number;
        };
    }>;
    applyVoucher(code: string, appointmentValue?: number, userId?: string): Promise<{
        discount: number;
        finalValue: number;
        type: string;
        value: number;
        cashbackAmount?: undefined;
    } | {
        discount: number;
        cashbackAmount: number;
        finalValue: number;
        type: string;
        value: number;
    } | {
        discount: number;
        finalValue: number;
        type?: undefined;
        value?: undefined;
        cashbackAmount?: undefined;
    }>;
    createVoucher(data: {
        code: string;
        type: 'FREE_SERVICE' | 'DISCOUNT_PERCENTAGE' | 'DISCOUNT_FIXED' | 'CASHBACK';
        value: number;
        minServices?: number;
        expiresAt?: Date;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.VoucherType;
        value: import("@prisma/client/runtime/client").Decimal;
        isActive: boolean;
        code: string;
        minServices: number;
        expiresAt: Date | null;
    }>;
    deactivateVoucher(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.VoucherType;
        value: import("@prisma/client/runtime/client").Decimal;
        isActive: boolean;
        code: string;
        minServices: number;
        expiresAt: Date | null;
    }>;
}
