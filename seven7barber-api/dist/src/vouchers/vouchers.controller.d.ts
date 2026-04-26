import { VouchersService } from './vouchers.service';
export declare class VouchersController {
    private readonly vouchersService;
    constructor(vouchersService: VouchersService);
    validateVoucher(body: {
        code: string;
        userId?: string;
    }): Promise<{
        valid: boolean;
        voucher: {
            id: string;
            code: string;
            type: import("@prisma/client").$Enums.VoucherType;
            value: number;
        };
    }>;
    applyVoucher(body: {
        code: string;
        appointmentValue?: number;
        userId?: string;
    }): Promise<{
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
    createVoucher(body: {
        code: string;
        type: 'FREE_SERVICE' | 'DISCOUNT_PERCENTAGE' | 'DISCOUNT_FIXED' | 'CASHBACK';
        value: number;
        minServices?: number;
        expiresAt?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        type: import("@prisma/client").$Enums.VoucherType;
        value: import("@prisma/client/runtime/client").Decimal;
        isActive: boolean;
        code: string;
        minServices: number;
    }>;
    listVouchers(): Promise<{
        message: string;
    }>;
    deactivateVoucher(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        type: import("@prisma/client").$Enums.VoucherType;
        value: import("@prisma/client/runtime/client").Decimal;
        isActive: boolean;
        code: string;
        minServices: number;
    }>;
}
