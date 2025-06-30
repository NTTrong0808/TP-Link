import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CounterService } from './counter.service'
import { LCCounter, LCCounterSchema } from './schema/counter.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: LCCounter.name, schema: LCCounterSchema }])],
  providers: [CounterService],
  exports: [CounterService],
})
export class CounterModule {}
