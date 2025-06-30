import { Module } from '@nestjs/common'
import { ConfigModule } from './config/config.module'
import { CounterModule } from './counter/counter.module'
import { ExcelModule } from './excel/excel.module'
import { LCGGenerator } from './generator/generator.service'
import { LarkModule } from './lark/lark.module'
import { MailService } from './mail/mail.service'
import { SharedController } from './shared.controller'
import { SharedService } from './shared.service'
import { UndiciModule } from './undici/undici-http.module'

@Module({
  imports: [UndiciModule, ConfigModule, ExcelModule, CounterModule, LarkModule],
  controllers: [SharedController],
  providers: [MailService, LCGGenerator, SharedService],
  exports: [
    UndiciModule,
    ConfigModule,
    MailService,
    LCGGenerator,
    ExcelModule,
    CounterModule,
    LarkModule,
    SharedService,
  ],
})
export class SharedModule {}
