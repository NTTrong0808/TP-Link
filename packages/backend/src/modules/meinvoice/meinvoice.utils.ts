import { DEFAULT_CUSTOMER_NAME } from '@src/constants/booking.constant'
import { v4 as uuidv4 } from 'uuid'
import { ME_INVOICE_ENUM } from '../../enums/meinvoice.enum'
import { appDayJs } from '../../lib/dayjs'
import { readMoney } from '../../lib/helper/read-money'
import { InvoiceDataDto } from './dto/create.dto'
import { IHaravanInvoices } from './types/haravan.interface'

export class InvoiceUtils {
  static INV_NAME = 'Hóa đơn giá trị gia tăng'
  static calculateAmountOC(price: number, quantity: number): number {
    return price * quantity
  }

  static calculateUnitPriceBeforeVAT({
    listedPrice,
    quantity,
    sellerSupport,
    discount,
  }: {
    listedPrice: number
    quantity: number
    sellerSupport: number
    discount: number
  }) {
    return (listedPrice * quantity - sellerSupport - discount) / quantity
  }

  static calculateSellerSupport({
    originalPrice,
    afterPrice,
    quantity,
  }: {
    originalPrice: number
    afterPrice: number
    quantity: number
  }) {
    return (originalPrice - afterPrice) * quantity
  }

  static calculateDiscount({
    totalDiscount,
    totalPaidBeforeDiscount,
    itemPaidBeforeDiscount,
  }: {
    totalDiscount: number
    totalPaidBeforeDiscount: number
    itemPaidBeforeDiscount: number
  }) {
    return Math.round((totalDiscount * itemPaidBeforeDiscount) / totalPaidBeforeDiscount)
  }

  static calculateDiscountAmountOC(amountOC: number, discountRate: number): number {
    return (discountRate * amountOC) / 100
  }

  static calculateServiceAmountOC(amountOC: number, discountAmountOC: number, serviceFeeRate: number): number {
    return ((amountOC - discountAmountOC) * serviceFeeRate) / 100
  }

  static calculateExciseTaxAmountOC(
    amountOC: number,
    discountAmountOC: number,
    serviceAmountOC: number,
    exciseTaxRate: number,
  ): number {
    return ((amountOC - discountAmountOC + serviceAmountOC) * exciseTaxRate) / 100
  }

  static calculateAmountWithoutVATOC(
    amountOC: number,
    discountAmountOC: number,
    serviceAmountOC: number,
    exciseTaxAmountOC: number,
  ): number {
    return amountOC - discountAmountOC + serviceAmountOC + exciseTaxAmountOC
  }

  static calculateVATAmountOC(amountWithoutVATOC: number, vatRate: number): number {
    return amountWithoutVATOC * vatRate
  }

  static calculateTotalAmountOC(totalAmountWithoutVATOC: number, totalVATAmountOC: number): number {
    return totalAmountWithoutVATOC + totalVATAmountOC
  }

