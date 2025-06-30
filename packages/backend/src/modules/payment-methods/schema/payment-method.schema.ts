import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type PaymentMethodDocument = HydratedDocument<PaymentMethod>

export enum PaymentMethodType {
  PREPAID = 'PREPAID',
  POSTPAID = 'POSTPAID',
}

@Schema()
export class BankAccount {
  @Prop({ required: false })
  name?: string

  @Prop({ required: true })
  accountNumber: string

  @Prop({ required: true })
  accountName: string

  @Prop({ required: false })
  bankNumber?: string // unused

  @Prop({ required: true })
  bankName: string

  @Prop({ required: false })
  bankBranch?: string

  @Prop({ required: true })
  bankCode: string

  @Prop({ required: true })
  bankShortName: string

  @Prop()
  qrCode?: string

  @Prop()
  note?: string

  @Prop({ default: false })
  available?: boolean
}

const BankAccountSchema = SchemaFactory.createForClass(BankAccount)

@Schema()
export class PaymentMethod {
  @Prop({ required: true })
  name: string

  @Prop()
  logoUrl: string

  @Prop({ default: false })
  available: boolean

  @Prop({ default: false })
  type: number

  @Prop({ required: false })
  payooType?: string

  @Prop({ required: false })
  description?: string

  @Prop({ required: false })
  vatDisplayName?: string

  @Prop({ required: false })
  accountantRef?: string

  @Prop({ enum: PaymentMethodType, required: false, default: PaymentMethodType.PREPAID })
  paymentType?: PaymentMethodType

  @Prop({ type: [BankAccountSchema], required: false })
  bankAccounts?: BankAccount[]
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod)
PaymentMethodSchema.set('toJSON', { getters: true, virtuals: false })
