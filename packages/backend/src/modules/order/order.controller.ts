import { Body, Controller, Get, Param, Patch, Post, Query, Res } from '@nestjs/common'
import { AppVersion } from '@src/enums/app.enum'
import { ApiBuilder, ApiMeta } from '@src/lib/api'
import { getPaginationQuery } from '@src/utils/get-pagination-query'
import { Response } from 'express'
import { BulkUpdateOrderVATDto } from './dto/bulk-update-order-vat'
import { UpdateOrderDto, UpdateOrderNoteDto, UpdateOrderVatInfoDto } from './dto/update-order.dto'
import { OrderService } from './order.service'

@Controller({
  path: 'orders',
  version: AppVersion.v1,
})
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/summary')
  async getOrdersSummary(@Query() query: Record<string, any>, @Body() body: Record<string, any>) {
    const { createdFrom, createdTo } = query
    const { filters } = getPaginationQuery(query)

    const advancedFilters = this.orderService.getAdvanceFilter(body?.advancedFilters) ?? {}
    const _filters = {
      ...this.orderService.getFilters({
        ...filters,
        createdFrom,
        createdTo,
      }),
      ...advancedFilters,
    }

    const result = await this.orderService.getOrderSummary(_filters)
    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Get('by-order-number/:orderNumber')
  async getOrderDetailByOrderNumber(@Param('orderNumber') orderNumber: string) {
    const result = await this.orderService.getOrderDetailByOrderNumber(orderNumber)
    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Get('/:id')
  async getOrderDetail(@Param('id') id: string) {
    const result = await this.orderService.getOrderDetail(id)
    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Patch('/:id/note')
  async updateOrderNote(@Body() body: UpdateOrderNoteDto, @Param('id') id: string) {
    const result = await this.orderService.updateOrderNote(id, body)
    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Patch('/:id/vat-info')
  async updateOrderVatInfo(@Body() body: UpdateOrderVatInfoDto, @Param('id') id: string) {
    const result = await this.orderService.updateOrderVatInfo(id, body)
    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Post('/update/:id')
  async updateOrder(@Body() body: UpdateOrderDto, @Param('id') id: string) {
    const result = await this.orderService.updateOrder(id, body)
    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Post('/remove-vat/:id')
  async removeVAT(@Param('id') id: string) {
    const result = await this.orderService.removeVAT(id)
    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Post('/bulk-update-vat')
  async bulkUpdateOrderVAT(@Body() body: BulkUpdateOrderVATDto) {
    const result = await this.orderService.bulkUpdateOrderVAT(body)
    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Post('/export-excel')
  async exportExcelBookings(@Body() body: Record<string, any>, @Res() res: Response) {
    const result = await this.orderService.getExcelOrders({
      filters: body?.filters,
    })

    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Post()
  async getPaginatedOrders(@Query() query: Record<string, any>, @Body() body: Record<string, any>) {
    const { page, pageSize, sort, isExportExcel, filters, receiverEmail = '' } = getPaginationQuery(query)
    const advancedFilters = this.orderService.getAdvanceFilter(body?.advancedFilters) ?? {}
    const _filters = { ...this.orderService.getFilters(filters), ...advancedFilters }

    const result = await this.orderService.getPaginatedOrders({
      page: Number(page ?? 1),
      pageSize: Number(pageSize ?? 100),
      sort,
      isExportExcel,
      filters: _filters,
      receiverEmail,
    })

    return ApiBuilder.create()
      .setData(result?.[0])
      .setMeta(result?.[1] as ApiMeta)
      .setMessage('Success')
      .build()
  }
}
