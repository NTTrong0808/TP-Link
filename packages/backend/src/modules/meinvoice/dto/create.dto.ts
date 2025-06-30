import { IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

/**
 * Dựa trên file https://docs.google.com/spreadsheets/d/1YXV8Mbq0BT855nuctssEx3w1wXOdmEIzZvbADXVFJ1g/edit?gid=566134945#gid=566134945
 */
export class InvoiceDetailDto {
  /**
   * Loại hàng hóa
    1: Hàng hóa thường
    2: Khuyến mại
    3: Chiết khấu
    4: Ghi chú/diễn giải
   */
  @IsNumber() ItemType: number
  // 2 field này dùng index
  @IsNumber() LineNumber: number
  @IsNumber() SortOrder: number

  // Mã hàng hóa
  @IsString() ItemCode: string
  // Tên hàng hóa
  @IsString() ItemName: string
  // Đơn vị tính
  @IsString() UnitName: string

  @IsNumber() Quantity: number
  @IsNumber() UnitPrice: number

  // Thành tiền trước thuế, trước chiết khấu - nguyên tệ (Quantity*UnitPrice)
  @IsNumber() AmountOC: number

  // Thành tiền trước thuế, trước chiết khấu - quy đổi
  @IsNumber() Amount: number

  @IsNumber() DiscountRate: number
  @IsNumber() DiscountAmountOC: number
  @IsNumber() DiscountAmount: number

  // Thành tiền sau chiết khấu - nguyên tệ (AmountOC - DiscountAmountOC)
  @IsNumber() AmountWithoutVATOC: number
  // Thành tiền sau chiết khấu - quy đổi
  @IsNumber() AmountWithoutVAT: number

  /**
   * Loại thuế suất:
    KCT:  chịu thuế
    KKKNT:  kê khai nộp thuế
    0%: thuế suất 0%
    5%: thuế suất 5%
    8%: thuế suất 8%
    10%: thuế suất 10%
    KHAC:x%: loại thuế suất khác (Ví dụ: KHAC:3.5%)
   */
  @IsString() VATRateName: string
  // Tiền thuế - nguyên tệ (AmountWithoutVATOC*VATRate/100)
  @IsNumber() VATAmountOC: number
  // Tiền thuế - quy đổi
  @IsNumber() VATAmount: number
}

class TaxRateInfoDto {
  @IsString() VATRateName: string
  // Tổng tiền trước thuế (Sum(AmountWithoutVATOC))
  @IsNumber() AmountWithoutVATOC: number
  // Tổng tiền thuế (Sum(VATAmountOC))"
  @IsNumber() VATAmountOC: number
}

class OptionUserDefinedDto {
  // Lấy theo thông tin CurrencyCode: VND
  @IsString() MainCurrency: string
  // Số chữ số thập phân của số lượng: 2
  @IsString() QuantityDecimalDigits: string
  // Số chữ số thập phân của các loại tiền sau tính toán -  quy đổi: 2
  @IsString() AmountDecimalDigits: string
  // Số chữ số thập phân của các loại dữ liệu tiền -  nguyên tệ: 2
  @IsString() AmountOCDecimalDigits: string
  // Số chữ số thập phân của đơn giá: 0
  @IsString() UnitPriceOCDecimalDigits: string
  @IsString() UnitPriceDecimalDigits: string
  // Số chữ số thập phân của loại phần trăm: 2
  @IsString() CoefficientDecimalDigits: string
  // Số chữ số thập phân của tỷ giá: 0
  @IsString() ExchangRateDecimalDigits: string
}

export class InvoiceDataDto {
  @IsString() RefID: string
  @IsString() InvSeries: string
  @IsString() InvTemplateNo: string
  @IsDateString() InvDate: string
  @IsString() InvoiceName: string
  @IsString() CurrencyCode: string
  @IsString() PaymentMethodName: string
  @IsNumber() ExchangeRate: number
  // Thông tin xuất hd VAT
  @IsOptional() @IsString() BuyerLegalName?: string
  @IsOptional() @IsString() BuyerTaxCode?: string
  @IsOptional() @IsString() BuyerAddress?: string
  @IsOptional() @IsString() BuyerCode?: string
  @IsOptional() @IsString() BuyerPhoneNumber?: string
  @IsOptional() @IsString() BuyerEmail?: string
  @IsOptional() @IsString() BuyerFullName?: string
  @IsOptional() @IsString() BuyerBankAccount?: string
  @IsOptional() @IsString() BuyerBankName?: string
  @IsNumber() TotalSaleAmountOC: number
  @IsNumber() TotalSaleAmount: number
  @IsNumber() TotalAmountWithoutVATOC: number
  @IsNumber() TotalAmountWithoutVAT: number
  @IsNumber() TotalDiscountAmountOC: number
  @IsNumber() TotalDiscountAmount: number
  @IsNumber() TotalVATAmountOC: number
  @IsNumber() TotalVATAmount: number
  @IsNumber() TotalAmountOC: number
  @IsNumber() TotalAmount: number
  @IsBoolean() IsTaxReduction43: boolean
  @IsOptional() @IsBoolean() IsSendEmail?: boolean
  @IsOptional() @IsString() ReceiverName?: string
  @IsOptional() @IsString() ReceiverEmail?: string // Địa chỉ nhận email
  @IsString() TotalAmountInWords: string

  @ValidateNested({ each: true })
  @Type(() => InvoiceDetailDto)
  @IsArray()
  OriginalInvoiceDetail: InvoiceDetailDto[]

  @ValidateNested({ each: true })
  @Type(() => TaxRateInfoDto)
  @IsArray()
  TaxRateInfo: TaxRateInfoDto[]

  @ValidateNested()
  @Type(() => OptionUserDefinedDto)
  OptionUserDefined: OptionUserDefinedDto

  @IsOptional() @IsString() CustomField1?: string
  @IsOptional() @IsString() CustomField2?: string
  @IsOptional() @IsString() CustomField3?: string
  @IsOptional() @IsString() CustomField4?: string
  @IsOptional() @IsString() CustomField5?: string
  @IsOptional() @IsString() CustomField6?: string
  @IsOptional() @IsString() CustomField7?: string
  @IsOptional() @IsString() CustomField8?: string
  @IsOptional() @IsString() CustomField9?: string
  @IsOptional() @IsString() CustomField10?: string
}

export class CreateInvoiceDto {
  @IsNumber() SignType: number

  @ValidateNested({ each: true })
  @Type(() => InvoiceDataDto)
  @IsArray()
  InvoiceData: InvoiceDataDto[]

  @IsOptional()
  PublishInvoiceData?: any

  @IsOptional()
  @IsString()
  bookingId?: string
}
