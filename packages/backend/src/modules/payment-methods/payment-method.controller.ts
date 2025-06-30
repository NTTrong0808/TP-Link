import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common'
import { AppVersion } from '@src/enums/app.enum'
import { ApiBuilder } from '@src/lib/api'
import { AddBankAccountDto, UpdateBankAccountDto } from './dto/bank-account'
import { CreatePaymentMethodDto } from './dto/create.dto'
import { FilterPaymentMethodDto } from './dto/filter.dto'
import { UpdatePaymentMethodDto } from './dto/update.dto'
import { PaymentMethodService } from './payment-method.service'

@Controller({
  version: AppVersion.v1,
  path: '/payment-methods',
})
export class PaymentMethodController {
  @Inject() private readonly paymentMethodService: PaymentMethodService

  @Post(':id/bank-account')
  async addBankAccount(@Param('id') paymentMethodId: string, @Body() newBankAccount: AddBankAccountDto) {
    return await this.paymentMethodService.addBankAccount(paymentMethodId, newBankAccount)
  }

  @Put(':id/bank-account/:bankAccountId')
  async updateBankAccount(
    @Param('id') paymentMethodId: string,
    @Param('bankAccountId') bankAccountId: string,
    @Body() updateData: UpdateBankAccountDto,
  ) {
    return await this.paymentMethodService.updateSingleBankAccount(paymentMethodId, bankAccountId, updateData)
  }

  @Delete(':id/bank-account/:bankAccountId')
  async removeBankAccount(@Param('id') paymentMethodId: string, @Param('bankAccountId') bankAccountId: string) {
    return await this.paymentMethodService.removeBankAccount(paymentMethodId, bankAccountId)
  }

  @Get()
  async getPaymentMethods(@Query() params: FilterPaymentMethodDto) {
    const res = await this.paymentMethodService.findPaymentMethods(params)
    return ApiBuilder.create().setMessage('Fetch success').setData(res).build()
  }

  @Post()
  async createPaymentMethod(@Body() dto: CreatePaymentMethodDto) {
    const res = await this.paymentMethodService.createPaymentMethod(dto)
    return ApiBuilder.create().setMessage('Create success').setData(res).build()
  }

  @Put('/:id')
  async updatePaymentMethod(@Param('id') id: string, @Body() dto: UpdatePaymentMethodDto) {
    const res = await this.paymentMethodService.updateOthersInfo(id, dto)
    return ApiBuilder.create().setMessage('Update available success').setData(res).build()
  }
}
