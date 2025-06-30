import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { AppVersion } from '@src/enums/app.enum'
import { ApiBuilder } from '@src/lib/api'
import { Auth, CurrentUser, CurrentUserPayload } from '../auth/auth.decorator'
import { CustomerService } from './customer.service'
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto'
import { CustomerType } from './schemas/customer.schema'
import { IEzCloudTA, IEzCloudTaSales } from './types'

@Controller({
  version: AppVersion.v1,
  path: '/customers',
})
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const result = await this.customerService.create(createCustomerDto)

    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Get()
  async findAll(@Query() query: Record<string, string>) {
    const { type, isActive } = query
    const filters = {
      ...(type ? { type } : {}),
      ...(isActive ? { isActive: isActive === 'true' ? true : false } : {}),
    }
    const result = await this.customerService.findAll(filters)

    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Get('/pagination')
  async getCustomerPagination(@Query() query: Record<string, string>) {
    const [customers, count] = await this.customerService.findManyCustomersPagination({
      size: Number(query.size),
      page: Number(query.page),
      search: query?.search?.trim(),
      isActive: query?.status ? query?.status?.split(',').map((e) => (e === 'true' ? true : false)) : undefined,
      type: query?.type ? (query?.type?.split(',') as CustomerType[]) : undefined,
    })

    return ApiBuilder.create()
      .setData(customers)
      .setMeta({
        total: Number(count),
        size: Number(query.size),
        page: Number(query.page),
      })
      .setMessage('Users fetched successfully')
      .build()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.customerService.findOne(id)

    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Put(':id')
  @Auth()
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    const result = await this.customerService.update(id, updateCustomerDto, currentUser)

    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.customerService.delete(id)

    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Post('/migrate-ta')
  async migrateTA(@Body() dto: IEzCloudTA[]) {
    const result = await this.customerService.migrateTa(dto)

    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Post('/migrate-total-sales')
  async migrateTotalSales(@Body() dto: IEzCloudTaSales[]) {
    const result = await this.customerService.updateTotalSalesForTa(dto)

    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }

  @Get(':id/history')
  async getCustomerHistory(@Param('id') id: string) {
    const result = await this.customerService.getCustomerHistory(id)

    return ApiBuilder.create().setData(result).setMessage('Success').build()
  }
}
