import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Role } from '../schemas/role.schema'

export class CreateRoleDto implements Partial<Role> {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  roleCode: string

  @IsArray()
  @IsNotEmpty()
  permissionKeys: string[]

  @IsOptional()
  @IsString()
  description?: string
}
