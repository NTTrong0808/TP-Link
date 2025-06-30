import { Document } from 'mongoose';

/**
 * Using it for transform function on lean if not set toJSON on schema
 * @param doc 
 * @returns 
 */
export function transformId<T extends Document>(doc: T) {
  // console.log(doc)
  // doc._id = doc._id?.toString()
  return doc;
}