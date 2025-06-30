import { config } from 'dotenv';
import { appDayJs } from './dayjs';
import { ExcelService } from './excel.service';
import { MailService } from './mail.service';
import { MongoDBService } from './mongodb.service';
import { normalizeDateFilters } from './utils';
import { LarkService } from './lark.service';
import { LarkBotUrls } from './constants/lark.constants';

config();

// Enums and Constants
export enum BookingStatus {
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PROCESSING = 'PROCESSING',
}

export enum CommissionPaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  PAYOO = 'PAYOO',
}

export enum PaymentType {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  PAYOO = 'PAYOO',
}

export const PaymentMethodLabel: Record<PaymentType, string> = {
  [PaymentType.CASH]: 'Tiền mặt',
  [PaymentType.BANK_TRANSFER]: 'Chuyển khoản',
  [PaymentType.CREDIT_CARD]: 'Thẻ tín dụng',
  [PaymentType.PAYOO]: 'Payoo',
};

export const DEFAULT_COMMISSION_RATE = 0.1;
export const DEFAULT_COMMISSION_RATE_FOR_OFFLINE = 0.05;
export const TICKET_VALID_TIME_FROM_SECOND = 0;
export const TICKET_VALID_TIME_TO_SECOND = 86400;

// Interfaces
export interface CurrentUserPayload {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  // Add other user properties as needed
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
}

export interface BookingFilter {
  status?: string;
  totalPaidFrom?: string;
  totalPaidTo?: string;
  paymentMethodId?: string;
  vat?: string;
  search?: string;
  taId?: string;
  fromDate?: string;
  toDate?: string;
  createdFrom?: string;
  createdTo?: string;
  createdBy?: string;
  saleChannelId?: string;
  saleChannelGroup?: string;
  metadata?: any;
}

export interface VatInfo {
  taxCode?: string;
  receiverEmail?: string;
  legalName?: string;
}

export interface BookingItem {
  productId: string;
  quantity: number;
  price: number;
  // Add other item properties as needed
}

export interface LCBooking {
  _id?: string;
  bookingCode: string;
  receiptNumber?: string;
  status: BookingStatus;
  totalPaid: number;
  items: BookingItem[];
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  paymentMethodId: string;
  bankAccountId?: string;
  saleChannelId?: string;
  posTerminalId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  cancelledBy?: string;
  cancelledAt?: Date;
  checkInDate: Date;
  vatInfo?: VatInfo;
  metadata?: {
    invNo?: string;
    invCode?: string;
  };
  printTimes?: Date[];
  meInvoiceCreatedAt?: number;
  confirmedAt?: number;
  // Add other booking properties as needed
}

export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
}

export class BookingService {
  private dbService: MongoDBService;
  private excelService: ExcelService;
  private mailService: MailService;

  constructor() {
    this.dbService = MongoDBService.getInstance();
    this.excelService = new ExcelService();
    this.mailService = new MailService();
  }

  private normalizePaymentMethods(paymentMethodId: string): string[] {
    // Implement your normalization logic here
    return paymentMethodId.split(',');
  }

