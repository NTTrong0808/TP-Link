import { Authentication, PublicRoute } from '@nestjs-cognito/auth'
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common'
import { AppVersion } from '@src/enums/app.enum'
import { ApiBuilder } from '@src/lib/api'
import { CreateRoleDto } from './dtos/create-role.dto'
import { GetRolesDto } from './dtos/get-roles.dto'
import { UpdateRoleDto } from './dtos/update-role.dto'
import { RoleService } from './role.service'

@Controller({
  path: 'roles',
  version: AppVersion.v1,
})
@Authentication()
export class RoleController {
  @Inject() private readonly roleService: RoleService

  @Get('allocation')
  @PublicRoute()
  async allocationRoles() {
    await this.roleService.allocation()
    return ApiBuilder.create().setData([]).setMessage('Successfully retrieved allocated roles').build()
  }

  @Get()
  async findAllRoles(@Query() query: GetRolesDto) {
    const roles = await this.roleService.findManyRoles({ search: query.search || undefined })
    return ApiBuilder.create().setData(roles).setMessage('Successfully retrieved all roles').build()
  }

  @Get(':id')
  async findRoleById(@Param('id') id: string) {
    const role = await this.roleService.findRoleById(id)
    return ApiBuilder.create().setData(role).setMessage('Successfully retrieved role').build()
  }

  @Post()
  async createRole(@Body() data: CreateRoleDto) {
    const createdRole = await this.roleService.createRole(data)
    return ApiBuilder.create().setData(createdRole).setMessage('Successfully created new role').build()
  }

  @Put(':id')
  async updateRole(@Param('id') id: string, @Body() data: UpdateRoleDto) {
    const updatedRole = await this.roleService.updateRole(id, data)
    return ApiBuilder.create().setData(updatedRole).setMessage('Successfully updated role').build()
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    const deletedRole = await this.roleService.deleteRole(id)
    return ApiBuilder.create().setData(deletedRole).setMessage('Successfully deleted role').build()
  }

  @Get('permissions')
  getPermissions() {
    const result = this.roleService.getRolePermissions()
    return ApiBuilder.create().setData(result).setMessage('Successfully retrieved role permissions').build()
  }
}
