import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class GetUsersDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page: number

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  size: number

  @IsString()
  @IsOptional()
  search: string

  @IsString()
  @IsOptional()
  status: string

  @IsString()
  @IsOptional()
  roles: string
}
