import { forwardRef, Module } from '@nestjs/common'
import { CustomerModule } from '../customer/customer.module'
import { PaymentMethodModule } from '../payment-methods/payment-method.module'
import { SharedModule } from '../shared/shared.module'
import { MeInvoiceController } from './meinvoice.controller'
import { MeInvoiceService } from './meinvoice.service'
import { Invoice, InvoiceSchema } from '../invoice/schemas/invoice.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { Order, OrderSchema } from '../order/schemas/order.schema'

@Module({
  imports: [
    SharedModule,
    PaymentMethodModule,
    CustomerModule,
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  providers: [MeInvoiceService],
  controllers: [MeInvoiceController],
  exports: [MeInvoiceService],
})
export class MeInvoiceModule {}
