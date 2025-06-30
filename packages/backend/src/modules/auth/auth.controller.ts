import { Body, Controller, Get, Inject, NotFoundException, Post } from '@nestjs/common'
import { AppVersion } from 'src/enums/app.enum'
import { ApiBuilder } from 'src/lib/api'
import { Auth, CurrentUser, CurrentUserPayload } from './auth.decorator'
import { AuthService } from './auth.service'
import { SignupDto } from './dtos/sign-up.dto'
import { AdminResetPasswordDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dtos/user-password.dto'

@Controller({
  version: AppVersion.v1,
  path: 'auth',
})
export class AuthController {
  @Inject() private readonly authService: AuthService
  @Get('me')
  @Auth()
  me(@CurrentUser() user: CurrentUserPayload) {
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return ApiBuilder.create({ lean: true }).setData(user).setMessage('User fetched successfully').build()
  }

  @Post('sign-up')
  async signUp(@Body() body: SignupDto) {
    const user = await this.authService.signUp(body)

    return ApiBuilder.create({ lean: true }).setData(user).setMessage('User created successfully').build()
  }

  @Post('change-password')
  @Auth()
  async changePassword(@Body() body: ChangePasswordDto, @CurrentUser() user: CurrentUserPayload) {
    await this.authService.changePassword(user.username, body.oldPassword, body.newPassword)

    return ApiBuilder.create().setMessage('Mật khẩu đã được đặt lại, vui lòng đăng nhập lại').build()
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    await this.authService.forgotPassword(body)

    return ApiBuilder.create()
      .setMessage('Yêu cầu lấy lại mật khẩu đã được gửi đến email, vui lòng kiểm tra hộp thư đến')
      .build()
  }

  @Post('admin-reset-password')
  @Auth()
  async adminResetPassword(@Body() body: AdminResetPasswordDto) {
    await this.authService.adminResetPassword(body.userId, body.newPassword)

    return ApiBuilder.create().setMessage('Cập nhật mật khẩu thành công').build()
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.authService.resetPassword(body)

    return ApiBuilder.create().setMessage('Mật khẩu đã được đặt lại thành công').build()
  }
}
