import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'

export class BankAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  bankNumber: string

  @IsString()
  @IsNotEmpty()
  bankName: string

  @IsString()
  @IsNotEmpty()
  qrCode: string

  @IsOptional()
  @IsString()
  note?: string
}

export class UpdatePaymentMethodDto {
  @ApiPropertyOptional({
    description: 'The name of the payment method.',
    type: String,
    example: 'Credit Card',
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({
    description: 'A brief description of the payment method.',
    type: String,
    example: 'Payment via credit card.',
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({
    description: 'The URL of the logo for the payment method.',
    type: String,
    example: 'https://example.com/logo.png',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string

  @ApiPropertyOptional({
    description: 'Whether the payment method is available. Accepts true or false.',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true'
    }
    return Boolean(value)
  })
  @IsBoolean()
  available?: boolean

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BankAccountDto)
  bankAccount?: BankAccountDto[]
}
