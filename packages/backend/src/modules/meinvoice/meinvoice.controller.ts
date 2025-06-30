import { BadRequestException, Body, Controller, Get, Inject, Param, Post, Res } from '@nestjs/common'
import { AppVersion } from '@src/enums/app.enum'
import { ApiBuilder } from '@src/lib/api'
import { MeInvoiceService } from './meinvoice.service'
import { IHaravanInvoices } from './types/haravan.interface'
import { Response } from 'express'
import { TypeConfig } from '@src/enums/meinvoice.enum'

@Controller({
  version: AppVersion.v1,
  path: '/meinvoice',
})
export class MeInvoiceController {
  @Inject() private readonly meInvoiceService: MeInvoiceService

  @Post('/issue-for-haravan')
  async issueInvoiceForHaravan(@Body() body: Record<string, any>) {
    const dto = body as IHaravanInvoices
    const res = await this.meInvoiceService.handleIssueInvoiceForHaravan(dto)
    return ApiBuilder.create().setMessage('Fetch success').setData(res).build()
  }

  @Post('/test')
  async testDownloadAndSendEmail() {
    await this.meInvoiceService.sendEmail()
    return ApiBuilder.create().setMessage('Fetch success').build()
  }

  @Post('/refresh')
  async refreshToken() {
    await this.meInvoiceService.validateToken()
    return ApiBuilder.create().setMessage('Fetch success').build()
  }

  @Get('/ola/:transId')
  async getVATPDFForOla(@Param('transId') transId: string, @Res() res: Response) {
    const base64 = await this.meInvoiceService.getInvoicePdfForOtherType(transId, TypeConfig.OLA_ME_INVOICE)
    if (!base64) {
      throw new BadRequestException('Không tìm thấy hóa đơn VAT')
    }
    const buffer = Buffer.from(base64, 'base64')
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename="vat-invoice.pdf"')
    res.send(buffer)
  }

  @Get('/:transId')
  async getVATPDF(@Param('transId') transId: string, @Res() res: Response) {
    const base64 = await this.meInvoiceService.getInvoicePdf(transId)
    if (!base64) {
      throw new BadRequestException('Không tìm thấy hóa đơn VAT')
    }
    const buffer = Buffer.from(base64, 'base64')
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename="vat-invoice.pdf"')
    res.send(buffer)
  }
}
