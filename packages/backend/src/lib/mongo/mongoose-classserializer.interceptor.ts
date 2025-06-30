/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { ClassSerializerContextOptions, ClassSerializerInterceptor, PlainLiteralObject, Type } from '@nestjs/common'
import { classToPlain, ClassTransformOptions, plainToClass } from 'class-transformer'
import { Document } from 'mongoose'

export class MongooseClassSerializerInterceptor extends ClassSerializerInterceptor {
  private readonly classToIntercept: Type

  constructor(classToIntercept: Type) {
    super(classToIntercept)
    this.classToIntercept = classToIntercept
  }

  private changePlainObjectToClass(document: PlainLiteralObject) {
    console.log(Array.isArray(document) ? document.map((item) => item instanceof Document) : null)
    if (!(document instanceof Document)) {
      return Array.isArray(document) ? document.map((item) => classToPlain(item)) : classToPlain(document)
    }

    return plainToClass(
      this.classToIntercept,
      document.toJSON({
        transform(doc, ret) {
          ret._id = doc._id.toString()
          return ret
        },
      }),
    )
  }

  transformToPlain(plainOrClass: any, options: ClassSerializerContextOptions): PlainLiteralObject {
    if (plainOrClass instanceof Document) {
      return this.changePlainObjectToClass(plainOrClass)
    }

    return super.transformToPlain(plainOrClass, options)
  }

  private prepareResponse(
    response: PlainLiteralObject | PlainLiteralObject[] | { items: PlainLiteralObject[]; count: number },
  ) {
    if (!Array.isArray(response) && response?.items) {
      const items = this.prepareResponse(response.items)
      return {
        count: response.count,
        items,
      }
    }

    if (Array.isArray(response)) {
      return response.map(this.changePlainObjectToClass)
    }

    return this.changePlainObjectToClass(response)
  }

  serialize(response: PlainLiteralObject | PlainLiteralObject[], options: ClassTransformOptions) {
    return super.serialize(this.prepareResponse(response), options)
  }
}

// function MongooseClassSerializerInterceptor(classToIntercept: Type): typeof ClassSerializerInterceptor {
//   return class Interceptor extends ClassSerializerInterceptor {
//     private changePlainObjectToClass(document: PlainLiteralObject) {
//       if (!(document instanceof Document)) {
//         return Array.isArray(document) ? document.map((item) => classToPlain(item)) : classToPlain(document)
//       }
//       return plainToClass(
//         classToIntercept,
//         document.toJSON({
//           transform(doc, ret) {
//             ret._id = doc._id.toString()
//             return ret
//           },
//         }),
//       )
//     }

//     private prepareResponse(
//       response: PlainLiteralObject | PlainLiteralObject[] | { items: PlainLiteralObject[]; count: number },
//     ) {
//       if (!Array.isArray(response) && response?.items) {
//         const items = this.prepareResponse(response.items)
//         return {
//           count: response.count,
//           items,
//         }
//       }

//       if (Array.isArray(response)) {
//         return response.map(this.changePlainObjectToClass)
//       }

//       return this.changePlainObjectToClass(response)
//     }

//     serialize(response: PlainLiteralObject | PlainLiteralObject[], options: ClassTransformOptions) {
//       return super.serialize(this.prepareResponse(response), options)
//     }
//   }
// }

export default MongooseClassSerializerInterceptor
