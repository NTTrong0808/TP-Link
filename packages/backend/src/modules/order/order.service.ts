import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ApiMeta } from '@src/lib/api'
import { appDayJs } from '@src/lib/dayjs'
import { IPagination } from '@src/types/pagination'
import isNil from 'lodash/isNil'
import { Model } from 'mongoose'
import { ExcelService } from '../shared/excel/excel.service'
import { LarkBotUrls } from '../shared/lark/lark.constants'
import { LarkService } from '../shared/lark/lark.service'
import { MailService } from '../shared/mail/mail.service'
import { BulkUpdateOrderVATDto } from './dto/bulk-update-order-vat'
import { UpdateOrderDto, UpdateOrderNoteDto, UpdateOrderVatInfoDto } from './dto/update-order.dto'
import { Order } from './schemas/order.schema'
import { IOrder, OrderChannel, OrderPaymentMethod, OrderStatus } from './type'

@Injectable()
export class OrderService {
  private beUrl: string

  constructor(
    @InjectModel(Order.name) private orderModel: Model<IOrder>,
    private excelService: ExcelService,
    private sendEmailService: MailService,
    private larkService: LarkService,
  ) {
    this.beUrl = process.env.BE_URL as string
  }

  async getOrderSummary(filters: Record<string, any>) {
    const [result] = await this.orderModel
      .aggregate([
        { $match: filters },
        {
          $group: {
            _id: null,
            totalAmountListPrice: { $sum: '$totalAmountListPrice' },
            totalDiscount: { $sum: '$totalDiscount' },
            totalAmount: { $sum: '$totalAmount' },
          },
        },
      ])
      .exec()

    return {
      totalAmountListPrice: Number(Number(result?.totalAmountListPrice) || 0)?.toFixed(0) || 0,
      totalDiscount: Number(Number(result?.totalDiscount) || 0)?.toFixed(0) || 0,
      totalAmount: Number(Number(result?.totalAmount) || 0)?.toFixed(0) || 0,
    }
  }

  async getOrderDetail(id: string) {
    const order = await this.orderModel.findById(id).lean()
    if (!order) {
      throw new NotFoundException('Order is not found')
    }
    return order
  }

  async getOrderDetailByOrderNumber(orderNumber: string) {
    const order = await this.orderModel.findOne({ orderNumber }).lean()
    return order ?? null
  }

  async updateOrderNote(id: string, data: UpdateOrderNoteDto) {
    const order = await this.orderModel.findById(id).lean()
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng')
    }

