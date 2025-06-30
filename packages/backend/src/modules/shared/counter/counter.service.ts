import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { COLLECTION_NAME } from '../../../constants/collection-name.constant'
import { LCCounter } from './schema/counter.schema'

@Injectable()
export class CounterService {
  constructor(@InjectModel(LCCounter.name) private counterModel: Model<LCCounter>) {}

  async increment(
    collectionName: (typeof COLLECTION_NAME)[keyof typeof COLLECTION_NAME],
    amount: number = 1,
  ): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { collectionName },
      { $inc: { count: amount } },
      { new: true, upsert: true },
    )
    return counter?.count || 0
  }
}
