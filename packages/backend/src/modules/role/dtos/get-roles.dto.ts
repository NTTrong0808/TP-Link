import { IsOptional, IsString } from 'class-validator'

export class GetRolesDto {
  @IsString()
  @IsOptional()
  search?: string
}
