export declare enum PaymentMethod {
    PIX = "PIX",
    BOLETO = "BOLETO",
    CREDIT_CARD = "CREDIT_CARD"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export interface CreatePaymentSessionDto {
    appointmentId: string;
    amount: number;
    method: PaymentMethod;
}
export interface PaymentCallbackDto {
    sessionId: string;
    status: 'APPROVED' | 'FAILED';
    signature: string;
}
export interface PaymentSessionResult {
    sessionId: string;
    status: PaymentStatus;
    amount: number;
    method: string;
    qrCode?: string;
    receiptUrl?: string;
    createdAt: Date;
}
export declare class PaymentsService {
    private sessions;
    createPaymentSession(dto: CreatePaymentSessionDto): Promise<PaymentSessionResult>;
    processPaymentCallback(dto: PaymentCallbackDto): Promise<{
        sessionId: string;
        status: PaymentStatus;
    }>;
    getPaymentSession(sessionId: string): Promise<{
        sessionId: any;
        status: PaymentStatus;
        amount: any;
        method: any;
        updatedAt: any;
    }>;
}