  public async getBookingFilter(
    filters: BookingFilter
  ): Promise<Record<string, any>> {
    const {
      status,
      totalPaidFrom,
      totalPaidTo,
      paymentMethodId,
      vat,
      search,
      taId,
      fromDate,
      toDate,
      createdFrom,
      createdTo,
      createdBy,
      saleChannelId,
      saleChannelGroup,
      metadata,
    } = filters;

    const filter: Record<string, any> = {
      deleted: { $ne: true },
    };

    // Handle search
    if (search) {
      const orArr: Record<string, any>[] = [
        { bookingCode: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
      ];

      if (this.dbService.isValidObjectId(search)) {
        orArr.push({ _id: this.dbService.toObjectId(search) });
      }

      if (metadata?.invNo) {
        orArr.push({ 'metadata.invNo': { $regex: search, $options: 'i' } });
      }

      if (metadata?.invCode) {
        orArr.push({ 'metadata.invCode': { $regex: search, $options: 'i' } });
      }

      filter.$or = orArr;
    }

    // Filter status
    if (status) {
      filter.status = { $in: status.split(',') };
    }

    // Filter saleChannelId
    if (saleChannelId) {
      filter.saleChannelId = { $in: saleChannelId.split(',') };
    }

    // Filter totalPaid
    const paidFilter: Record<string, number> = {};
    if (totalPaidFrom && !isNaN(+totalPaidFrom)) {
      paidFilter.$gte = +totalPaidFrom;
    }
    if (totalPaidTo && !isNaN(+totalPaidTo)) {
      paidFilter.$lte = +totalPaidTo;
    }
    if (Object.keys(paidFilter).length) {
      filter.totalPaid = paidFilter;
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

    // Filter paymentMethodId
    if (paymentMethodId) {
      filter.paymentMethodId = {
        $in: this.normalizePaymentMethods(paymentMethodId),
      };
    }

    // Filter saleChannelGroup + createdBy
    const createdBySplit = createdBy?.split(',') ?? [];
    if (saleChannelGroup) {
      const saleChannelGroupArr = saleChannelGroup.split(',');
      const saleChannelDocs = await this.dbService
        .getCollection('lcsalechannels')
        .find({ groupSaleChannel: { $in: saleChannelGroupArr } })
        .toArray();

      const saleChannelIds = saleChannelDocs
        .map((c) => c?._id?.toString())
        .filter(Boolean);

      if (saleChannelIds.length && createdBySplit.length) {
        filter.$or = [
          ...(filter.$or || []),
          { saleChannelId: { $in: saleChannelIds } },
          { createdBy: { $in: createdBySplit } },
        ];
      } else if (saleChannelIds.length) {
        filter.saleChannelId = { $in: saleChannelIds };
      }
    } else if (createdBySplit.length) {
      filter.createdBy = { $in: createdBySplit };
    }

    // Filter VAT
    if (vat) {
      const vats = vat.split(',').length ? vat.split(',') : [vat];
      if (vats.length === 1) {
        if (vats[0] === 'NO_VAT') {
          filter['metadata.invNo'] = { $exists: false };
        }
        if (vats[0] === 'VAT') {
          filter['metadata.invNo'] = { $exists: true };
        }
      }
    }

    // Filter by taId
    if (taId) {
      filter.taId = taId;
    }

    return filter;
  }

  public async getExcelBookings({
    filters,
    currentUser,
    receiverEmail,
  }: {
    filters: Record<string, any>;
    currentUser: CurrentUserPayload;
    receiverEmail?: string;
  }): Promise<string> {
    try {
      await this.dbService.connect();
      console.log('🚀 ~ BookingService ~ receiverEmail:', receiverEmail);
      console.log('🚀 ~ getExcelBookings ~ filters:', filters);

      const normalizedFilters = normalizeDateFilters(filters);
      console.log('🚀 ~ normalizedFilters:', normalizedFilters);

      // 1. Tối ưu: Lấy luôn thông tin cần thiết từ query thay vì lấy tất cả fields
      const projection = {
        bookingCode: 1,
        receiptNumber: 1,
        status: 1,
        totalPaid: 1,
        items: 1,
        customer: 1,
        paymentMethodId: 1,
        bankAccountId: 1,
        saleChannelId: 1,
        posTerminalId: 1,
        createdAt: 1,
        checkInDate: 1,
        vatInfo: 1,
        metadata: 1,
        meInvoiceCreatedAt: 1,
        confirmedAt: 1,
      };

      // 2. Tối ưu: Sử dụng cursor và batch processing cho dữ liệu lớn
      const cursor = this.dbService
        .getCollection('lcbookings')
        .find(normalizedFilters, { projection });

      // 3. Tối ưu: Chuẩn bị trước dữ liệu tham chiếu
      const [paymentMethods, saleChannels, posTerminals] = await Promise.all([
        this.dbService.getCollection('paymentmethods').find().toArray(),
        this.dbService.getCollection('lcsalechannels').find().toArray(),
        this.dbService.getCollection('lcposterminals').find().toArray(),
      ]);

      const paymentMethodMap = new Map(
        paymentMethods.map((pm) => [pm._id.toString(), pm])
      );
      const saleChannelMap = new Map(
        saleChannels.map((sc) => [sc._id.toString(), sc])
      );
      const posTerminalMap = new Map(
        posTerminals.map((pt) => [pt._id.toString(), pt])
      );

      const itemsWithPaymentMethodName = [];
      while (await cursor.hasNext()) {
        const item = await cursor.next();
        if (!item) continue;

        // 4. Tối ưu: Không cần query lại từng bản ghi
        const extendedData = this.getExtendedBookingDataFromMaps(
          item as any,
          paymentMethodMap,
          saleChannelMap,
          posTerminalMap
        );

        itemsWithPaymentMethodName.push({
          ...item,
          ...extendedData,
        });
      }

      console.log(
        '🚀 ~ getExcelBookings ~ items count:',
        itemsWithPaymentMethodName.length
      );

      // 5. Tối ưu: Tạo Excel từ stream nếu dữ liệu rất lớn
      const excelFile: any = await this.excelService.exportReport({
        title: 'Báo cáo danh sách đơn hàng',
        filters: this.mappingFilterKeys(filters),
        data: itemsWithPaymentMethodName,
        headers: this.mappingHeaderKeys(),
        currentUser,
      });

      await this.mailService.sendEmail(
        this.mailService.setExcelAttachmentOption({
          to: receiverEmail ?? currentUser?.email,
          subject: 'Báo cáo đơn hàng Langfarm',
          excelBuffer: excelFile,
          fileName: `${appDayJs().format(
            'YYMMDDHHmm'
          )}-BaoCaoDanhSachDonHang.xlsx`,
          exportedBy: `${currentUser.lastName} ${currentUser.firstName}`,
          exportedAt: appDayJs().format('DD/MM/YYYY HH:mm:ss'),
        })
      );

      await LarkService.sendMessage(
        LarkBotUrls.exportLogBot,
        LarkService.getLogMessage({
          type: 'INBOUND',
          serviceName: 'Xuất excel bookings thành công',
          status: '✅ Thành công',
          time: appDayJs().format('DD/MM/YYYY HH:mm:ss'),
          endpoint: `/api/v1/bookings`,
          action: 'Xuất excel bookings thành công',
          request: {
            method: 'POST',
            headers: {},
            body: {
              filters,
              receiverEmail,
              to: receiverEmail ?? currentUser?.email,
              subject: 'Báo cáo đơn hàng Langfarm',
              fileName: `${appDayJs().format(
                'YYMMDDHHmm'
              )}-BaoCaoDanhSachDonHang.xlsx`,
              exportedBy: `${currentUser.lastName} ${currentUser.firstName}`,
              exportedAt: appDayJs().format('DD/MM/YYYY HH:mm:ss'),
            },
          },
          response: {},
          triggeredBy: 'System',
        })
      );

      return 'Export completed successfully';
    } catch (error) {
      console.error('Error in getExcelBookings:', error);
      await LarkService.sendMessage(
        LarkBotUrls.exportLogBot,
        LarkService.getLogMessage({
          type: 'INBOUND',
          serviceName: 'Xuất excel bookings thất bại',
          status: '❌ Thất bại',
          time: appDayJs().format('DD/MM/YYYY HH:mm:ss'),
          endpoint: `/api/v1/bookings`,
          action: 'Xuất excel bookings thất bại',
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
      throw error;
    } finally {
      await this.dbService.disconnect();
    }
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
      {
        title: 'Ngày đặt',
        key: 'createdAt',
        render: (value: LCBooking) =>
          appDayJs(value?.createdAt).format('DD/MM/YYYY HH:mm'),
      },
      {
        title: 'Ngày đến',
        key: 'checkInDate',
        render: (value: LCBooking) =>
          appDayJs(value?.checkInDate).format('DD/MM/YYYY'),
      },
      {
        title: 'Khách hàng',
        key: 'customer',
        render: (value: LCBooking) => value?.customer?.name ?? '-',
      },
      {
        title: 'Email',
        key: 'email',
        render: (value: LCBooking) => value?.customer?.email ?? '-',
      },
      {
        title: 'Số điện thoại',
        key: 'phone',
        render: (value: LCBooking) => value?.customer?.phone ?? '-',
      },
      {
        title: 'Tổng tiền',
        key: 'totalPaid',
        isFormatCurrency: true,
      },
      {
        title: 'Số vé',
        key: 'totalTickets',
        render: (value: LCBooking) =>
          value?.items?.reduce((total, item) => item.quantity + total, 0),
      },
      {
        title: 'PTTT',
        key: 'paymentMethodName',
      },
      {
        title: 'Trạng thái',
        key: 'status',
        render: (value: LCBooking) => this.mappingStatusLabel(value.status),
      },
      {
        title: 'Xuất VAT',
        key: 'vat',
        render: (value: LCBooking) => (value?.metadata?.invNo ? 'Có' : 'Không'),
      },
      {
        title: 'Mã số thuế',
        key: 'taxCode',
        render: (value: LCBooking) => value?.vatInfo?.taxCode ?? '-',
      },
      {
        title: 'Email nhận VAT',
        key: 'emailVAT',
        render: (value: LCBooking) => value?.vatInfo?.receiverEmail ?? '-',
      },
      {
        title: 'Tên công ty/cá nhân',
        key: 'taxCode',
        render: (value: LCBooking) => value?.vatInfo?.legalName ?? '-',
      },
      {
        title: 'Ngày phát hành hóa đơn',
        key: 'meInvoiceCreatedAt',
        render: (value: LCBooking) =>
          value?.meInvoiceCreatedAt
            ? appDayJs(value?.meInvoiceCreatedAt * 1000).format(
                'DD/MM/YYYY HH:mm'
              )
            : '-',
      },
      {
        title: 'Ký hiệu',
        key: 'symbol',
        render: (value: LCBooking) =>
          value?.metadata?.invNo ? '1C25MLV' : '-',
      },
      {
        title: 'Số hóa đơn',
        key: 'metadata.invNo',
        render: (value: LCBooking) => value?.metadata?.invNo ?? '-',
      },
    ];
  }

  private mappingStatusLabel(status: BookingStatus): string {
    const statusLabels: Record<BookingStatus, string> = {
      [BookingStatus.COMPLETED]: 'Đã hoàn tất',
      [BookingStatus.CANCELLED]: 'Đã hủy',
      [BookingStatus.PROCESSING]: 'Chờ thanh toán',
    };
    return statusLabels[status] || status;
  }

  public getBookingAdvanceFilter(
    advancedFilters: { field: string; operator?: string; value: any }[]
  ) {
    const mongoFilters: Record<string, any> = {};
    const unixFields = ['meInvoiceCreatedAt', 'confirmedAt'];
    const stringDateFields = ['checkInDate'];

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
            mongoFilters['metadata.invNo'] = {
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

  private getExtendedBookingDataFromMaps(
    booking: LCBooking,
    paymentMethodMap: Map<string, any>,
    saleChannelMap: Map<string, any>,
    posTerminalMap: Map<string, any>
  ): any {
    const paymentMethod = booking.paymentMethodId
      ? paymentMethodMap.get(booking.paymentMethodId)
      : null;

    const saleChannel = booking.saleChannelId
      ? saleChannelMap.get(booking.saleChannelId)
      : null;

    const posTerminal = booking.posTerminalId
      ? posTerminalMap.get(booking.posTerminalId)
      : null;

    return {
      paymentMethodName:
        paymentMethod?.name || PaymentMethodLabel[PaymentType.BANK_TRANSFER],
      bankAccount: paymentMethod?.bankAccounts?.find(
        (bankAccount: any) =>
          bankAccount?._id?.toString() === booking?.bankAccountId
      ),
      saleChannelName: saleChannel?.code,
      posTerminalName: posTerminal?.name,
    };
  }
}
