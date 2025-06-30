import { Module } from '@nestjs/common'
import { ConfigModule } from './config/config.module'
import { CounterModule } from './counter/counter.module'
import { ExcelModule } from './excel/excel.module'
import { LCGGenerator } from './generator/generator.service'
import { MailService } from './mail/mail.service'
import { UndiciModule } from './undici/undici-http.module'
import { LarkModule } from './lark/lark.module'

@Module({
  imports: [UndiciModule, ConfigModule, ExcelModule, CounterModule, LarkModule],
  providers: [MailService, LCGGenerator],
  exports: [UndiciModule, ConfigModule, MailService, LCGGenerator, ExcelModule, CounterModule, LarkModule],
})
export class SharedModule {}