  static mapBookingToInvoiceDto(booking: Record<string, any>, invSeries: string): InvoiceDataDto {
    const { invoiceDetails, totals } = booking.items.reduce(
      (acc, item, index) => {
        const vatRate = ME_INVOICE_ENUM.VAT_RATE
        const priceBeforeVAT = Math.round(item.price / (1 + vatRate))
        const amountOC = InvoiceUtils.calculateAmountOC(priceBeforeVAT, item.quantity)
        const discountRate = 0
        const discountAmountOC = Math.round(InvoiceUtils.calculateDiscountAmountOC(amountOC, discountRate))
        const serviceFeeRate = 0
        const serviceAmountOC = InvoiceUtils.calculateServiceAmountOC(amountOC, discountAmountOC, serviceFeeRate)
        const exciseTaxRate = 0
        const exciseTaxAmountOC = Math.round(
          InvoiceUtils.calculateExciseTaxAmountOC(amountOC, discountAmountOC, serviceAmountOC, exciseTaxRate),
        )
        const amountWithoutVATOC = InvoiceUtils.calculateAmountWithoutVATOC(
          amountOC,
          discountAmountOC,
          serviceAmountOC,
          exciseTaxAmountOC,
        )
        const vatAmountOC = item.price * item.quantity - amountOC
        // const vatAmountOC = Math.round(InvoiceUtils.calculateVATAmountOC(amountWithoutVATOC, vatRate))

        acc.invoiceDetails.push({
          ItemType: 1,
          LineNumber: index + 1,
          SortOrder: index + 1,
          ItemCode: item?.serviceCode ?? item?.priceConfigId ?? item.serviceId,
          ItemName: item.title,
          UnitName: ME_INVOICE_ENUM.UNIT_NAME,
          Quantity: item.quantity,
          UnitPrice: priceBeforeVAT,
          AmountOC: amountOC,
          Amount: amountOC * ME_INVOICE_ENUM.EXCHANGE_RATE,
          DiscountRate: discountRate,
          DiscountAmountOC: discountAmountOC,
          DiscountAmount: discountAmountOC * ME_INVOICE_ENUM.EXCHANGE_RATE,
          AmountWithoutVATOC: amountWithoutVATOC,
          AmountWithoutVAT: amountWithoutVATOC * ME_INVOICE_ENUM.EXCHANGE_RATE,
          VATRateName: ME_INVOICE_ENUM.VAT_RATE_NAME,
          VATAmountOC: vatAmountOC,
          VATAmount: vatAmountOC * ME_INVOICE_ENUM.EXCHANGE_RATE,
        })

        acc.totals.totalSaleAmountOC += amountOC
        acc.totals.totalDiscountAmountOC += discountAmountOC
        acc.totals.totalVATAmountOC += vatAmountOC
        acc.totals.totalAmountWithoutVATOC += amountWithoutVATOC

        return acc
      },
      {
        invoiceDetails: [],
        totals: {
          totalSaleAmountOC: 0,
          totalDiscountAmountOC: 0,
          totalVATAmountOC: 0,
          totalAmountWithoutVATOC: 0,
        },
      },
    )

    const totalAmountOC = InvoiceUtils.calculateTotalAmountOC(totals.totalAmountWithoutVATOC, totals.totalVATAmountOC)

    return {
      RefID: booking?.meInvoiceRefId ?? booking?.bookingCode,
      InvSeries: invSeries,
      InvTemplateNo: invSeries?.[0],
      InvDate: appDayJs().format('YYYY-MM-DD'), // Current date in YYYY-MM-DD format
      InvoiceName: InvoiceUtils.INV_NAME,
      CurrencyCode: 'VND',
      ExchangeRate: ME_INVOICE_ENUM.EXCHANGE_RATE,
      ...(booking?.vatInfo?.receiverEmail
        ? {
            IsSendEmail: true,
            ReceiverEmail: booking?.vatInfo?.receiverEmail,
            ReceiverName: booking?.vatInfo?.legalName,
            BuyerTaxCode: booking?.vatInfo?.taxCode,
            BuyerLegalName: booking?.vatInfo?.legalName || '', // Tên đơn vị (công ty)
            BuyerAddress: booking?.vatInfo?.address || '', // Địa chỉ của người mua
          }
        : {
            BuyerFullName: DEFAULT_CUSTOMER_NAME,
            BuyerLegalName: DEFAULT_CUSTOMER_NAME,
          }),
      ...(booking?.taInfo?.name
        ? {
            // BuyerCode: booking?.customer?.code || "", // Mã của người mua
            BuyerPhoneNumber: booking?.taInfo?.phone || '',
            BuyerEmail: booking?.taInfo?.email || '',
            // BuyerFullName: booking?.taInfo?.name || '',
            // BuyerBankAccount: "",
            // BuyerBankName: "",
          }
        : {}),
      PaymentMethodName: booking?.paymentMethodName,
      TotalSaleAmountOC: Math.round(totals.totalSaleAmountOC),
      TotalSaleAmount: Math.round(totals.totalSaleAmountOC * ME_INVOICE_ENUM.EXCHANGE_RATE),
      TotalAmountWithoutVATOC: Math.round(totals.totalAmountWithoutVATOC),
      TotalAmountWithoutVAT: Math.round(totals.totalAmountWithoutVATOC * ME_INVOICE_ENUM.EXCHANGE_RATE),
      TotalDiscountAmountOC: Math.round(totals.totalDiscountAmountOC),
      TotalDiscountAmount: Math.round(totals.totalDiscountAmountOC * ME_INVOICE_ENUM.EXCHANGE_RATE),
      TotalVATAmountOC: Math.round(totals.totalVATAmountOC),
      TotalVATAmount: Math.round(totals.totalVATAmountOC * ME_INVOICE_ENUM.EXCHANGE_RATE),
      TotalAmountOC: Math.round(totalAmountOC),
      TotalAmount: Math.round(totalAmountOC * ME_INVOICE_ENUM.EXCHANGE_RATE),
      IsTaxReduction43: true,
      TotalAmountInWords: readMoney(Math.round(totalAmountOC * ME_INVOICE_ENUM.EXCHANGE_RATE)),
      OriginalInvoiceDetail: invoiceDetails,
      TaxRateInfo: [
        {
          VATRateName: ME_INVOICE_ENUM.VAT_RATE_NAME,
          AmountWithoutVATOC: Math.round(totals.totalAmountWithoutVATOC),
          VATAmountOC: Math.round(totals.totalVATAmountOC),
        },
      ],
      OptionUserDefined: {
        MainCurrency: ME_INVOICE_ENUM.MAIN_CURRENCY,
        AmountDecimalDigits: '0',
        AmountOCDecimalDigits: '0',
        UnitPriceOCDecimalDigits: '0',
        UnitPriceDecimalDigits: '0',
        QuantityDecimalDigits: '0',
        CoefficientDecimalDigits: '0',
        ExchangRateDecimalDigits: '0',
      },
    }
  }

