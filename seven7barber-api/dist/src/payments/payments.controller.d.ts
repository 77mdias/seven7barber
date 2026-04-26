import type { CreatePaymentSessionDto, PaymentCallbackDto } from './payments.service';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createSession(dto: CreatePaymentSessionDto): Promise<import("./payments.service").PaymentSessionResult>;
    getSession(sessionId: string): Promise<{
        sessionId: any;
        status: import("./payments.service").PaymentStatus;
        amount: any;
        method: any;
        updatedAt: any;
    }>;
    paymentCallback(dto: PaymentCallbackDto): Promise<{
        sessionId: string;
        status: import("./payments.service").PaymentStatus;
    }>;
}
