import { Injectable } from '@nestjs/common'
import { IExample, LarkBotUrls, LarkService } from 'share'
import { ApiBuilder } from './lib/api'

@Injectable()
export class AppService {
  async getHello() {
    await LarkService.sendMessage(LarkBotUrls.exportLogBot, 'Hello, world')
    return ApiBuilder.create().setMessage('Hello, world').setData([]).build()
  }

  testSharedImport(): IExample {
    return {}
  }
}
