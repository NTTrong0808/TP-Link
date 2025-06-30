import * as path from 'path';
import SparkPost, { Attachment, CreateTransmission } from 'sparkpost';
import {
  exportBookingTemplate,
  exportOrderTemplate,
} from './constants/template';

export type ILCMailContent = {
  from?: string;
  subject: string;
  html: string;
  to: string;
  attachments?: Attachment[];
};

export type ILCRestPasswordMailContent = {
  resetPasswordUrl: string;
  openingTime?: string;
  closingTime?: string;
  lfHotline?: string;
  lfEmail?: string;
  lfAddress?: string;
} & Partial<ILCMailContent>;

export type ILCTicketMailContent = {
  customerName?: string;
  ticketDate: string;
  bookingCode: string;
  expirationDate: string;
  ticketUrl: string;
  openingTime?: string;
  closingTime?: string;
  lfHotline?: string;
  lfEmail?: string;
  lfAddress?: string;
} & Partial<ILCMailContent>;

export class MailService {
  private sparkPost: SparkPost;
  private fromEmail: { email: string; name: string };
  private templateBasePath: string;
  private imageBasePath: string;

  constructor() {
    if (!process.env.SPARK_POST_KEY) {
      throw new Error('Missing SPARK_POST_KEY environment variable');
    }

    this.sparkPost = new SparkPost(process.env.SPARK_POST_KEY);
    this.fromEmail = {
      name: process.env.FROM_EMAIL_NAME || 'Langfarm Center',
      email: process.env.FROM_EMAIL || 'support@langfarmcenter.com',
    };

    this.templateBasePath = path.resolve(
      process.cwd(),
      'packages/functions/shared/templates'
    );

    this.imageBasePath = path.join(this.templateBasePath, 'assets/images');
  }

  async sendEmail(options: CreateTransmission): Promise<boolean> {
    try {
      const data = await this.sparkPost.transmissions.send(options);
      console.log(
        '[MailService] Sent email successfully:',
        JSON.stringify(data)
      );
      return true;
    } catch (error: any) {
      console.error(
        '[MailService] Failed to send email:',
        error?.errors || error
      );
      return false;
    }
  }

  setSimpleOption(payload: ILCMailContent): CreateTransmission {
    const {
      from = this.fromEmail,
      subject,
      html,
      to: address,
      attachments,
    } = payload;

    return {
      content: {
        from,
        subject,
        html,
        ...(attachments ? { attachments } : {}),
      },
      recipients: [{ address }],
    };
  }

  setExcelAttachmentOption(payload: {
    to: string;
    subject?: string;
    excelBuffer: Buffer;
    fileName?: string;
    from?: string;
    exportedAt?: string;
    exportedBy?: string;
  }): CreateTransmission {
    const {
      from = this.fromEmail,
      subject = 'Báo cáo Excel từ Langfarm Center',
      to,
      excelBuffer,
      fileName = 'report.xlsx',
      exportedAt,
      exportedBy,
    } = payload;

    const attachment: Attachment = {
      name: fileName,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      data: excelBuffer.toString('base64'),
    };

    return {
      content: {
        from,
        subject,
        html: exportBookingTemplate({ exportedAt, exportedBy }),
        attachments: [attachment],
      },
      recipients: [{ address: to }],
    };
  }

  setOrderExcelAttachmentOption(payload: {
    to: string;
    subject?: string;
    excelBuffer: Buffer;
    fileName?: string;
    from?: string;
    exportedAt: string;
  }): CreateTransmission {
    const {
      from = this.fromEmail,
      subject = 'Báo cáo Excel từ Langfarm Center',
      to,
      excelBuffer,
      fileName = 'report.xlsx',
      exportedAt,
    } = payload;

    const attachment: Attachment = {
      name: fileName,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      data: excelBuffer.toString('base64'),
    };

    return {
      content: {
        from,
        subject,
        html: exportOrderTemplate({ exportedAt }),
        attachments: [attachment],
      },
      recipients: [{ address: to }],
    };
  }
}
