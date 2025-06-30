import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Invoice, InvoiceDocument } from './schemas/invoice.schema'
import { appDayJs } from '@src/lib/dayjs'
import { ApiMeta } from '@src/lib/api'
import { IPagination } from '@src/types/pagination'

@Injectable()
export class InvoiceService {
  constructor(@InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>) {}

  async getPaginatedInvoices({
    page,
    pageSize,
    sort,
    filters,
  }: {
    page: number
    pageSize: number
    sort: Record<string, 1 | -1>
    isExportExcel: boolean
    filters: Record<string, any>
  }) {
    try {
      const skip = (page - 1) * pageSize
      console.log('filters', filters)
      console.log('sort', sort)
      const total = 100
      const [data] = await Promise.all([this.invoiceModel.find(filters).sort(sort).skip(skip).limit(pageSize).lean()])

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
      ] as [Invoice[], Partial<IPagination<Invoice> & ApiMeta>]
    } catch (error) {
      console.log('🚀 ~ InvoiceService ~ error:', error)
    }
  }

  getAdvanceFilter(
    advancedFilters: {
      field: string
      operator?: string
      value: any
    }[],
  ) {
    const mongoFilters: Record<string, any> = {}
    // Các trường lưu dưới dạng unix (second)
    const unixFields = ['meInvoiceCreatedAt', 'confirmedAt']
    const stringDateFields = ['checkInDate']
    const isDate = (val: any): boolean => {
      return (
        Object.prototype.toString.call(val) === '[object Date]' || (typeof val === 'string' && !isNaN(Date.parse(val)))
      )
    }

    for (const filter of advancedFilters ?? []) {
      const { field, operator = 'equal', value } = filter

      if (value === '' || value === null || value === undefined) {
        continue
      }

      const isUnixField = unixFields.includes(field)
      const isValidDate = isDate(value)
      // Xử lý value ngày cho các trường đặc biệt unix hoặc bình thường
      const dateVal = isValidDate ? new Date(value) : null
      const dayjsDate = isValidDate ? appDayJs(value) : null
      const isStringDate = stringDateFields.includes(field)
      switch (operator) {
        case 'equal':
          if (field === 'vatInfo') {
            mongoFilters['metadata.invNo'] = {
              $exists: value === 'VAT' ? true : false,
            }
          } else if (isUnixField && dayjsDate) {
            mongoFilters[field] = {
              $gte: dayjsDate.startOf('day').unix(),
              $lte: dayjsDate.endOf('day').unix(),
            }
          } else if (dateVal && dayjsDate) {
            mongoFilters[field] = {
              $gte: dayjsDate.startOf('day').toISOString(),
              $lte: dayjsDate.endOf('day').toISOString(),
            }
          } else {
            mongoFilters[field] = isStringDate ? appDayJs(value).format('YYYY-MM-DD') : value
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
          mongoFilters[field] = { $in: [null, ''] }
          break
        case 'lessThan':
          if (isStringDate) {
            mongoFilters[field] = {
              $lt: appDayJs(value).format('YYYY-MM-DD'),
            }
            break
          }
          mongoFilters[field] = {
            $lt: isUnixField && dayjsDate ? dayjsDate.unix() : dateVal || value,
          }
          break
        case 'lessThanEqual':
          if (isStringDate) {
            mongoFilters[field] = {
              $lte: appDayJs(value).format('YYYY-MM-DD'),
            }
            break
          }
          mongoFilters[field] = {
            $lte:
              isUnixField && dayjsDate
                ? dayjsDate.endOf('days').unix()
                : isUnixField
                  ? appDayJs(dateVal).endOf('days').toISOString()
                  : value,
          }
          break
        case 'greaterThan':
          if (isStringDate) {
            mongoFilters[field] = {
              $gt: appDayJs(value).format('YYYY-MM-DD'),
            }
            break
          }
          mongoFilters[field] = {
            $gt:
              isUnixField && dayjsDate
                ? dayjsDate.endOf('days').unix()
                : isUnixField
                  ? appDayJs(dateVal).endOf('days').toISOString()
                  : value,
          }
          break
        case 'greaterThanEqual':
          if (isStringDate) {
            mongoFilters[field] = {
              $gte: appDayJs(value).format('YYYY-MM-DD'),
            }
            break
          }
          mongoFilters[field] = {
            $gte:
              isUnixField && dayjsDate
                ? dayjsDate.startOf('days').unix()
                : appDayJs(dateVal).startOf('days').toISOString() || value,
          }
          break
        default:
          mongoFilters[field] = value
          break
      }
    }
    return mongoFilters
  }

  async getFilters(filters: Record<string, any>) {
    const { createdFrom, createdTo } = filters
    const filter: Record<string, any> = {}

    if (createdFrom || createdTo) {
      filter.createdAt = {
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
        title: 'Số booking',
        key: 'bookingCode',
      },
      {
        title: 'Mã biên lai',
        key: 'receiptNumber',
      },
      {
        title: 'Thu ngân',
        key: 'createdByName',
      },
      {
        title: 'Kênh',
        key: 'saleChannelName',
      },
      {
        title: 'Máy POS',
        key: 'posTerminalName',
      },
    ]
  }
}
