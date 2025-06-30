import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class MergeUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsString()
  @IsNotEmpty()
  roleId: string

  @IsString()
  @IsNotEmpty()
  phoneNumber: string
}