  static mapBookingToInvoiceForHaravanDto(
    order: IHaravanInvoices & {
      paymentMethodName: string
      vatData?: {
        address?: string
        legalName?: string
        receiverEmail?: string
        taxCode?: string
        note?: string
      }
    },
    invSeries: string,
  ): InvoiceDataDto {
    console.log('🚀 ~ InvoiceUtils ~ order:', order)
    const { invoiceDetails, totals, taxRateMap } = order.line_items.reduce(
      (
        acc: {
          invoiceDetails: any[]
          totals: {
            totalSaleAmountOC: number
            totalDiscountAmountOC: number
            totalVATAmountOC: number
            totalAmountWithoutVATOC: number
          }
          taxRateMap: Record<
            string,
            {
              AmountWithoutVATOC: number
              VATAmountOC: number
            }
          >
        },
        item,
        index,
      ) => {
        const vatRate = item.vatRate ?? ME_INVOICE_ENUM.VAT_RATE
        const vatRateName = `${vatRate * 100}%`
        const totalPaidBeforeDiscount = order?.line_items?.reduce(
          (total, item) => total + item.quantity * item.price_original,
          0,
        )

        const itemDiscount = InvoiceUtils.calculateDiscount({
          totalDiscount: order?.total_discounts ?? 0,
          totalPaidBeforeDiscount,
          itemPaidBeforeDiscount: item.price_original * item.quantity,
        })

        const unitPriceBeforeVAT = InvoiceUtils.calculateUnitPriceBeforeVAT({
          listedPrice: item.price_original,
          quantity: item.quantity,
          sellerSupport: InvoiceUtils.calculateSellerSupport({
            originalPrice: item.price_original,
            afterPrice: item.price,
            quantity: item.quantity,
          }),
          discount: itemDiscount,
        })

        const priceBeforeVAT = Math.round(unitPriceBeforeVAT / (1 + vatRate))
        const amountOC = InvoiceUtils.calculateAmountOC(priceBeforeVAT, item.quantity)
        const discountRate = 0
        const discountAmountOC = Math.round(InvoiceUtils.calculateDiscountAmountOC(amountOC, discountRate))
        const serviceFeeRate = 0
        const serviceAmountOC = InvoiceUtils.calculateServiceAmountOC(amountOC, discountAmountOC, serviceFeeRate)
        const exciseTaxRate = 0
        const exciseTaxAmountOC = Math.round(
          InvoiceUtils.calculateExciseTaxAmountOC(amountOC, discountAmountOC, serviceAmountOC, exciseTaxRate),
        )
        const amountWithoutVATOC = InvoiceUtils.calculateAmountWithoutVATOC(
          amountOC,
          discountAmountOC,
          serviceAmountOC,
          exciseTaxAmountOC,
        )
        const vatAmountOC = unitPriceBeforeVAT * item.quantity - amountOC

        acc.invoiceDetails.push({
          ItemType: 1,
          LineNumber: index + 1,
          SortOrder: index + 1,
          ItemCode: item?.serviceCode,
          ItemName: item.dwTitle,
          UnitName: item?.unitName ?? ME_INVOICE_ENUM.UNIT_NAME,
          Quantity: item.quantity,
          UnitPrice: priceBeforeVAT,
          AmountOC: amountOC,
          Amount: amountOC * ME_INVOICE_ENUM.EXCHANGE_RATE,
          DiscountRate: discountRate,
          DiscountAmountOC: discountAmountOC,
          DiscountAmount: discountAmountOC * ME_INVOICE_ENUM.EXCHANGE_RATE,
          AmountWithoutVATOC: amountWithoutVATOC,
          AmountWithoutVAT: amountWithoutVATOC * ME_INVOICE_ENUM.EXCHANGE_RATE,
          VATRateName: vatRateName,
          VATAmountOC: vatAmountOC,
          VATAmount: vatAmountOC * ME_INVOICE_ENUM.EXCHANGE_RATE,
        })

        acc.totals.totalSaleAmountOC += amountOC
        acc.totals.totalDiscountAmountOC += discountAmountOC
        acc.totals.totalVATAmountOC += vatAmountOC
        acc.totals.totalAmountWithoutVATOC += amountWithoutVATOC

        // Group by VAT rate
        if (!acc.taxRateMap[vatRateName]) {
          acc.taxRateMap[vatRateName] = {
            AmountWithoutVATOC: 0,
            VATAmountOC: 0,
          }
        }
        acc.taxRateMap[vatRateName].AmountWithoutVATOC += amountWithoutVATOC
        acc.taxRateMap[vatRateName].VATAmountOC += vatAmountOC

        return acc
      },
      {
        invoiceDetails: [],
        totals: {
          totalSaleAmountOC: 0,
          totalDiscountAmountOC: 0,
          totalVATAmountOC: 0,
          totalAmountWithoutVATOC: 0,
        },
        taxRateMap: {},
      },
    )

    const totalAmountOC = InvoiceUtils.calculateTotalAmountOC(totals.totalAmountWithoutVATOC, totals.totalVATAmountOC)

    return {
      RefID: uuidv4(),
      InvSeries: invSeries,
      InvTemplateNo: invSeries?.[0],
      InvDate: appDayJs().format('YYYY-MM-DD'), // Current date in YYYY-MM-DD format
      InvoiceName: InvoiceUtils.INV_NAME,
      CurrencyCode: 'VND',
      ExchangeRate: ME_INVOICE_ENUM.EXCHANGE_RATE,
      ...(order.vatData
        ? {
            IsSendEmail: true,
            ReceiverEmail: order?.vatData?.receiverEmail,
            ReceiverName: order?.vatData?.legalName,
            BuyerTaxCode: order?.vatData?.taxCode,
            BuyerLegalName: order?.vatData?.legalName || '', // Tên đơn vị (công ty)
            BuyerAddress: order?.vatData?.address || '', // Địa chỉ của người mua
          }
        : {
            BuyerFullName: '',
            BuyerLegalName: '',
          }),
      PaymentMethodName: order?.paymentMethodName,
      TotalSaleAmountOC: Math.round(totals.totalSaleAmountOC),
      TotalSaleAmount: Math.round(totals.totalSaleAmountOC * ME_INVOICE_ENUM.EXCHANGE_RATE),
      TotalAmountWithoutVATOC: Math.round(totals.totalAmountWithoutVATOC),
      TotalAmountWithoutVAT: Math.round(totals.totalAmountWithoutVATOC * ME_INVOICE_ENUM.EXCHANGE_RATE),
      TotalDiscountAmountOC: Math.round(totals.totalDiscountAmountOC),
      TotalDiscountAmount: Math.round(totals.totalDiscountAmountOC * ME_INVOICE_ENUM.EXCHANGE_RATE),
      TotalVATAmountOC: Math.round(totals.totalVATAmountOC),
      TotalVATAmount: Math.round(totals.totalVATAmountOC * ME_INVOICE_ENUM.EXCHANGE_RATE),
      TotalAmountOC: Math.round(totalAmountOC),
      TotalAmount: Math.round(totalAmountOC * ME_INVOICE_ENUM.EXCHANGE_RATE),
      IsTaxReduction43: true,
      TotalAmountInWords: readMoney(Math.round(totalAmountOC * ME_INVOICE_ENUM.EXCHANGE_RATE)),
      OriginalInvoiceDetail: invoiceDetails,
      TaxRateInfo: Object.entries(taxRateMap).map(([VATRateName, data]) => ({
        VATRateName,
        AmountWithoutVATOC: Math.round(data.AmountWithoutVATOC),
        VATAmountOC: Math.round(data.VATAmountOC),
      })),
      OptionUserDefined: {
        MainCurrency: ME_INVOICE_ENUM.MAIN_CURRENCY,
        AmountDecimalDigits: '0',
        AmountOCDecimalDigits: '0',
        UnitPriceOCDecimalDigits: '0',
        UnitPriceDecimalDigits: '0',
        QuantityDecimalDigits: '0',
        CoefficientDecimalDigits: '0',
        ExchangRateDecimalDigits: '0',
      },
    }
  }
}
