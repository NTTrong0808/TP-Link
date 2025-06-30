// orders.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SharedModule } from '../shared/shared.module'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { Order, OrderSchema } from './schemas/order.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]), SharedModule],
  providers: [OrderService],
  exports: [OrderService],
  controllers: [OrderController],
})
export class OrdersModule {}
