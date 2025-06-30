import { Injectable } from '@nestjs/common'
import { ApiBuilder } from './lib/api'

@Injectable()
export class AppService {
  getHello() {
    return ApiBuilder.create().setMessage('Hello, world').setData([]).build()
  }
}
