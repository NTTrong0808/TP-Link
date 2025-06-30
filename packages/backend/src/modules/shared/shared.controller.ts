import { Body, Controller, Get, Post } from '@nestjs/common'
import { SharedService } from './shared.service'

@Controller('shared')
export class SharedController {
  constructor(private readonly sharedService: SharedService) {}

  @Post('send-lark')
  async sendLarkNotification(@Body() body: { message: string }) {
    return await this.sharedService.sendLarkNotification(body.message)
  }

  @Post('send-email')
  async sendEmail(@Body() body: { to: string; subject: string; html: string }) {
    return await this.sharedService.sendEmail(body.to, body.subject, body.html)
  }

  @Get('log-message')
  getLogMessage() {
    return this.sharedService.getLogMessage({
      type: 'INBOUND',
      serviceName: 'Test Service',
      status: '✅ Thành công',
      time: new Date().toISOString(),
      endpoint: '/api/test',
      action: 'Test Action',
      request: { method: 'GET', headers: {}, body: {} },
      response: { status: 200, data: 'Success' },
      traceId: 'test-trace-id',
      triggeredBy: 'Test User',
      note: 'Test note',
    })
  }
}
