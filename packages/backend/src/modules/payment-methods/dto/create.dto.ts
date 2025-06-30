import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { PaymentMethodType } from '../schema/payment-method.schema'

export class CreatePaymentMethodDto {
  @IsNumber() type: number
  @IsString() name: string
  @IsString() logoUrl: string
  @IsBoolean() available: boolean
  @IsOptional() @IsString() payooType?: string
  @IsOptional() @IsString() description?: string
  @IsOptional()
  @IsEnum(PaymentMethodType, {
    message: `paymentType must be one of: ${Object.values(PaymentMethodType).join(', ')}`,
  })
  paymentType?: PaymentMethodType
}
