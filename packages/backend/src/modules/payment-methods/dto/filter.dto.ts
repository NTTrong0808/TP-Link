import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class FilterPaymentMethodDto {
  @ApiPropertyOptional({
    description: 'Filter by type. Accepts an array of numbers or a single number.',
    type: [Number],
    example: [1, 2],
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  type?: number[]

  @ApiPropertyOptional({
    description: 'Filter by availability. Accepts true or false.',
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
  @IsString()
  paymentMethodType?: string
}
