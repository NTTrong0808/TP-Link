import { Body, Controller, Post, Query, Res } from '@nestjs/common'
import { InvoiceService } from './invoice.service'
import { Response } from 'express'
import { getPaginationQuery } from '@src/utils/get-pagination-query'
import { ApiBuilder, ApiMeta } from '@src/lib/api'

@Controller({
  path: 'invoices',
  version: '1',
})
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async getPaginatedInvoices(
    @Query() query: Record<string, any>,
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ) {
    const { page, pageSize, sort, isExportExcel, filters } = getPaginationQuery(query)
    const advancedFilters = this.invoiceService.getAdvanceFilter(body?.advancedFilters) ?? {}

    const _filters = { ...this.invoiceService.getFilters(filters), ...advancedFilters }

    const result = await this.invoiceService.getPaginatedInvoices({
      page: Number(page ?? 1),
      pageSize: Number(pageSize ?? 100),
      sort,
      isExportExcel,
      filters: _filters,
    })
    if (Buffer.isBuffer(result)) {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx')
      return res.send(result)
    }
    return ApiBuilder.create()
      .setData(result?.[0])
      .setMeta(result?.[1] as ApiMeta)
      .setMessage('Success')
      .build()
  }
}
