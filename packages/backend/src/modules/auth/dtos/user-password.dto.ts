import { IsNotEmpty, IsString } from 'class-validator'

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string

  @IsNotEmpty()
  @IsString()
  password: string
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  email: string

  @IsNotEmpty()
  @IsString()
  phone: string
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string

  @IsNotEmpty()
  @IsString()
  newPassword: string
}

export class AdminResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  userId: string

  @IsNotEmpty()
  @IsString()
  newPassword: string
}
