import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { HistoryService } from './history.service'
import { LCHistory, LCHistorySchema } from './schemas/history.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: LCHistory.name, schema: LCHistorySchema }])],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
