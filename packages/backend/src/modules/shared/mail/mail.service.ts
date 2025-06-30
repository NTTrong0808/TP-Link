import { Injectable, Logger } from '@nestjs/common'
import { TICKET_VALID_TIME_FROM_SECOND, TICKET_VALID_TIME_TO_SECOND } from '@src/constants/ticket'
import { appDayJs } from '@src/lib/dayjs'
import * as fs from 'fs'
import * as path from 'path'
import SparkPost, { Attachment } from 'sparkpost'

type ILCMailContent = {
  from?: string
  subject: string
  html: string
  to: string
  attachments?: Attachment[]
}

type ILCRestPasswordMailContent = {
  resetPasswordUrl: string

  openingTime?: string
  closingTime?: string
  lfHotline?: string
  lfEmail?: string
  lfAddress?: string
} & Partial<ILCMailContent>

type ILCTicketMailContent = {
  customerName?: string
  ticketDate: string
  bookingCode: string
  expirationDate: string
  ticketUrl: string
  openingTime?: string
  closingTime?: string
  lfHotline?: string
  lfEmail?: string
  lfAddress?: string
} & Partial<ILCMailContent>

@Injectable()
export class MailService {
  private _sparkPost: SparkPost
  private readonly logger = new Logger(MailService.name)
  private fromEmail: { email: string; name: string }

  constructor() {
    if (!process.env.SPARK_POST_KEY) {
      throw new Error('Missing SPARK_POST_KEY environment variable')
    }
    this._sparkPost = new SparkPost(process.env.SPARK_POST_KEY)
    this.fromEmail = {
      name: process.env.FROM_EMAIL_NAME || 'Langfarm Center',
      email: process.env.FROM_EMAIL || 'support@langfarmcenter.com',
    }
  }

  async sendEmail(options: SparkPost.CreateTransmission): Promise<boolean> {
    try {
      const data = await this._sparkPost.transmissions.send(options)
      this.logger.log('Woohoo! You just sent your first mailing!, data: ', JSON.stringify(data))
      return true
    } catch (err: unknown) {
      const error = err as { errors?: unknown }
      this.logger.error('Whoops! Something went wrong: ', error?.errors)
      return false
    }
  }

  setSimpleOption(payload: ILCMailContent): SparkPost.CreateTransmission {
    const { from = this.fromEmail, subject, html, to: address, attachments } = payload
    return {
      content: {
        from,
        subject,
        html,
        ...(attachments ? { attachments } : {}),
      },
      recipients: [{ address }],
    }
  }

