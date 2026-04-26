import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendConfirmationEmail(to: string, appointmentDetails: any) {
    this.logger.log(`[MOCK EMAIL] Enviando confirmação de agendamento para: ${to}`);
    this.logger.debug(`Detalhes: ${JSON.stringify(appointmentDetails)}`);
  }

  async sendWelcomeEmail(to: string, name: string) {
    this.logger.log(`[MOCK EMAIL] Enviando email de boas-vindas para: ${to} (${name})`);
  }
}
