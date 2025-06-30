import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ManipulateType } from 'dayjs'
import { Document, HydratedDocument, Types } from 'mongoose'

export type SystemConfigDocument = HydratedDocument<SystemConfig>

export enum SystemConfigType {
  LF_TICKET = 'LF_TICKET',
  LF_CENTER = 'LF_CENTER',
  LF_DATAWAREHOUSE = 'LF_DATAWAREHOUSE',
}

export enum TimeType {
  hour = 'hour',
  minute = 'minute',
  second = 'second',

  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
}

@Schema({ timestamps: true, collection: 'systemconfigs' })
export class SystemConfig extends Document<Types.ObjectId> {
  @Prop({ required: true, enum: SystemConfigType })
  configType: string

  @Prop({ required: false })
  autoIssuedInvoiceTime?: number

  @Prop({ required: false, enum: TimeType })
  autoIssuedInvoiceTimeType?: ManipulateType

  @Prop({ required: false })
  autoIssuedInvoice?: boolean
}

export const SystemConfigSchema = SchemaFactory.createForClass(SystemConfig)
