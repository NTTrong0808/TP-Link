import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
import { ManipulateType } from 'dayjs'

export class UpdateSystemConfigDto {
  @IsOptional()
  @IsNumber()
  autoIssuedInvoiceTime?: number

  @IsOptional()
  @IsString()
  autoIssuedInvoiceTimeType?: ManipulateType

  @IsOptional()
  @IsBoolean()
  autoIssuedInvoice?: boolean
}
