import { config } from 'dotenv';
import { ObjectId } from 'mongodb';
import { appDayJs } from './dayjs';
import { ExcelService } from './excel.service';
import { MailService } from './mail.service';
import { MongoDBService } from './mongodb.service';
import { IOrder } from './types/order.type';
import { normalizeDateFilters } from './utils';
import { LarkService } from './lark.service';
import { LarkBotUrls } from './constants/lark.constants';

config();

// Enums and Constants
export enum OrderStatus {
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PROCESSING = 'PROCESSING',
  RETURNED = 'RETURNED',
}

export enum OrderPaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  COD = 'COD',
  PLATFORM = 'PLATFORM',
}

export enum OrderChannel {
  SPE = 'SPE',
  LZD = 'LZD',
  TTS = 'TTS',
  OFFLINE = 'OFFLINE',
}

export const PaymentMethodLabel: Record<OrderPaymentMethod, string> = {
  [OrderPaymentMethod.CASH]: 'Tiền mặt',
  [OrderPaymentMethod.BANK_TRANSFER]: 'Chuyển khoản',
  [OrderPaymentMethod.CREDIT_CARD]: 'Thẻ tín dụng',
  [OrderPaymentMethod.COD]: 'COD',
  [OrderPaymentMethod.PLATFORM]: 'Sàn thanh toán',
};

export const ChannelLabel: Record<OrderChannel, string> = {
  [OrderChannel.SPE]: 'Shopee',
  [OrderChannel.LZD]: 'Lazada',
  [OrderChannel.TTS]: 'Tiktok Shop',
  [OrderChannel.OFFLINE]: 'Offline',
};

export const DEFAULT_COMMISSION_RATE = 0.1;
export const DEFAULT_COMMISSION_RATE_FOR_OFFLINE = 0.05;

// Interfaces
export interface CurrentUserPayload {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface OrderFilter {
  status?: string;
  totalAmountFrom?: string;
  totalAmountTo?: string;
  paymentMethod?: string;
  channel?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  createdFrom?: string;
  createdTo?: string;
  createdBy?: string;
  vat?: string;
}

export interface VatInfo {
  taxCode?: string;
  receiverEmail?: string;
  legalName?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  discount?: number;
}

export class OrderService {
  private dbService: MongoDBService;
  private excelService: ExcelService;
  private mailService: MailService;

  constructor() {
    this.dbService = MongoDBService.getInstance();
    this.excelService = new ExcelService();
    this.mailService = new MailService();
  }

  public async getOrderFilter(
    filters: OrderFilter
  ): Promise<Record<string, any>> {
    const {
      status,
      totalAmountFrom,
      totalAmountTo,
      paymentMethod,
      channel,
      search,
      fromDate,
      toDate,
      createdFrom,
      createdTo,
      createdBy,
      vat,
    } = filters;

    const filter: Record<string, any> = {
      deleted: { $ne: true },
    };

    // Handle search
    if (search) {
      const orArr: Record<string, any>[] = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
      ];

      if (ObjectId.isValid(search)) {
        orArr.push({ _id: new ObjectId(search) });
      }

      filter.$or = orArr;
    }

    // Filter status
    if (status) {
      filter.status = { $in: status.split(',') };
    }

    // Filter channel
    if (channel) {
      filter.channel = { $in: channel.split(',') };
    }

    // Filter totalAmount
    const amountFilter: Record<string, number> = {};
    if (totalAmountFrom && !isNaN(+totalAmountFrom)) {
      amountFilter.$gte = +totalAmountFrom;
    }
    if (totalAmountTo && !isNaN(+totalAmountTo)) {
      amountFilter.$lte = +totalAmountTo;
    }
    if (Object.keys(amountFilter).length) {
      filter.totalAmount = amountFilter;
    }

    // Filter createdAt
    const createdAtFilter: Record<string, Date> = {};
    if (createdFrom) {
      createdAtFilter.$gte = appDayJs(createdFrom).startOf('day').toDate();
    }
    if (createdTo) {
      createdAtFilter.$lte = appDayJs(createdTo).endOf('day').toDate();
    }
    if (fromDate) {
      createdAtFilter.$gte = appDayJs(fromDate).startOf('day').toDate();
    }
    if (toDate) {
      createdAtFilter.$lte = appDayJs(toDate).endOf('day').toDate();
    }
    if (Object.keys(createdAtFilter).length) {
      filter.createdAt = createdAtFilter;
    }