  setTicketDetailOption(payload: ILCTicketMailContent): SparkPost.CreateTransmission {
    const {
      from = this.fromEmail,
      subject = 'Thông tin vé - Langfarm Center',
      to,
      attachments,
      // data
      customerName = 'Quý khách hàng',
      ticketDate,
      bookingCode,
      expirationDate,
      ticketUrl,
      openingTime = appDayJs().startOf('D').add(TICKET_VALID_TIME_FROM_SECOND, 's').format('HH:mm'),
      closingTime = appDayJs().startOf('D').add(TICKET_VALID_TIME_TO_SECOND, 's').format('HH:mm'),
      lfHotline = '0931904904',
      lfEmail = 'center@langfarm.com',
      lfAddress = 'Số 1B đường Hoàng Văn Thụ, Phường 5, Thành phố Đà Lạt, Tỉnh Lâm Đồng, Việt Nam',
    } = payload

    const template = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'send-ticket.template.html'),
      'utf8',
    )

    const backgroundImage = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'email-header.png'),
      'base64',
    )

    const emailIcon = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'email.png'),
      'base64',
    )

    const locationIcon = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'location.png'),
      'base64',
    )

    const phoneIcon = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'phone.png'),
      'base64',
    )

    return {
      substitution_data: {
        customerName,
        ticketDate,
        bookingCode,
        expirationDate,
        ticketUrl,
        openingTime,
        closingTime,
        lfHotline,
        lfEmail,
        lfAddress,
      },
      content: {
        from,
        subject,
        html: template,
        attachments,
        inline_images: [
          {
            name: 'backgroundImage',
            type: 'image/png',
            data: backgroundImage,
          },
          {
            name: 'emailIcon',
            type: 'image/png',
            data: emailIcon,
          },
          {
            name: 'locationIcon',
            type: 'image/png',
            data: locationIcon,
          },
          {
            name: 'phoneIcon',
            type: 'image/png',
            data: phoneIcon,
          },
        ],
      },
      recipients: [{ address: to as string }],
      options: {
        inline_css: true,
      },
    }
  }

  setResetPasswordOption(payload: ILCRestPasswordMailContent): SparkPost.CreateTransmission {
    const {
      from = this.fromEmail,
      subject = 'Yêu cầu đặt lại mật khẩu tài khoản của bạn',
      to,
      attachments,
      // data
      resetPasswordUrl,
      openingTime = appDayJs().startOf('D').add(TICKET_VALID_TIME_FROM_SECOND, 's').format('HH:mm'),
      closingTime = appDayJs().startOf('D').add(TICKET_VALID_TIME_TO_SECOND, 's').format('HH:mm'),
      lfHotline = '0931904904',
      lfEmail = 'center@langfarm.com',
      lfAddress = 'Số 1B đường Hoàng Văn Thụ, Phường 5, Thành phố Đà Lạt, Tỉnh Lâm Đồng, Việt Nam',
    } = payload

    const template = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'reset-password.template.html'),
      'utf8',
    )

    const backgroundImage = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'email-header.png'),
      'base64',
    )

    const emailIcon = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'email.png'),
      'base64',
    )

    const locationIcon = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'location.png'),
      'base64',
    )

    const phoneIcon = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'phone.png'),
      'base64',
    )

    return {
      substitution_data: {
        resetPasswordUrl,
        openingTime,
        closingTime,
        lfHotline,
        lfEmail,
        lfAddress,
      },
      content: {
        from,
        subject,
        html: template,
        attachments,
        inline_images: [
          {
            name: 'backgroundImage',
            type: 'image/png',
            data: backgroundImage,
          },
          {
            name: 'emailIcon',
            type: 'image/png',
            data: emailIcon,
          },
          {
            name: 'locationIcon',
            type: 'image/png',
            data: locationIcon,
          },
          {
            name: 'phoneIcon',
            type: 'image/png',
            data: phoneIcon,
          },
        ],
      },

      recipients: [{ address: to as string }],
      options: {
        inline_css: true,
      },
    }
  }

  setBookingsExcelBufferAttachmentOption(payload: {
    to: string
    subject?: string
    excelBuffer: Buffer
    fileName?: string
    from?: string
    exportedBy?: string
    exportedAt?: string
  }): SparkPost.CreateTransmission {
    const {
      from = this.fromEmail,
      subject = 'Báo cáo Excel từ Langfarm Center',
      to,
      excelBuffer,
      fileName = 'report.xlsx',
      exportedAt,
      exportedBy,
    } = payload

    const template = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'export-bookings-excel.template.html'),
      'utf8',
    )

    const backgroundImage = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'email-header.png'),
      'base64',
    )

    const emailIcon = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'email.png'),
      'base64',
    )

    const locationIcon = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'location.png'),
      'base64',
    )

    const phoneIcon = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'phone.png'),
      'base64',
    )
    const attachment: Attachment = {
      name: fileName,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      data: (excelBuffer as unknown as Buffer).toString('base64'),
    }

    return {
      substitution_data: {
        openingTime: '07:30',
        closingTime: '17:30',
        lfHotline: '0931904904',
        lfEmail: 'center@langfarm.com',
        lfAddress: 'Số 1B đường Hoàng Văn Thụ, Phường 5, Thành phố Đà Lạt, Tỉnh Lâm Đồng, Việt Nam',
        exportedBy,
        exportedAt,
      },
      content: {
        from,
        subject,
        html: template,
        attachments: [attachment],
        inline_images: [
          {
            name: 'backgroundImage',
            type: 'image/png',
            data: backgroundImage,
          },
          {
            name: 'emailIcon',
            type: 'image/png',
            data: emailIcon,
          },
          {
            name: 'locationIcon',
            type: 'image/png',
            data: locationIcon,
          },
          {
            name: 'phoneIcon',
            type: 'image/png',
            data: phoneIcon,
          },
        ],
      },
      recipients: [{ address: to }],
    }
  }

  setOrdersExcelBufferAttachmentOption(payload: {
    to: string
    subject?: string
    excelBuffer: Buffer
    fileName?: string
    from?: string
    exportedAt?: string
  }): SparkPost.CreateTransmission {
    const {
      from = this.fromEmail,
      subject = 'Báo cáo Excel từ Langfarm Center',
      to,
      excelBuffer,
      fileName = 'report.xlsx',
      exportedAt,
    } = payload

    const template = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'export-bookings-excel.template.html'),
      'utf8',
    )

    const backgroundImage = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'email-header.png'),
      'base64',
    )

    const emailIcon = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'email.png'),
      'base64',
    )

    const locationIcon = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'location.png'),
      'base64',
    )

    const phoneIcon = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'phone.png'),
      'base64',
    )
    const attachment: Attachment = {
      name: fileName,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      data: (excelBuffer as unknown as Buffer).toString('base64'),
    }

    return {
      substitution_data: {
        openingTime: '07:30',
        closingTime: '17:30',
        lfHotline: '0931904904',
        lfEmail: 'center@langfarm.com',
        lfAddress: 'Số 1B đường Hoàng Văn Thụ, Phường 5, Thành phố Đà Lạt, Tỉnh Lâm Đồng, Việt Nam',
        exportedAt,
      },
      content: {
        from,
        subject,
        html: template,
        attachments: [attachment],
        inline_images: [
          {
            name: 'backgroundImage',
            type: 'image/png',
            data: backgroundImage,
          },
          {
            name: 'emailIcon',
            type: 'image/png',
            data: emailIcon,
          },
          {
            name: 'locationIcon',
            type: 'image/png',
            data: locationIcon,
          },
          {
            name: 'phoneIcon',
            type: 'image/png',
            data: phoneIcon,
          },
        ],
      },
      recipients: [{ address: to }],
    }
  }

  setProductVariantsExcelBufferAttachmentOption(payload: {
    to: string
    subject?: string
    excelBuffer: Buffer
    fileName?: string
    from?: string
  }): SparkPost.CreateTransmission {
    const {
      from = this.fromEmail,
      subject = 'Danh sách sản phẩm',
      to,
      excelBuffer,
      fileName = 'DanhSachSanPham.xlsx',
    } = payload

    const template = fs.readFileSync(
      path.join(
        process.cwd(),
        'src',
        'modules',
        'shared',
        'mail',
        'templates',
        'export-product-variants-excel.template.html',
      ),
      'utf8',
    )

    const backgroundImage = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'email-header.png'),
      'base64',
    )

    const emailIcon = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'email.png'),
      'base64',
    )

    const locationIcon = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'location.png'),
      'base64',
    )

    const phoneIcon = fs.readFileSync(
      path.join(process.cwd(), 'src', 'modules', 'shared', 'mail', 'templates', 'assets', 'images', 'phone.png'),
      'base64',
    )
    const attachment: Attachment = {
      name: fileName,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      data: (excelBuffer as unknown as Buffer).toString('base64'),
    }

    return {
      substitution_data: {
        openingTime: '07:30',
        closingTime: '17:30',
        lfHotline: '0931904904',
        lfEmail: 'center@langfarm.com',
        lfAddress: 'Số 1B đường Hoàng Văn Thụ, Phường 5, Thành phố Đà Lạt, Tỉnh Lâm Đồng, Việt Nam',
        reportTitle: subject,
      },
      content: {
        from,
        subject,
        html: template,
        attachments: [attachment],
        inline_images: [
          {
            name: 'backgroundImage',
            type: 'image/png',
            data: backgroundImage,
          },
          {
            name: 'emailIcon',
            type: 'image/png',
            data: emailIcon,
          },
          {
            name: 'locationIcon',
            type: 'image/png',
            data: locationIcon,
          },
          {
            name: 'phoneIcon',
            type: 'image/png',
            data: phoneIcon,
          },
        ],
      },
      recipients: [{ address: to }],
    }
  }
}
