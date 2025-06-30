import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { COLLECTION_NAME } from '@src/constants/collection-name.constant'
import { Document, Types } from 'mongoose'

export enum ActionType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

@Schema({ collection: COLLECTION_NAME.HISTORY, timestamps: true })
export class LCHistory extends Document<Types.ObjectId> {
  @Prop({ required: true, enum: COLLECTION_NAME, type: String })
  collectionName: string

  @Prop({ required: true, enum: ActionType })
  actionType: string

  @Prop({ required: false })
  actionDescription?: string

  @Prop({ type: Object, required: false })
  oldData?: Record<string, any>

  @Prop({ type: Object, required: false })
  newData?: Record<string, any>

  @Prop({ required: true, type: String })
  changeId: string

  @Prop({ type: Object, required: false })
  changes?: Record<string, [any, any]>

  @Prop({ required: false })
  changeBy: string

  @Prop({ required: false, type: Date })
  changeAt: Date
}

export type ILCHistory = LCHistory

export const LCHistorySchema = SchemaFactory.createForClass(LCHistory)
