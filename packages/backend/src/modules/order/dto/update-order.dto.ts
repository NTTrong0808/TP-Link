import { IsEmail, IsOptional, IsString } from 'class-validator'

class VatDataDto {
  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  legalName?: string

  @IsOptional()
  @IsEmail()
  receiverEmail?: string

  @IsOptional()
  @IsString()
  taxCode?: string

  @IsOptional()
  @IsString()
  note?: string
}

export class UpdateOrderDto {
  @IsOptional()
  vatData?: VatDataDto
}

export class UpdateOrderVatInfoDto extends VatDataDto {}

export class UpdateOrderNoteDto {
  @IsOptional()
  @IsString()
  note?: string
}
