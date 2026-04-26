export type EmailType = 'BOOKING_CONFIRMATION' | 'REMINDER' | 'CANCELLATION' | 'REVIEW_REQUEST';
export interface EmailData {
    appointmentId: string;
    clientName: string;
    clientEmail: string;
    barberName: string;
    serviceName: string;
    dateTime: Date;
    totalPrice: number;
}
export interface SendEmailResult {
    success: boolean;
    sentAt?: Date;
    scheduledFor?: Date;
    content?: string;
}
export interface QueueEmailResult {
    queued: boolean;
    scheduledFor?: Date;
}
export declare class NotificationsService {
    sendBookingConfirmation(data: EmailData): Promise<SendEmailResult>;
    sendReminder(data: EmailData): Promise<SendEmailResult>;
    sendCancellation(data: EmailData): Promise<SendEmailResult>;
    sendReviewRequest(data: EmailData): Promise<SendEmailResult>;
    queueEmail(template: EmailType, data: EmailData, delay?: number): Promise<QueueEmailResult>;
}
