import { HttpException, InternalServerErrorException } from '@nestjs/common'
import { isEmpty, isNil, omitBy } from 'lodash'
import { Api } from './api'
import { ApiMeta } from './api.interface'

export class ApiBuilder<TData = unknown> {
  private signal: Api<TData, ApiMeta>
  private lean: boolean

  constructor(options: { lean?: boolean } = { lean: false }) {
    this.signal = new Api<TData, ApiMeta>()
    this.lean = options.lean || false
  }

  static create(options?: { lean?: boolean }) {
    return new ApiBuilder(options)
  }

  setData<T extends TData>(data: T): ApiBuilder<T> {
    this.signal.data = this.lean
      ? (omitBy(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          { ...data, _id: (data as any)?._id?.toString() },
          isNil,
        ) as unknown as T)
      : data

    return this as unknown as ApiBuilder<T>
  }

  setMessage(message: string) {
    this.signal.message = message
    return this
  }

  setMeta<T extends ApiMeta>(pagination: T) {
    this.signal.meta = pagination
    return this
  }

  throwException(exception: HttpException | Error) {
    if (exception instanceof HttpException) {
      throw new HttpException(exception?.getResponse?.(), exception?.getStatus?.(), {
        cause: exception.cause,
        description: exception.name,
      })
    }

    if (exception instanceof Error) {
      throw new InternalServerErrorException(exception.message, {
        cause: exception.stack,
      })
    }
  }

  build() {
    if (isNil(this.signal.message) || isEmpty(this.signal.message))
      throw new Error('Missing Signal properties included in (message, data).')

    return {
      data: this.signal.getData(),
      message: this.signal.getMessage(),
      meta: this.signal.getMeta(),
    }
  }
}
