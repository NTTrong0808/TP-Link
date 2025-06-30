import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export enum CustomerType {
  TA = 'TA',
  RT = 'RT',
}

@Schema({ collection: 'lccustomers', timestamps: true })
export class LCCustomer extends Document<Types.ObjectId> {
  @Prop({ required: true })
  name: string

  @Prop({ required: false })
  phone: string

  @Prop({ required: false })
  email: string

  @Prop({ required: false })
  taxCode: string

  @Prop({ required: false })
  companyEmail: string

  @Prop({ required: false })
  companyName: string

  @Prop({ required: false })
  address: string

  @Prop({ required: false })
  bankNumber: string

  @Prop({ required: false })
  bankName: string

  @Prop({ required: false })
  bankBranch: string

  @Prop({ required: false, default: true })
  isActive: boolean

  @Prop({ required: false, default: false })
  isDeleted: boolean

  @Prop({
    type: String,
    enum: CustomerType,
    required: true,
    default: CustomerType.RT,
  })
  type: CustomerType

  @Prop({ required: false })
  icNumber: string

  @Prop({ required: false })
  ezTotalSales?: string

  @Prop({ required: false })
  ezProfileCode?: string

  @Prop({ required: false })
  contract: string

  @Prop({ required: false })
  updatedAt?: Date

  @Prop({ required: false })
  createdAt?: Date
}

export type ILCCustomer = LCCustomer

export const LCCustomerSchema = SchemaFactory.createForClass(LCCustomer)
