// schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'

@Schema({ _id: false })
export class DiscountCode {
  @Prop({ type: Number })
  amount: number

  @Prop()
  code: string

  @Prop({ type: MongooseSchema.Types.Mixed })
  type: any

  @Prop()
  is_coupon_code: boolean
}

@Schema({
  timestamps: { createdAt: true, updatedAt: true },
  collection: 'orders',
})
export class Order extends Document {
  @Prop({ type: MongooseSchema.Types.Mixed })
  haravanData: any // optional: expand this into sub-schema like Address
  @Prop() channel: string

  @Prop({ required: true, unique: true }) orderNumber: string

  @Prop() deliveringAt: Date
  @Prop() cancelAt: Date
  @Prop() deliveredAt: Date
  @Prop() confirmedAt: Date

  @Prop({ enum: ['COD', 'PLATFORM'] }) paymentMethod: string
  @Prop({ enum: ['PAID', 'UNPAID'] }) paymentStatus: string
  @Prop({ enum: ['PROCESSING', 'CANCELLED', 'COMPLETED', 'RETURNED'] }) status: string
  @Prop({
    enum: [
      'WAITING_FOR_PICKUP',
      'PICKING_UP',
      'DELIVERING',
      'DELIVERED',
      'DELIVERY_CANCELED',
      'RETURNED',
      'NOT_DELIVERED_YET',
      'CUSTOMER_NOT_FOUND',
      'WAITING_FOR_RETURN',
      'INCOMPLETE',
      'DELIVERY_FAILED',
      'PICKUP_FAILED',
    ],
  })
  fulfilmentStatus: string

  @Prop() totalAmountListPrice: number
  @Prop() totalDiscount: number
  @Prop() totalAmount: number

  @Prop({ type: [DiscountCode] }) discountCodes: DiscountCode[]

  @Prop({ type: [MongooseSchema.Types.Mixed] }) lineItems: any[]

  @Prop({
    type: {
      invCode: String,
      invNo: String,
      transId: String,
      invSymbol: String,
    },
  })
  invoiceIssuedData: {
    invCode: string
    invNo: string
    transId: string
    invSymbol?: string
  }

  @Prop() invoiceCreatedAt: Date
  @Prop() invoiceRefId: string

  @Prop({ type: MongooseSchema.Types.Mixed })
  invoiceData: any

  @Prop({
    type: {
      address: String,
      legalName: String,
      receiverEmail: String,
      taxCode: String,
      note: String,
    },
  })
  vatData: {
    address: string
    legalName: string
    receiverEmail: string
    taxCode: string
    note: string
  }

  @Prop() note: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)
