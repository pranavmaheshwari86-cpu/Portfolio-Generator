import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';

export interface SendEmailPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  recipientEmail: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendContactEmail(payload: SendEmailPayload): Promise<{ id: string }> {
    const { name, email, subject, message, recipientEmail } = payload;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      this.logger.warn(
        `[CONTACT] RESEND_API_KEY is not configured. Simulating successful email delivery to ${recipientEmail} from ${name} (${email}).`
      );
      return { id: `simulated-dev-${Date.now().toString(36)}` };
    }

    const resend = new Resend(apiKey);
    const fromAddress = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const emailSubject = subject && subject.trim() 
      ? `New Portfolio Contact: ${subject.trim()}`
      : `New Portfolio Contact — ${name.trim()}`;

    const submissionDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #18181b; padding: 24px; margin: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e4e4e7; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 24px; }
            .header h2 { margin: 0; font-size: 20px; color: #09090b; }
            .field { margin-bottom: 16px; }
            .label { font-size: 12px; text-transform: uppercase; font-weight: 700; color: #71717a; letter-spacing: 0.05em; margin-bottom: 4px; }
            .value { font-size: 15px; color: #18181b; }
            .message-box { background: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 16px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #27272a; margin-top: 8px; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #f4f4f5; font-size: 12px; color: #a1a1aa; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Portfolio Contact Form Submission</h2>
            </div>
            
            <div class="field">
              <div class="label">Sender Name</div>
              <div class="value"><strong>${this.escapeHtml(name)}</strong></div>
            </div>

            <div class="field">
              <div class="label">Sender Email</div>
              <div class="value"><a href="mailto:${this.escapeHtml(email)}">${this.escapeHtml(email)}</a></div>
            </div>

            ${subject ? `
            <div class="field">
              <div class="label">Subject</div>
              <div class="value">${this.escapeHtml(subject)}</div>
            </div>` : ''}

            <div class="field">
              <div class="label">Message</div>
              <div class="message-box">${this.escapeHtml(message)}</div>
            </div>

            <div class="field" style="margin-top: 24px;">
              <div class="label">Submission Date</div>
              <div class="value" style="font-size: 13px; color: #71717a;">${submissionDate}</div>
            </div>

            <div class="footer">
              Sent automatically via Portfolio.AI Contact Engine
            </div>
          </div>
        </body>
      </html>
    `;

    const textBody = `
New Contact Form Submission

Name: ${name}
Email: ${email}
${subject ? `Subject: ${subject}\n` : ''}
Message:
${message}

Submitted: ${submissionDate}
    `.trim();

    this.logger.log(`[CONTACT] Sending email to ${recipientEmail} from ${fromAddress}`);

    try {
      const response = await resend.emails.send({
        from: fromAddress,
        to: [recipientEmail],
        replyTo: email,
        subject: emailSubject,
        html: htmlBody,
        text: textBody,
      });

      if (response.error) {
        this.logger.error(`[CONTACT] Email delivery failed: ${response.error.message}`, response.error);
        throw new InternalServerErrorException(`Email delivery failed: ${response.error.message}`);
      }

      this.logger.log(`[CONTACT] Email sent successfully. Resend ID: ${response.data?.id}`);
      return { id: response.data?.id || 'sent' };
    } catch (err: unknown) {
      if (err instanceof InternalServerErrorException) {
        throw err;
      }
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during email sending';
      this.logger.error(`[CONTACT] Email delivery failed with exception: ${errorMessage}`);
      throw new InternalServerErrorException(`Unable to send email: ${errorMessage}`);
    }
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
