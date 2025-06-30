import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ collection: 'lcdashboards', timestamps: true })
export class LCDashboard extends Document<Types.ObjectId> {
  @Prop({ required: true })
  date: Date

  @Prop({ required: true })
  dateString: string

  @Prop({ required: true })
  hourString: string

  @Prop({ required: true })
  dayString: string

  @Prop({ required: true })
  monthString: string

  @Prop({ required: true })
  yearString: string

  // filter
  @Prop({ required: true })
  saleChannelId: string

  @Prop({ required: true })
  targetId: string

  @Prop({ required: true })
  paymentMethodId: string

  // unused
  @Prop({}) //true
  ticketExpired: number

  // revenue
  @Prop({ required: true })
  revenue: number

  @Prop({})
  revenueByCash: number

  @Prop({})
  revenueByPayoo: number

  @Prop({})
  revenueByBankTransfer: number

  // ticket sold
  @Prop({ required: true })
  ticketSold: number

  @Prop({ required: true })
  ticketSoldAdult: number

  @Prop({ required: true })
  ticketSoldChild: number

  // booking
  @Prop({ required: true })
  totalBooking: number

  // discount
  @Prop({ required: false })
  discount: number

  // promotion
  @Prop({ required: false })
  promotion: number

  @Prop({ required: false })
  originalRevenue: number

  @Prop({ required: false })
  totalPoint: number

  // ghi nợ
  @Prop({ required: false })
  debt: number
}

export type ILCDashboard = LCDashboard & Document<Types.ObjectId>

export const LCDashboardSchema = SchemaFactory.createForClass(LCDashboard)
