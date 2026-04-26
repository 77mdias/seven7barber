export declare class EmailService {
    private readonly logger;
    sendConfirmationEmail(to: string, appointmentDetails: any): Promise<void>;
    sendWelcomeEmail(to: string, name: string): Promise<void>;
}