    // Filter paymentMethod
    if (paymentMethod) {
      filter.paymentMethod = { $in: paymentMethod.split(',') };
    }

    // Filter createdBy
    if (createdBy) {
      filter.createdBy = { $in: createdBy.split(',') };
    }

    // Filter VAT
    if (vat) {
      const vats = vat.split(',').length ? vat.split(',') : [vat];
      if (vats.length === 1) {
        if (vats[0] === 'NO_VAT') {
          filter['invoiceIssuedData.invNo'] = { $exists: false };
        }
        if (vats[0] === 'VAT') {
          filter['invoiceIssuedData.invNo'] = { $exists: true };
        }
      }
    }

    return filter;
  }

  public async getExcelOrders({
    filters,
    receiverEmail,
  }: {
    filters: Record<string, any>;
    receiverEmail: string;
  }): Promise<string> {
    try {
      console.log('🚀 ~ OrderService ~ receiverEmail:', receiverEmail);
      console.log('🚀 ~ OrderService ~ filters:', filters);

      await this.dbService.connect();
      const normalizedFilters = normalizeDateFilters(filters);
      console.log('🚀 ~ normalizedFilters:', normalizedFilters);
      const projection = {
        channel: 1,
        orderNumber: 1,
        paymentMethod: 1,
        paymentStatus: 1,
        fulfilmentStatus: 1,
        status: 1,
        totalAmountListPrice: 1,
        totalDiscount: 1,
        totalAmount: 1,
        discountCodes: 1,
        note: 1,
        createdAt: 1,
        updatedAt: 1,
        deliveredAt: 1,
        deliveringAt: 1,
        invoiceCreatedAt: 1,
        invoiceIssuedData: 1,
        invoiceRefId: 1,
      };

      const cursor = this.dbService
        .getCollection('orders')
        .find(normalizedFilters, { projection });

      const items: any[] = [];

      for await (const doc of cursor) {
        items.push(doc);
      }

      console.log('🚀 ~ OrderService ~ items length:', items.length);

      const excelFile: any = await this.excelService.exportReport({
        title: 'Báo cáo danh sách đơn hàng',
        filters: this.mappingFilterKeys(filters),
        data: items,
        headers: this.mappingHeaderKeys(),
      });

      await this.mailService.sendEmail(
        this.mailService.setOrderExcelAttachmentOption({
          to: receiverEmail,
          subject: 'Báo cáo đơn hàng Langfarm',
          excelBuffer: excelFile,
          fileName: `${appDayJs().format(
            'YYMMDDHHmm'
          )}-BaoCaoDanhSachDonHang.xlsx`,
          exportedAt: appDayJs().format('DD/MM/YYYY HH:mm:ss'),
        })
      );

      await LarkService.sendMessage(
        LarkBotUrls.exportLogBot,
        LarkService.getLogMessage({
          type: 'INBOUND',
          serviceName: 'Xuất excel orders thành công',
          status: '✅ Thành công',
          time: appDayJs().format('DD/MM/YYYY HH:mm:ss'),
          endpoint: `/api/v1/orders`,
          action: 'Xuất excel orders thành công',
          request: {
            method: 'POST',
            headers: {},
            body: {
              filters,
              receiverEmail,
              to: receiverEmail,
              subject: 'Báo cáo đơn hàng Langfarm',
              fileName: `${appDayJs().format(
                'YYMMDDHHmm'
              )}-BaoCaoDanhSachDonHang.xlsx`,
              exportedAt: appDayJs().format('DD/MM/YYYY HH:mm:ss'),
            },
          },
          response: {},
          triggeredBy: 'System',
        })
      );
    } catch (error) {
      await LarkService.sendMessage(
        LarkBotUrls.exportLogBot,
        LarkService.getLogMessage({
          type: 'INBOUND',
          serviceName: 'Xuất excel orders thất bại',
          status: '❌ Thất bại',
          time: appDayJs().format('DD/MM/YYYY HH:mm:ss'),
          endpoint: `/api/v1/orders`,
          action: 'Xuất excel orders thất bại',
          request: {
            method: 'POST',
            headers: {},
            body: {
              error,
            },
          },
          response: {},
          triggeredBy: 'System',
        })
      );
    } finally {
      await this.dbService.disconnect();
    }

    return 'OK';
  }

