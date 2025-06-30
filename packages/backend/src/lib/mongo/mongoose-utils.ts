import { isValidObjectId, Types } from 'mongoose'

export const toObjectId = (id?: string | Types.ObjectId | null): Types.ObjectId => {
  if (id && isValidObjectId(id)) {
    return new Types.ObjectId(id)
  }
  throw new Error('Invalid ObjectId')
}
