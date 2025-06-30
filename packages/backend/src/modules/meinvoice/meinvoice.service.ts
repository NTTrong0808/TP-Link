import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { API_PATH, TypeConfig } from '@src/enums/meinvoice.enum'
import { appDayJs, formatUnixTs } from '@src/lib/dayjs'
import { UndiciHttpService } from '@src/modules/shared/undici/undici-http.service'
import { validateOrReject } from 'class-validator'
import { isValidObjectId, Model } from 'mongoose'
import { CustomerService } from '../customer/customer.service'
import { Invoice } from '../invoice/schemas/invoice.schema'
import { PaymentMethodService } from '../payment-methods/payment-method.service'
import { ConfigService } from '../shared/config/config.service'
import { MailService } from '../shared/mail/mail.service'
import { CancelInvoiceDto } from './dto/cancel.dto'
import { CreateInvoiceDto } from './dto/create.dto'
import { InvoiceUtils } from './meinvoice.utils'
import {
  MeInvoiceAuthPayload,
  MeInvoiceAuthResponse,
  MeInvoiceCancelInvoiceResponse,
  MeInvoiceCreateInvoiceResponse,
  PublishInvoiceResult,
} from './types'
import { IHaravanInvoices } from './types/haravan.interface'
import { IOrder } from '../order/type'
import { Order } from '../order/schemas/order.schema'
import { LarkService } from '../shared/lark/lark.service'
import { LarkBotUrls } from '../shared/lark/lark.constants'

interface MeInvoiceConfig {
  baseUrl: string
  username: string
  password: string
  othersData?: {
    invSeries?: string
    taxCode?: string
    expiresAt?: number
    accessToken?: string
    appId?: string
  }
}

@Injectable()
export class MeInvoiceService {
  private readonly logger = new Logger(MeInvoiceService.name)
  private authToken: string
  private tokenExpiresAt: number
  private invSeries: string
  private companyTaxCode: string
  private baseUrl: string

  constructor(
    private undiciService: UndiciHttpService,
    private configService: ConfigService,
    private paymentMethodService: PaymentMethodService,
    private sendEmailService: MailService,
    private customerService: CustomerService,
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(Order.name) private orderModel: Model<IOrder>,
    private larkService: LarkService,
  ) {}

  async getConfigMeInvoice(type?: TypeConfig): Promise<MeInvoiceConfig | null> {
    try {
      const configMeInvoice = await this.configService.getConfig(type ?? TypeConfig.ME_INVOICE)
      this.logger.log(configMeInvoice)
      return configMeInvoice as MeInvoiceConfig
    } catch (error) {
      this.logger.debug(error)
      return null
    }
  }

  /**
   * Get config and validate token, refresh if token is expired
   */
  async validateToken() {
    const config = await this.getConfigMeInvoice()
    if (!config) {
      throw new Error('Config not found')
    }

    const { baseUrl, username, password, othersData } = config
    const currentTime = appDayJs().unix()
    this.invSeries = othersData?.invSeries || ''
    this.companyTaxCode = othersData?.taxCode || ''
    this.baseUrl = baseUrl
    if (othersData?.expiresAt && currentTime < othersData.expiresAt) {
      this.authToken = othersData.accessToken || ''
      this.tokenExpiresAt = othersData.expiresAt
      this.logger.debug(
        `Token valid - Set token from config === authToken: ${this.authToken}, expire: ${formatUnixTs(this.tokenExpiresAt)}`,
      )
      return
    }
    return await this.refreshToken(baseUrl, {
      username,
      password,
      appid: othersData?.appId || '',
      taxcode: othersData?.taxCode || '',
    })
  }

  async validateTokenForOtherType(type: TypeConfig) {
    const config = await this.getConfigMeInvoice(type)
    if (!config) {
      throw new Error('Config not found')
    }

    const { baseUrl, username, password, othersData } = config
    const currentTime = appDayJs().unix()
    const invSeries = othersData?.invSeries || ''
    const companyTaxCode = othersData?.taxCode || ''
    let authToken: string = ''
    if (othersData?.expiresAt && currentTime < othersData.expiresAt) {
      authToken = othersData.accessToken || ''
      return { baseUrl, invSeries, companyTaxCode, authToken }
    }
    authToken =
      (await this.refreshTokenForOtherType(
        baseUrl,
        {
          username,
          password,
          appid: othersData?.appId || '',
          taxcode: othersData?.taxCode || '',
        },
        TypeConfig.OLA_ME_INVOICE,
      )) ?? ''
    return { baseUrl, invSeries, companyTaxCode, authToken }
  }

