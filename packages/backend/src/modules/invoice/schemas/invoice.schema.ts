import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type InvoiceDocument = Invoice & Document

@Schema({
  timestamps: { createdAt: false, updatedAt: true },
  collection: 'invoices',
})
export class Invoice {
  @Prop({})
  customerUniqueId: string

  @Prop({ type: Object })
  haravanData?: Record<string, any>

  @Prop({ type: Object })
  kiotvietData?: Record<string, any>

  @Prop()
  totalSpending?: number

  @Prop()
  codeHaravan?: string

  @Prop()
  codeKiotviet?: string

  @Prop()
  status?: number

  @Prop()
  financialStatus?: number

  @Prop()
  searchValue?: string

  @Prop()
  channel?: string

  @Prop({ type: [String] }) // replace String with actual type if known
  suffix?: any[]

  @Prop({ type: Object })
  eshopData?: Record<string, any>

  @Prop()
  codeEshop?: string

  @Prop({ type: Object })
  lotteData?: Record<string, any>

  @Prop()
  codeLotte?: string

  @Prop({ type: Object })
  pos365Data?: Record<string, any>

  @Prop({ type: Object })
  ecomData?: Record<string, any>

  @Prop()
  codeEcom?: string

  @Prop()
  codeSPE?: string

  @Prop()
  codeTTS?: string

  @Prop()
  codeLZD?: string

  @Prop({ type: Object })
  speData?: Record<string, any>

  @Prop({ type: Object })
  lzdData?: Record<string, any>

  @Prop({ type: Object })
  ttsData?: Record<string, any>

  @Prop()
  code?: string

  @Prop({ index: true, sparse: true })
  storeId?: string

  @Prop({ type: Object })
  data?: Record<string, any>

  @Prop({ type: Number })
  meInvoiceCreatedAt?: number

  @Prop({ type: Object })
  meInvoiceData?: Record<string, any>

  @Prop()
  meInvoiceRefId?: string

  @Prop({ default: () => Date.now() })
  createdAt: Date
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice)
