import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { CustomerType } from '../schemas/customer.schema'

export class CreateCustomerDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  email?: string

  @IsOptional()
  @IsString()
  taxCode?: string

  @IsOptional()
  @IsString()
  companyName?: string

  @IsOptional()
  @IsString()
  companyEmail?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  bankNumber?: string

  @IsOptional()
  @IsString()
  bankName?: string

  @IsOptional()
  @IsString()
  bankBranch?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsEnum(CustomerType)
  type: CustomerType

  @IsOptional()
  @IsString()
  icNumber?: string

  @IsOptional()
  @IsString()
  contract?: string
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  email?: string

  @IsOptional()
  @IsString()
  taxCode?: string

  @IsOptional()
  @IsString()
  companyName?: string

  @IsOptional()
  @IsString()
  companyEmail?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  bankNumber?: string

  @IsOptional()
  @IsString()
  bankName?: string

  @IsOptional()
  @IsString()
  bankBranch?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsEnum(CustomerType)
  type?: CustomerType

  @IsOptional()
  @IsString()
  icNumber?: string

  @IsOptional()
  @IsString()
  contract?: string
}