  /**
   * Refreshes the authentication token.
   *
   * @param {string} baseUrl - The base URL for the API.
   * @param {MeInvoiceAuthPayload} payload - The payload containing authentication details.
   * @throws {Error} - Throws an error if the token refresh fails.
   */
  async refreshToken(baseUrl: string, payload: MeInvoiceAuthPayload) {
    try {
      console.log(baseUrl, payload)
      console.log(`${baseUrl}${API_PATH.FETCH_TOKEN}`)

      const result = await this.undiciService.post<MeInvoiceAuthResponse>(`${baseUrl}${API_PATH.FETCH_TOKEN}`, payload)
      console.log('🚀 ~ MeInvoiceService ~ refreshToken ~ result:', result)

      if (!result?.success) {
        throw new Error(`${result?.errorCode}`)
      }
      const newExpiresAt = appDayJs().add(10, 'day').unix()
      await this.configService.updateMetadataConfig(TypeConfig.ME_INVOICE, {
        'othersData.accessToken': result?.data,
        'othersData.expiresAt': newExpiresAt,
      })

      this.authToken = result?.data || ''
      this.tokenExpiresAt = newExpiresAt
      this.logger.debug(`Token refreshed successfully - new expire: ${formatUnixTs(this.tokenExpiresAt)}`)
      return result?.data
    } catch (error) {
      console.log('error ', error)
    }
  }

  async refreshTokenForOtherType(baseUrl: string, payload: MeInvoiceAuthPayload, type: TypeConfig) {
    try {
      console.log(baseUrl, payload)
      console.log(`${baseUrl}${API_PATH.FETCH_TOKEN}`)

      const result = await this.undiciService.post<MeInvoiceAuthResponse>(`${baseUrl}${API_PATH.FETCH_TOKEN}`, payload)
      console.log('🚀 ~ MeInvoiceService ~ refreshToken ~ result:', result)

      if (!result?.success) {
        throw new Error(`${result?.errorCode}`)
      }
      const newExpiresAt = appDayJs().add(10, 'day').unix()
      await this.configService.updateMetadataConfig(type ?? TypeConfig.ME_INVOICE, {
        'othersData.accessToken': result?.data,
        'othersData.expiresAt': newExpiresAt,
      })

      this.authToken = result?.data || ''
      this.tokenExpiresAt = newExpiresAt
      this.logger.debug(`Token refreshed successfully - new expire: ${formatUnixTs(this.tokenExpiresAt)}`)
      return result?.data
    } catch (error) {
      console.log('error ', error)
    }
  }

  /**
   * Mapping booking to invoice dto
   * @returns {CreateInvoiceDto} - The data for the invoice.
   */
  protected mapBookingToInvoiceDto(booking: Record<string, any>): CreateInvoiceDto {
    const invoiceData = InvoiceUtils.mapBookingToInvoiceDto(booking, this.invSeries)
    return {
      // SignType: 2, // Sign with HSM
      SignType: 5, // SignType = 5 là phát hành hóa đơn MTT, không thể kiện cks
      InvoiceData: [invoiceData],
      PublishInvoiceData: null,
    }
  }

  protected mapBookingToInvoiceForHaravanDto(
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
  ): CreateInvoiceDto {
    const invoiceData = InvoiceUtils.mapBookingToInvoiceForHaravanDto(order, invSeries)
    return {
      // SignType: 2, // Sign with HSM
      SignType: 5, // SignType = 5 là phát hành hóa đơn MTT, không thể kiện cks
      InvoiceData: [invoiceData],
      PublishInvoiceData: null,
    }
  }

