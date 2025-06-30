import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { COLLECTION_NAME } from '@src/constants/collection-name.constant'
import { Document, Types } from 'mongoose'

@Schema({ collection: COLLECTION_NAME.COUNTER, timestamps: true })
export class LCCounter extends Document<Types.ObjectId> {
  @Prop({ required: true, default: 0 })
  count: number

  @Prop({ required: true, unique: true, enum: COLLECTION_NAME, type: String })
  collectionName: string
}

export type LCCounterDocument = LCCounter

export const LCCounterSchema = SchemaFactory.createForClass(LCCounter)