  private mappingFilterKeys(filters: Record<string, any>) {
    return [
      {
        title: 'Khoảng ngày',
        value: `${appDayJs(filters?.createdAt?.$gte).format('DD/MM/YYYY')}${
          filters?.createdAt?.$lte
            ? ' - ' + appDayJs(filters?.createdAt?.$lte).format('DD/MM/YYYY')
            : ''
        }`,
      },
    ];
  }

  private mappingHeaderKeys() {
    return [
      {
        title: 'Mã đơn hàng',
        key: 'orderNumber',
      },
      {
        title: 'Kênh bán',
        key: 'channel',
        render: (value: IOrder) => this.mappingChannel(value.channel),
      },
      {
        title: 'Trạng thái đơn hàng',
        key: 'status',
        render: (value: IOrder) =>
          this.mappingOrderStatus(value.status as OrderStatus),
      },
      {
        title: 'Ngày đặt hàng',
        key: 'createdAt',
        render: (value: IOrder) =>
          appDayJs(value?.createdAt).format('DD/MM/YYYY HH:mm'),
      },
      {
        title: 'Ngày giao đơn vị vận chuyển',
        key: 'deliveringAt',
        render: (value: IOrder) =>
          value?.deliveringAt
            ? appDayJs(value.deliveringAt).format('DD/MM/YYYY HH:mm')
            : '-',
      },
      {
        title: 'Ngày giao người mua',
        key: 'deliveredAt',
        render: (value: IOrder) =>
          value?.deliveredAt
            ? appDayJs(value.deliveredAt).format('DD/MM/YYYY HH:mm')
            : '-',
      },
      {
        title: 'Hình thức thanh toán',
        key: 'paymentMethod',
        render: (value: IOrder) =>
          this.mappingPaymentMethod(value.paymentMethod as OrderPaymentMethod),
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
        render: (value: IOrder) =>
          value?.discountCodes?.map((e) => e?.code)?.join(', ') || '-',
      },
      {
        title: 'Tiền sau giảm giá',
        key: 'totalAmount',
        isFormatCurrency: true,
      },
      {
        title: 'Ký hiệu',
        key: 'invoiceSymbol',
        render: (value: IOrder) =>
          value?.invoiceIssuedData?.invNo ? '1C25MOL' : '-',
      },
      {
        title: 'Số hóa đơn',
        key: 'invoiceIssuedData.invNo',
        render: (value: IOrder) => value?.invoiceIssuedData?.invNo ?? '-',
      },
      {
        title: 'Ngày hóa đơn',
        key: 'invoiceCreatedAt',
        render: (value: IOrder) =>
          value?.invoiceCreatedAt
            ? appDayJs(value?.invoiceCreatedAt).format('DD/MM/YYYY HH:mm')
            : '-',
      },
    ];
  }

  private mappingOrderStatus(status: OrderStatus): string {
    const statusLabels: Record<OrderStatus, string> = {
      [OrderStatus.COMPLETED]: 'Hoàn thành',
      [OrderStatus.CANCELLED]: 'Đã hủy',
      [OrderStatus.PROCESSING]: 'Đang xử lý',
      [OrderStatus.RETURNED]: 'Trả hàng',
    };
    return statusLabels[status] || status;
  }

  private mappingPaymentMethod(paymentMethod: OrderPaymentMethod): string {
    return PaymentMethodLabel[paymentMethod] || paymentMethod;
  }

  private mappingChannel(channel: OrderChannel): string {
    return ChannelLabel[channel] || channel;
  }