  /**
   * Issue an invoice to MeInvoice
   * @param {CreateInvoiceDto} createInvoiceDto - The data for the invoice.
   * @returns {Promise<any>} - The response from the API.
   * @throws {Error} - Throws an error if the invoice creation fails.
   */
  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<PublishInvoiceResult | { error: string }> {
    try {
      // const transformed = plainToInstance(CreateInvoiceDto, createInvoiceDto)
      // await validateOrReject(transformed)

      const headers = {
        Authorization: `Bearer ${this.authToken}`,
        CompanyTaxCode: this.companyTaxCode,
        'Content-Type': 'application/json',
      }
      console.log('🚀 ~ MeInvoiceService ~ createInvoice ~ headers:', JSON.stringify(headers))
      console.log(`${this.baseUrl}${API_PATH.CREATE_INVOICE}`)

      this.larkService.sendMessage(
        LarkBotUrls.haravanIssueInvoiceLogBot,
        `[🚀 Start Issue invoice LF for ${createInvoiceDto.InvoiceData?.[0]?.RefID}]: ${JSON.stringify(createInvoiceDto)}`,
      )

      const response = await this.undiciService.post<MeInvoiceCreateInvoiceResponse>(
        `${this.baseUrl}${API_PATH.CREATE_INVOICE}`,
        createInvoiceDto,
        headers,
      )

      console.log('🚀 ~ MeInvoiceService ~ createInvoice ~ response:', JSON.stringify(response, null, 2))

      const parsedResult = JSON.parse(response.publishInvoiceResult || '[]') as PublishInvoiceResult[]
      const publishInvoiceResult = parsedResult[0]
      this.logger.log('Res after create: ', publishInvoiceResult)

      if (!response.success || publishInvoiceResult?.ErrorCode) {
        this.larkService.sendMessage(
          LarkBotUrls.haravanIssueInvoiceLogBot,
          this.larkService.getLogMessage({
            type: 'OUTBOUND',
            serviceName: 'Create LFC Invoice',
            status: '❌ Thất bại',
            time: appDayJs().format('DD/MM/YYYY HH:mm:ss'),
            endpoint: `/api/v1/meInvoice/issue/${createInvoiceDto.bookingId}`,
            action: 'Tạo hóa đơn cho đơn LFC',
            request: {
              method: 'POST',
              headers,
              body: createInvoiceDto,
            },
            response,
            triggeredBy: 'System cron job',
          }),
        )
        return { error: `Invoice creation failed: ${publishInvoiceResult?.ErrorCode}` }
      }

      this.larkService.sendMessage(
        LarkBotUrls.haravanIssueInvoiceLogBot,
        this.larkService.getLogMessage({
          type: 'OUTBOUND',
          serviceName: 'Create LFC Invoice',
          status: '✅ Thành công',
          time: appDayJs().format('DD/MM/YYYY HH:mm:ss'),
          endpoint: `/api/v1/meInvoice/issue/${createInvoiceDto.bookingId}`,
          action: 'Tạo hóa đơn cho đơn LFC',
          request: {
            method: 'POST',
            headers,
            body: createInvoiceDto,
          },
          response,
          triggeredBy: 'System cron job',
        }),
      )
      this.logger.debug('Invoice created successfully')
      return publishInvoiceResult
    } catch (err: unknown) {
      if (Array.isArray(err) && err[0]?.constraints) {
        const validationErrors = err.map((e) => ({
          property: e.property,
          constraints: e.constraints,
        }))
        this.logger.error('Validation failed:', JSON.stringify(validationErrors, null, 2))
        return { error: 'Validation failed. See logs for details.' }
      }

      this.logger.error('Failed to create invoice:', JSON.stringify(err))
      return { error: (err as any)?.message || 'Unknown error occurred' }
    }
  }

  async createInvoiceForOtherType({
    createInvoiceDto,
    baseUrl,
    authToken,
    companyTaxCode,
  }: {
    createInvoiceDto: CreateInvoiceDto
    baseUrl: string
    authToken: string
    companyTaxCode: string
  }): Promise<PublishInvoiceResult | { error: string }> {
    try {
      // const transformed = plainToInstance(CreateInvoiceDto, createInvoiceDto)
      // await validateOrReject(transformed)

      const headers = {
        Authorization: `Bearer ${authToken}`,
        CompanyTaxCode: companyTaxCode,
        'Content-Type': 'application/json',
      }
      console.log('🚀 ~ MeInvoiceService ~ createInvoice ~ headers:', JSON.stringify(headers))
      console.log(`${baseUrl}${API_PATH.CREATE_INVOICE}`)

      this.larkService.sendMessage(
        LarkBotUrls.haravanIssueInvoiceLogBot,
        `[🚀 Start Issue invoice Ola for ${createInvoiceDto.InvoiceData?.[0]?.RefID}]: ${JSON.stringify(createInvoiceDto)}`,
      )

      const response = await this.undiciService.post<MeInvoiceCreateInvoiceResponse>(
        `${baseUrl}${API_PATH.CREATE_INVOICE}`,
        createInvoiceDto,
        headers,
      )

      console.log('🚀 ~ MeInvoiceService ~ createInvoice ~ response:', JSON.stringify(response, null, 2))

      const parsedResult = JSON.parse(response.publishInvoiceResult || '[]') as PublishInvoiceResult[]
      const publishInvoiceResult = parsedResult[0]
      this.logger.log('Res after create: ', publishInvoiceResult)

      if (!response.success || publishInvoiceResult?.ErrorCode) {
        this.larkService.sendMessage(
          LarkBotUrls.haravanIssueInvoiceLogBot,
          this.larkService.getLogMessage({
            type: 'OUTBOUND',
            serviceName: 'Create OLA Invoice',
            status: '❌ Thất bại',
            time: appDayJs().format('DD/MM/YYYY HH:mm:ss'),
            endpoint: `/api/v1/meInvoice/issue/${createInvoiceDto.bookingId}`,
            action: 'Tạo hóa đơn cho đơn OLA',
            request: {
              method: 'POST',
              headers,
              body: createInvoiceDto,
            },
            response,
            triggeredBy: 'System cron job',
          }),
        )
        return { error: `Invoice creation failed: ${publishInvoiceResult?.ErrorCode}` }
      }
      this.larkService.sendMessage(
        LarkBotUrls.haravanIssueInvoiceLogBot,
        this.larkService.getLogMessage({
          type: 'OUTBOUND',
          serviceName: 'Create OLA Invoice',
          status: '✅ Thành công',
          time: appDayJs().format('DD/MM/YYYY HH:mm:ss'),
          endpoint: `/api/v1/meInvoice/issue/${createInvoiceDto.bookingId}`,
          action: 'Tạo hóa đơn cho đơn OLA',
          request: {
            method: 'POST',
            headers,
            body: createInvoiceDto,
          },
          response,
          triggeredBy: 'System cron job',
        }),
      )
      this.logger.debug('Invoice created successfully')
      return publishInvoiceResult
    } catch (err: unknown) {
      if (Array.isArray(err) && err[0]?.constraints) {
        const validationErrors = err.map((e) => ({
          property: e.property,
          constraints: e.constraints,
        }))
        this.logger.error('Validation failed:', JSON.stringify(validationErrors, null, 2))
        return { error: 'Validation failed. See logs for details.' }
      }

      this.logger.error('Failed to create invoice:', JSON.stringify(err))
      return { error: (err as any)?.message || 'Unknown error occurred' }
    }
  }

