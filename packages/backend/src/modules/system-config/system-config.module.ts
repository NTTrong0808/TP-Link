import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SystemConfig, SystemConfigSchema } from './schemas/system-config.schema'
import { SystemConfigController } from './system-config.controller'
import { SystemConfigService } from './system-config.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: SystemConfig.name, schema: SystemConfigSchema }])],
  providers: [SystemConfigService],
  controllers: [SystemConfigController],
  exports: [SystemConfigService],
})
export class SystemConfigModule {}
