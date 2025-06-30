import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class AddBankAccountDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  accountNumber: string

  @IsString()
  accountName: string

  @IsString()
  @IsOptional()
  bankNumber?: string

  @IsString()
  bankName: string

  @IsOptional()
  @IsString()
  bankBranch?: string

  @IsString()
  bankCode: string

  @IsString()
  bankShortName: string

  @IsString()
  @IsOptional()
  qrCode?: string

  @IsString()
  @IsOptional()
  note?: string
}

export class UpdateBankAccountDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  accountNumber?: string

  @IsString()
  @IsOptional()
  accountName?: string

  @IsString()
  @IsOptional()
  bankName?: string

  @IsString()
  @IsOptional()
  bankNumber?: string

  @IsString()
  @IsOptional()
  bankBranch?: string

  @IsString()
  @IsOptional()
  bankShortName?: string

  @IsString()
  @IsOptional()
  bankCode?: string

  @IsString()
  @IsOptional()
  qrCode?: string

  @IsString()
  @IsOptional()
  note?: string

  @IsBoolean()
  @IsOptional()
  available?: boolean
}