  /**
   * Cancel an invoice and update state on DB
   * @param {string} bookingCode - Booking code.
   * @param {CancelInvoiceDto} payload - The data for the invoice.
   * @returns {Promise<any>} - The response from the API.
   * @throws {Error} - Throws an error if the invoice creation fails.
   */
  async cancelInvoice(bookingCode: string, payload: CancelInvoiceDto): Promise<any> {
    try {
      await this.validateToken()
      await validateOrReject(payload)
      const headers = {
        Authorization: `Bearer ${this.authToken}`,
        CompanyTaxCode: this.companyTaxCode,
        'Content-Type': 'application/json',
      }
      const response = await this.undiciService.post<MeInvoiceCancelInvoiceResponse>(
        `${this.baseUrl}${API_PATH.CANCEL_INVOICE}`,
        payload,
        headers,
      )
      if (!response.success) {
        throw new Error(`Invoice cancellation failed ${response.errorCode}`)
      }

      // Update to booking
      // await this.bookingService.updateBooking(bookingCode, {
      //   "metadata.cancelled": appDayJs().unix(),
      //   status:
      // })
      return
    } catch (error) {
      this.logger.error('Failed to cancel invoice:', error)
      throw error
    }
  }

  async getInvoicePdfForOtherType(transId: string, type?: TypeConfig) {
    const config = await this.validateTokenForOtherType(type ?? TypeConfig.ME_INVOICE)

    const headers = {
      Authorization: `Bearer ${config.authToken}`,
      CompanyTaxCode: config.companyTaxCode,
      'Content-Type': 'application/json',
    }

    const response = await this.undiciService.post<{ data: string; [key: string]: any }>(
      `${config.baseUrl}/invoice/download?invoiceWithCode=true&invoiceCalcu=true&downloadDataType=pdf`,
      [transId],
      headers,
    )

    const parsedResponse = JSON.parse(response.data) as Array<{ Data: string }>
    const base64 = parsedResponse?.[0]?.Data
    return base64
  }

  async getInvoicePdf(transId: string) {
    await this.validateToken()

    const headers = {
      Authorization: `Bearer ${this.authToken}`,
      CompanyTaxCode: this.companyTaxCode,
      'Content-Type': 'application/json',
    }

    const response = await this.undiciService.post<{ data: string; [key: string]: any }>(
      `${this.baseUrl}/invoice/download?invoiceWithCode=true&invoiceCalcu=true&downloadDataType=pdf`,
      [transId],
      headers,
    )

    const parsedResponse = JSON.parse(response.data) as Array<{ Data: string }>
    const base64 = parsedResponse?.[0]?.Data
    return base64
  }