  public getAdvanceFilter(
    advancedFilters: { field: string; operator?: string; value: any }[]
  ): Record<string, any> {
    const mongoFilters: Record<string, any> = {};
    const unixFields = ['invoiceCreatedAt'];
    const stringDateFields = ['deliveringAt', 'deliveredAt'];

    const isDate = (val: any): boolean => {
      return (
        Object.prototype.toString.call(val) === '[object Date]' ||
        (typeof val === 'string' && !isNaN(Date.parse(val)))
      );
    };

    for (const filter of advancedFilters ?? []) {
      const { field, operator = 'equal', value } = filter;

      if (value === '' || value === null || value === undefined) {
        continue;
      }

      const isUnixField = unixFields.includes(field);
      const isValidDate = isDate(value);
      const dateVal = isValidDate ? new Date(value) : null;
      const dayjsDate = isValidDate ? appDayJs(value) : null;
      const isStringDate = stringDateFields.includes(field);

      switch (operator) {
        case 'equal':
          if (field === 'vatInfo') {
            mongoFilters['invoiceIssuedData.invNo'] = {
              $exists: value === 'VAT' ? true : false,
            };
          } else if (isUnixField && dayjsDate) {
            mongoFilters[field] = {
              $gte: dayjsDate.startOf('day').unix(),
              $lte: dayjsDate.endOf('day').unix(),
            };
          } else if (dateVal && dayjsDate) {
            mongoFilters[field] = {
              $gte: dayjsDate.startOf('day').toISOString(),
              $lte: dayjsDate.endOf('day').toISOString(),
            };
          } else {
            mongoFilters[field] = isStringDate
              ? appDayJs(value).format('YYYY-MM-DD')
              : value;
          }
          break;
        case 'contain':
          mongoFilters[field] = { $regex: value, $options: 'i' };
          break;
        case 'notContain':
          mongoFilters[field] = { $not: new RegExp(value, 'i') };
          break;
        case 'startWith':
          mongoFilters[field] = { $regex: `^${value}`, $options: 'i' };
          break;
        case 'endWith':
          mongoFilters[field] = { $regex: `${value}$`, $options: 'i' };
          break;
        case 'empty':
          mongoFilters[field] = { $in: [null, ''] };
          break;
        case 'lessThan':
          if (isStringDate) {
            mongoFilters[field] = {
              $lt: appDayJs(value).format('YYYY-MM-DD'),
            };
            break;
          }
          mongoFilters[field] = {
            $lt: isUnixField && dayjsDate ? dayjsDate.unix() : dateVal || value,
          };
          break;
        case 'lessThanEqual':
          if (isStringDate) {
            mongoFilters[field] = {
              $lte: appDayJs(value).format('YYYY-MM-DD'),
            };
            break;
          }
          mongoFilters[field] = {
            $lte:
              isUnixField && dayjsDate
                ? dayjsDate.endOf('day').unix()
                : isUnixField
                  ? appDayJs(dateVal).endOf('day').toISOString()
                  : value,
          };
          break;
        case 'greaterThan':
          if (isStringDate) {
            mongoFilters[field] = {
              $gt: appDayJs(value).format('YYYY-MM-DD'),
            };
            break;
          }
          mongoFilters[field] = {
            $gt:
              isUnixField && dayjsDate
                ? dayjsDate.endOf('day').unix()
                : isUnixField
                  ? appDayJs(dateVal).endOf('day').toISOString()
                  : value,
          };
          break;
        case 'greaterThanEqual':
          if (isStringDate) {
            mongoFilters[field] = {
              $gte: appDayJs(value).format('YYYY-MM-DD'),
            };
            break;
          }
          mongoFilters[field] = {
            $gte:
              isUnixField && dayjsDate
                ? dayjsDate.startOf('day').unix()
                : appDayJs(dateVal).startOf('day').toISOString() || value,
          };
          break;
        default:
          mongoFilters[field] = value;
          break;
      }
    }
    return mongoFilters;
  }

  public async getFilters(
    filters: Record<string, any>
  ): Promise<Record<string, any>> {
    const { createdFrom, createdTo, filterOption } = filters;
    const filter: Record<string, any> = {};

    if (createdFrom || createdTo) {
      filter[filterOption ?? 'createdAt'] = {
        ...(createdFrom
          ? { $gte: appDayJs(createdFrom)?.startOf('day')?.toDate() }
          : {}),
        ...(createdTo
          ? { $lte: appDayJs(createdTo)?.endOf('day')?.toDate() }
          : {}),
      };
    }

    return filter;
  }
}
