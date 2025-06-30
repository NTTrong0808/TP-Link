import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AuthCognitoService } from '@src/lib/auth-cognito/auth-cognito.service'
import { appDayJs } from '@src/lib/dayjs'
import { formatPhoneToE164 } from '@src/lib/helper/phone-number'
import crypto from 'crypto'
import { Model } from 'mongoose'
import { MailService } from '../shared/mail/mail.service'
import { User, UserDocument } from '../user/schemas/user.schema'
import { UserService } from '../user/user.service'
import { SignupDto } from './dtos/sign-up.dto'
import { ForgotPasswordDto, ResetPasswordDto } from './dtos/user-password.dto'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  private feUrl: string
  @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  @Inject() private readonly authCognitoService: AuthCognitoService
  @Inject() private readonly userService: UserService
  @Inject() private readonly mailService: MailService
  // eslint-disable-next-line @typescript-eslint/require-await

  constructor() {
    this.feUrl = (process.env.FE_URL || process.env.APP_CORS?.split(',')?.[0]) as string
  }

  signUp(dto: SignupDto) {
    // TODO: Implement sign up with amplify
    return dto
    // const user = await this.userModel.create({
    //   phoneNumber: dto.phoneNumber,
    //   password: dto.password,
    // });
    // return user;
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ email: data.email, username: data.phone })

    if (!user) {
      throw new NotFoundException('Email hoặc số điện thoại không tồn tại')
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = appDayJs().add(1, 'hour').toDate()

    await this.userModel.findByIdAndUpdate(user._id, {
      forgotPasswordToken: token,
      forgotPasswordTokenExpiresAt: expiresAt,
    })

    const content = this.mailService.setResetPasswordOption({
      to: data.email,
      resetPasswordUrl: `${this.feUrl}/reset-password/${token}`,
    })

    try {
      await this.mailService.sendEmail(content)
    } catch (err) {
      this.logger.error('Error send email forgot password: ', err)
      throw new Error('Hệ thống gặp lỗi, vui lòng thử lại sau')
    }

    return {
      success: true,
      message: 'Email khôi phục mật khẩu đã được gửi tới email của bạn',
    }
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      forgotPasswordToken: data.token,
    })

    if (
      !user ||
      !user.forgotPasswordToken ||
      !user.forgotPasswordTokenExpiresAt ||
      appDayJs().isAfter(appDayJs(user.forgotPasswordTokenExpiresAt))
    ) {
      throw new BadRequestException(
        'Liên kết khôi phục mật khẩu đã hết hạn, vui lòng gửi lại yêu cầu khôi phục mật khẩu mới',
      )
    }

    try {
      const result = await this.authCognitoService.verifyUserPassword(user.username, data.password)
      if (result) {
        throw new BadRequestException('Mật khẩu mới không được trùng với mật khẩu cũ')
      }
    } catch {
      // Ignore error as we expect it to fail when password is different
    }

    await this.authCognitoService.resetUserPassword(formatPhoneToE164(user.username), data.password)

    return await this.userModel.findByIdAndUpdate(
      user._id,
      {
        $unset: { forgotPasswordToken: 1, forgotPasswordTokenExpiresAt: 1 },
      },
      { new: true },
    )
  }

  async verifyResetPasswordToken(token: string) {
    const user = await this.userModel.findOne({
      forgotPasswordToken: token,
    })

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản')
    }

    return user
  }

  async changePassword(username: string, oldPassword: string, newPassword: string) {
    const user = await this.userService.findUserByUsername(username)

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản')
    }

    try {
      await this.authCognitoService.verifyUserPassword(username, oldPassword)
    } catch {
      throw new BadRequestException('Mật khẩu cũ không chính xác')
    }

    if (oldPassword === newPassword) {
      throw new BadRequestException('Mật khẩu mới không được trùng với mật khẩu cũ')
    }

    return this.authCognitoService.resetUserPassword(username, newPassword)
  }

  async adminResetPassword(userId: string, newPassword: string) {
    const user = await this.userService.findUserById(userId)

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản')
    }

    return this.authCognitoService.resetUserPassword(formatPhoneToE164(user.username), newPassword)
  }
}