  /**
   * Test using send email sparkpost after get base64
   */
  async sendEmail(transId = 'Q5HRCKPMED'): Promise<any> {
    try {
      const base64 = await this.getInvoicePdf(transId)
      const content = this.sendEmailService.setSimpleOption({
        from: 'tuantran@whammytech.com',
        to: 'duongdang@whammytech.com',
        subject: 'Test send with pdf',
        html: '<p>Dau co loi lam.</p>',
        attachments: [
          {
            name: 'document.pdf',
            type: 'application/pdf',
            data: base64,
          },
        ],
      })
      await this.sendEmailService.sendEmail(content)
      this.logger.debug('Success to send email ')
      return
    } catch (error) {
      this.logger.error('Failed to send email:', error)
      throw error
    }
  }

  addPrefixSaleChannel(orderCode: string, source: string) {
    if (source === 'shopee') {
      return `SPE_${orderCode}`
    } else if (source === 'tiktokshop') {
      return `TTS_${orderCode}`
    } else if (source === 'lazada') {
      return `LZD_${orderCode}`
    }
    return orderCode
  }

  async handleIssueInvoiceForHaravan(order: IHaravanInvoices) {
    try {
      const existedOrder = await this.orderModel.findOne({
        orderNumber: order?.order_number,
      })

      if (!existedOrder) {
        return { message: `Handle faild, not existed order ${order?.order_number}`, data: order }
      }

      if (existedOrder?.invoiceIssuedData?.invNo) {
        return { message: `Handle faild, the order ${order?.order_number} is issued invoice`, data: order }
      }
      const config = await this.validateTokenForOtherType(TypeConfig.OLA_ME_INVOICE)

      const createInvoiceDto = this.mapBookingToInvoiceForHaravanDto(
        {
          ...order,
          paymentMethodName: 'Chuyển khoản',
          ...(existedOrder && existedOrder?.vatData ? { vatData: existedOrder.vatData } : {}),
        },
        config?.invSeries,
      )
      console.log(
        '🚀 ~ MeInvoiceService ~ handleFromBookingQueue ~ createInvoiceDto',
        JSON.stringify(createInvoiceDto, null, 2),
      )
      const response = await this.createInvoiceForOtherType({
        createInvoiceDto: { ...createInvoiceDto, bookingId: order.order_number },
        baseUrl: config.baseUrl,
        authToken: config.authToken,
        companyTaxCode: config.companyTaxCode,
      })
      console.log('🚀 ~ MeInvoiceService ~ handleFromBookingQueue ~ response:', JSON.stringify(response, null, 2))

      // Update to Invoice
      const invoice = await this.invoiceModel.findOneAndUpdate(
        {
          code: this.addPrefixSaleChannel(order?.order_number, order?.source),
        },
        {
          ...('error' in response
            ? {
                'meInvoiceData.error': response.error,
              }
            : {
                'meInvoiceData.transId': response.TransactionID,
                'meInvoiceData.invCode': response.InvCode,
                'meInvoiceData.invNo': response.InvNo,
              }),
          meInvoiceCreatedAt: appDayJs().unix(),
          meInvoiceRefId: createInvoiceDto.InvoiceData?.[0]?.RefID,
          haravanData: order,
        },
        {
          new: true,
        },
      )
      const invoiceIssuedData = {
        invoiceCreatedAt: appDayJs().toISOString(),
        invoiceRefId: createInvoiceDto.InvoiceData?.[0]?.RefID,
        invoiceData: createInvoiceDto,
        ...('error' in response
          ? {
              'invoiceIssuedData.error': response.error,
            }
          : {
              'invoiceIssuedData.transId': response.TransactionID,
              'invoiceIssuedData.invCode': response.InvCode,
              'invoiceIssuedData.invNo': response.InvNo,
              'invoiceIssuedData.invSymbold': config.invSeries,
            }),
      }
      const updated = await this.orderModel.findOneAndUpdate(
        {
          orderNumber: order.order_number,
        },
        invoiceIssuedData,
        { new: true },
      )

      this.larkService.sendMessage(
        LarkBotUrls.haravanIssueInvoiceLogBot,
        this.larkService.getLogMessage({
          type: 'INBOUND',
          serviceName: `Update OLA Invoice ${order.order_number}`,
          status: '✅ Thành công',
          time: appDayJs().format('DD/MM/YYYY HH:mm:ss'),
          endpoint: `/api/v1/meInvoice/issue/${order.order_number}`,
          action: 'Cập nhật hóa đơn cho OLA',
          response: {
            body: updated,
          },
          triggeredBy: 'System cron job',
        }),
      )
      return { message: 'Handle successfully', data: invoice }
    } catch (error) {
      this.logger.debug('handleIssueInvoiceForHaravan', error)
      return null
    }
  }
}
