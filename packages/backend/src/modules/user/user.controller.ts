import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBuilder } from '@src/lib/api'
import { getSearchValue, normalizeVie } from '@src/lib/helper/user'
import { config } from 'dotenv'
import { isNil } from 'lodash'
import { Types } from 'mongoose'
import { AppVersion } from 'src/enums/app.enum'
import { Auth } from '../auth/auth.decorator'
import { CreateUserDto } from './dtos/create-user.dto'
import { GetUsersDto } from './dtos/get-users.dto'
import { MergeUserDto } from './dtos/merge-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UserStatus } from './user.enum'
import { UserService } from './user.service'

config({})

@Controller({
  version: AppVersion.v1,
  path: 'users',
})
export class UserController {
  @Inject()
  private readonly userService: UserService

  /**
   * Migration endpoint to update searchValue for all active users
   * @remarks This API should only be used by developers during migrations
   * @param migrationSecretKey - Secret key required to run migration, defined in .env as MIGRATION_SECRET_KEY
   * @throws {BadRequestException} If migration key is invalid
   * @returns {Promise<ApiResponse>} List of migrated users
   */
  @Get('migration')
  async migration(@Query('migration_secret_key') migrationSecretKey: string) {
    if (isNil(migrationSecretKey) || migrationSecretKey !== process.env.MIGRATION_SECRET_KEY) {
      throw new BadRequestException('Invalid migration key')
    }

    const [users] = await this.userService.findManyUsers({
      size: 100000,
      page: 0,
      search: '',
      status: [UserStatus.Activated],
    })

    for (const user of users) {
      await this.userService.updateUser(user._id as Types.ObjectId, {
        searchValue: getSearchValue(user, ['lastName', 'firstName', 'username', 'email', 'status']),
      })
    }

    return ApiBuilder.create().setMessage('Migration completed').setData(users).build()
  }

  @Get('/all')
  @Auth()
  // { permissionKeys: [RolePermission.All] }
  async getAllUsers() {
    const users = await this.userService.getAllUsers()

    return ApiBuilder.create().setData(users).setMessage('Users fetched successfully').build()
  }

  @Get()
  @Auth()
  // { permissionKeys: [RolePermission.All] }
  async getUsers(@Query() query: GetUsersDto) {
    const [users, count] = await this.userService.findManyUsers({
      size: query.size,
      page: query.page,
      search: normalizeVie(query.search),
      status: query?.status?.split(',') as UserStatus[],
      roles: query?.roles?.split(',') || [],
    })

    return ApiBuilder.create()
      .setData(users)
      .setMeta({
        total: Number(count),
        page: query.page,
        size: query.size,
      })
      .setMessage('Users fetched successfully')
      .build()
  }

  @Get(':id')
  @Auth()
  // { permissionKeys: [RolePermission.All] }
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findUserById(id as unknown as Types.ObjectId)

    return ApiBuilder.create().setData(user).setMessage('Users fetched successfully').build()
  }

  @Post()
  @Auth()
  // { permissionKeys: [RolePermission.All] }
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.createUser({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      roleId: body.roleId,
      username: body.phoneNumber,
      status: UserStatus.Activated,
      password: `Lfc@${body.phoneNumber.slice(-4)}`,
    })

    return ApiBuilder.create().setData(user).setMessage('User created successfully').build()
  }

  @Post('merge')
  @Auth()
  // { permissionKeys: [RolePermission.All] }
  async mergeUser(@Body() body: MergeUserDto) {
    const user = await this.userService.mergeUser({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      roleId: body.roleId,
      username: body.phoneNumber,
    })

    return ApiBuilder.create().setData(user).setMessage('User created successfully').build()
  }

  @Put(':id')
  @Auth()
  // { permissionKeys: [RolePermission.All] }
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const user = await this.userService.updateUser(id as unknown as Types.ObjectId, {
      firstName: body.firstName,
      lastName: body.lastName,
      roleId: body.roleId,
      status: body.status,
    })

    return ApiBuilder.create().setData(user).setMessage('User created successfully').build()
  }

  @Delete(':id')
  @Auth()
  // { permissionKeys: [RolePermission.All] }
  async delete(@Param('id') id: string) {
    const user = await this.userService.deleteUser(id as unknown as Types.ObjectId)

    return ApiBuilder.create().setData(user).setMessage('User created successfully').build()
  }
}