    return await this.orderModel.findOneAndUpdate(
      { _id: id },
      { $set: { note: data?.note || order?.note } },
      { new: true },
    )
  }

  async updateOrderVatInfo(id: string, vatInfo: UpdateOrderVatInfoDto) {
    const order = await this.orderModel.findById(id).lean()
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng')
    }

    if (order?.invoiceData || (order?.invoiceCreatedAt && appDayJs(order?.invoiceCreatedAt).isValid())) {
      return new BadRequestException('Đơn hàng đã xuất hóa đơn! Không thể cập nhật thông tin VAT')
    }

    return await this.orderModel.findOneAndUpdate({ _id: id }, { $set: { vatData: vatInfo } }, { new: true })
  }

  async getPaginatedOrders({
    page,
    pageSize,
    sort,
    filters,
    isExportExcel,
    receiverEmail,
  }: {
    page: number
    pageSize: number
    sort: Record<string, 1 | -1>
    isExportExcel: boolean
    filters: Record<string, any>
    receiverEmail: string
  }) {
    try {
      if (isExportExcel) {
        console.log({
          receiverEmail,
          filters,
        })

        await this.larkService.sendMessage(
          LarkBotUrls.exportLogBot,
          this.larkService.getLogMessage({
            type: 'INBOUND',
            serviceName: 'Bắt đầu Xuất excel orders',
            status: '✅ Thành công',
            time: appDayJs().format('DD/MM/YYYY HH:mm:ss'),
            endpoint: `/api/v1/orders`,
            action: 'Bắt đầu Xuất excel orders',
            request: {
              method: 'POST',
              headers: {},
              body: {
                filters,
                receiverEmail,
              },
            },
            response: {},
            triggeredBy: 'System',
          }),
        )

        return 'Trigger queue to export excel'
      } else {
        const skip = (page - 1) * pageSize
        const [data, total] = await Promise.all([
          this.orderModel.find(filters).sort(sort).skip(skip).limit(pageSize).lean(),
          this.orderModel.countDocuments(filters),
        ])

        return [
          data,
          {
            total,
            page,
            pageSize,
            size: pageSize,
            totalPages: Math.ceil(total / pageSize),
            hasNextPage: (page * pageSize || data.length) < total,
            hasPrevPage: page > 1,
          },
        ] as [IOrder[], Partial<IPagination<IOrder> & ApiMeta>]
      }
    } catch (error) {
      console.log('🚀 ~ OrderService ~ error:', error)
    }
  }
  async getExcelOrders({ filters }: { filters: Record<string, any> }) {
    const items = await this.orderModel.find(filters).sort({ createdAt: -1 }).lean()

    const excelFile = await this.excelService.exportReport({
      title: 'Báo cáo danh sách đơn hàng',
      filters: this.mappingFilterKeys(filters),
      data: items,
      headers: this.mappingHeaderKeys(),
    })

    await this.sendEmailService.sendEmail(
      this.sendEmailService.setBookingsExcelBufferAttachmentOption({
        to: 'trongnt@whammytech.com',
        subject: 'Báo cáo đơn hàng Langfarm',
        excelBuffer: excelFile,
        fileName: `${appDayJs().format('YYMMDDHHmm')}-BaoCaoDanhSachDonHang.xlsx`,
        exportedAt: appDayJs().format('DD/MM/YYYY HH:mm:ss'),
      }),
    )
    return 'Oke'
  }

  getAdvanceFilter(
    advancedFilters: {
      field: string
      operator?: string
      value: any
    }[],
  ) {
    const mongoFilters: Record<string, any> = {}
    const isDate = (val: any): boolean => {
      return (
        Object.prototype.toString.call(val) === '[object Date]' || (typeof val === 'string' && !isNaN(Date.parse(val)))
      )
    }

    for (const filter of advancedFilters ?? []) {
      const { field, operator = 'equal', value } = filter

      if (isNil(value)) {
        continue
      }

      const isValidDate = isDate(value)
      // Xử lý value ngày cho các trường đặc biệt unix hoặc bình thường
      const dateVal = isValidDate ? new Date(value) : null
      const dayjsDate = isValidDate ? appDayJs(value) : null

      switch (operator) {
        case 'equal':
          if (field === 'vatInfo') {
            mongoFilters['invoiceIssuedData.invNo'] = {
              $exists: value === 'VAT' ? true : false,
            }
          } else if (dateVal && dayjsDate) {
            mongoFilters[field] = {
              $gte: dayjsDate.startOf('day').toDate(),
              $lte: dayjsDate.endOf('day').toDate(),
            }
          } else {
            mongoFilters[field] = value
          }
          break
        case 'contain':
          mongoFilters[field] = { $regex: value, $options: 'i' }
          break
        case 'notContain':
          mongoFilters[field] = { $not: new RegExp(value, 'i') }
          break
        case 'startWith':
          mongoFilters[field] = { $regex: `^${value}`, $options: 'i' }
          break
        case 'endWith':
          mongoFilters[field] = { $regex: `${value}$`, $options: 'i' }
          break
        case 'empty':
          mongoFilters[field] = { $in: [null, undefined, ''] }
          break
        case 'notEmpty':
          mongoFilters[field] = { $nin: [null, undefined, ''] }
          break
        case 'lessThan':
          mongoFilters[field] = {
            $lt: dateVal || value,
          }
          break
        case 'lessThanEqual':
          mongoFilters[field] = {
            $lte: dayjsDate
              ? dayjsDate.endOf('days').unix()
              : dateVal
                ? appDayJs(dateVal).endOf('days').toDate()
                : value,
          }
          break
        case 'greaterThan':
          mongoFilters[field] = {
            $gt: dayjsDate
              ? dayjsDate.endOf('days').unix()
              : dateVal
                ? appDayJs(dateVal).endOf('days').toDate()
                : value,
          }
          break
        case 'greaterThanEqual':
          mongoFilters[field] = {
            $gte: dayjsDate
              ? dayjsDate.startOf('days').unix()
              : dateVal
                ? appDayJs(dateVal).startOf('days').toDate()
                : value,
          }
          break
        default:
          mongoFilters[field] = value
          break
      }
    }
    return mongoFilters
  }

  getFilters(filters: Record<string, any>) {
    const { createdFrom, createdTo, filterOption } = filters
    const filter: Record<string, any> = {}

    if (createdFrom || createdTo) {
      filter[filterOption ?? 'createdAt'] = {
        ...(createdFrom ? { $gte: appDayJs(createdFrom)?.startOf('days')?.toDate() } : {}),
        ...(createdTo ? { $lte: appDayJs(createdTo)?.endOf('days')?.toDate() } : {}),
      }
    }

    return filter
  }

  mappingFilterKeys(filters: Record<string, any>) {
    return [
      {
        title: 'Khoảng ngày',
        value: `${appDayJs(filters?.createdFrom).format('DD/MM/YYYY')}${' - ' + appDayJs(filters?.createdTo).format('DD/MM/YYYY')}`,
      },
    ]
  }

  mappingHeaderKeys() {
    return [
      {
        title: 'Mã đơn hàng',
        key: 'orderNumber',
      },
      {
        title: 'Kênh bán',
        key: 'channel',
        render: (_: IOrder) => this.mappingChannel(_.channel),
      },
      {
        title: 'Trạng thái đơn hàng',
        key: 'status',
        render: (_: IOrder) => this.mappingOrderStatus(_.status!),
      },
      {
        title: 'Ngày đặt hàng',
        key: 'createdAt',
        render: (_: IOrder) => appDayJs(_.createdAt).format('DD/MM/YYYY HH:mm'),
      },
      {
        title: 'Ngày giao đơn vị vận chuyển',
        key: 'deliveringAt',
        render: (_: IOrder) => appDayJs(_.deliveringAt).format('DD/MM/YYYY HH:mm'),
      },
      {
        title: 'Ngày giao người mua',
        key: 'deliveredAt',
        render: (_: IOrder) => appDayJs(_.deliveredAt).format('DD/MM/YYYY HH:mm'),
      },
      {
        title: 'Hình thức thanh toán',
        key: 'paymentMethod',
        render: (_: IOrder) => this.mappingPaymentMethod(_.paymentMethod!),
      },
      {
        title: 'Tiền hàng',
        key: 'totalAmountListPrice',
        isFormatCurrency: true,
      },
      {
        title: 'Chiết khấu/giảm giá',
        key: 'totalDiscount',
        isFormatCurrency: true,
      },
      {
        title: 'Mã giảm giá',
        key: 'discountCodes',
        render: (_: IOrder) => _.discountCodes?.map((e) => e?.code)?.join(', '),
      },
      {
        title: 'Tiền sau giảm giá',
        key: 'totalAmount',
        isFormatCurrency: true,
      },
      {
        title: 'Ký hiệu',
        key: 'invoiceSymbol',
        render: (_: IOrder) => (_?.invoiceIssuedData?.invNo ? '1C25MOL' : '-'),
      },
      {
        title: 'Số hóa đơn',
        key: 'invNo',
        render: (_: IOrder) => _?.invoiceIssuedData?.invNo ?? '-',
      },
      {
        title: 'Ngày hóa đơn',
        key: 'invoiceCreatedAt',
        render: (_: IOrder) => (_?.invoiceCreatedAt ? appDayJs(_?.invoiceCreatedAt)?.format('DD/MM/YYYY HH:mm') : '-'),
      },
    ]
  }

  mappingPaymentMethod = (paymentMethod: OrderPaymentMethod) => {
    if (paymentMethod === OrderPaymentMethod.COD) {
      return 'COD'
    }
    if (paymentMethod === OrderPaymentMethod.PLATFORM) {
      return 'Sàn thanh toán'
    }
    return 'Sàn thanh toán'
  }

  mappingOrderStatus = (status: OrderStatus) => {
    if (status === OrderStatus.CANCELLED) {
      return 'Đã hủy'
    }
    if (status === OrderStatus.COMPLETED) {
      return 'Hoàn thành'
    }
    if (status === OrderStatus.RETURNED) {
      return 'Trà hàng'
    }
    return 'Đang xử lý'
  }

  mappingChannel = (channel: OrderChannel) => {
    if (channel === OrderChannel.SPE) {
      return 'Shopee'
    }
    if (channel === OrderChannel.LZD) {
      return 'Lazada'
    }
    if (channel === OrderChannel.TTS) {
      return 'Tiktok Shop'
    }
    return 'Chưa xác định'
  }

  async updateOrder(id: string, dto: UpdateOrderDto) {
    console.log('🚀 ~ OrderService ~ updateOrder ~ dto:', dto)
    const existedOrder = await this.orderModel.findById(id).lean()
    if (!existedOrder) {
      throw new NotFoundException('Order is not found')
    }
    return await this.orderModel.findOneAndUpdate(
      {
        _id: id,
      },
      dto,
    )
  }

  async removeVAT(id: string) {
    return await this.orderModel.findOneAndUpdate(
      { _id: id },
      { $unset: { vatData: '' } }, // Unsets the field properly
      { new: true }, // Optional: returns the updated document
    )
  }

  async bulkUpdateOrderVAT(dto: BulkUpdateOrderVATDto) {
    const { vatDatas } = dto

    if (!vatDatas || !Array.isArray(vatDatas) || vatDatas.length === 0) {
      throw new BadRequestException('Dữ liệu VAT không hợp lệ hoặc trống')
    }

    // Chuẩn bị bulk operations
    const bulkOps = vatDatas.map((vat) => ({
      updateOne: {
        filter: { orderNumber: vat.orderNumber, 'invoiceIssuedData.invNo': { $exists: false } },
        update: {
          $set: {
            vatData: {
              address: vat.address,
              legalName: vat.legalName,
              receiverEmail: vat.receiverEmail,
              taxCode: vat.taxCode,
              note: vat.note,
            },
          },
        },
      },
    }))
    console.log('🚀 ~ OrderService ~ bulkOps ~ bulkOps:', bulkOps)
    console.log(JSON.stringify(bulkOps, null, 2))

    // Thực hiện bulkWrite
    const result = await this.orderModel.bulkWrite(bulkOps)

    return {
      matched: result.matchedCount,
      modified: result.modifiedCount,
    }
  }
}
