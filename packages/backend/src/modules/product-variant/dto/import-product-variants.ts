import { Type } from 'class-transformer'
import { IsString, IsNumber, IsOptional, IsEnum, Min, Max, ValidateNested } from 'class-validator'

export class ImportProductVariantDto {
  @IsString()
  @IsOptional()
  variantCode: string

  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  status: string

  @IsString()
  @IsOptional()
  barcode: string

  @IsNumber()
  @IsOptional()
  localPrice: number

  @IsNumber()
  @IsOptional()
  nationalPrice: number

  @IsString()
  @IsOptional()
  boxSpecification: string

  @IsString()
  @IsOptional()
  unitName: string

  @IsString()
  @IsOptional()
  expirationDate: string

  @IsString()
  @IsOptional()
  expirationUnit: string

  @IsString()
  @IsOptional()
  categoryId: string

  @IsString()
  @IsOptional()
  collectionId: string

  @IsString()
  @IsOptional()
  brandId: string

  @IsNumber()
  @Min(0)
  @Max(1)
  vatIn: number

  @IsNumber()
  @Min(0)
  @Max(1)
  vatOut: number

  @IsString()
  @IsOptional()
  saleGroup: string
}

export class ImportProductVariantArrayDto {
  @ValidateNested({ each: true })
  @Type(() => ImportProductVariantDto)
  productVariants: ImportProductVariantDto[]
}
