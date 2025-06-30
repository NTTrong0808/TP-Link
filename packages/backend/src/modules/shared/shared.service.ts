import { Injectable } from '@nestjs/common'
import { LarkService, MailService } from 'share'

@Injectable()
export class SharedService {
  private mailService: MailService

  constructor() {
    this.mailService = new MailService()
  }

  async sendLarkNotification(message: string): Promise<any> {
    // Sử dụng LarkService từ shared package
    return await LarkService.sendMessage(
      'YOUR_LARK_BOT_URL' as any, // Thay thế bằng URL thực tế
      message,
    )
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    // Sử dụng MailService từ shared package
    const options = this.mailService.setSimpleOption({
      to,
      subject,
      html,
    })

    return await this.mailService.sendEmail(options)
  }

  getLogMessage(params: {
    type: 'INBOUND' | 'OUTBOUND'
    serviceName: string
    status: '✅ Thành công' | '❌ Thất bại'
    time: string
    endpoint: string
    action: string
    request?: any
    response?: any
    traceId?: string
    triggeredBy?: string
    note?: string
  }): string {
    return LarkService.getLogMessage(params)
  }
}
