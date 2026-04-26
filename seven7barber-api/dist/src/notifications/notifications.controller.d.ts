import { NotificationsService, EmailType, EmailData } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    sendEmail(body: {
        template: EmailType;
        data: EmailData;
    }): Promise<import("./notifications.service").SendEmailResult | {
        success: boolean;
        error: string;
    }>;
}
