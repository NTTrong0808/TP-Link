import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'
import { LCDashboard, LCDashboardSchema } from './schemas/dashboard.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: LCDashboard.name, schema: LCDashboardSchema }])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
