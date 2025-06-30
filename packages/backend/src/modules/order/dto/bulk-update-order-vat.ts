import { IsOptional, IsString, IsEmail, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class VatDataDto {
  @IsString()
  orderNumber: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  legalName?: string

  @IsOptional()
  @IsString()
  receiverEmail?: string

  @IsOptional()
  @IsString()
  taxCode?: string

  @IsOptional()
  @IsString()
  note?: string
}

export class BulkUpdateOrderVATDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VatDataDto)
  vatDatas: VatDataDto[]
}
