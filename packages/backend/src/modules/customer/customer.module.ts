import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { HistoryModule } from '../shared/history/history.module'
import { CustomerController } from './customer.controller'
import { CustomerService } from './customer.service'
import { LCCustomer, LCCustomerSchema } from './schemas/customer.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LCCustomer.name, schema: LCCustomerSchema }]),
    forwardRef(() => HistoryModule),
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
