import { Body, Controller, Get, Inject, Patch } from '@nestjs/common'
import { AppVersion } from 'src/enums/app.enum'
import { ApiBuilder } from 'src/lib/api'
import { UpdateSystemConfigDto } from './dto/update-system-config.dto'
import { SystemConfigService } from './system-config.service'

@Controller({
  version: AppVersion.v1,
  path: '/system-config',
})
export class SystemConfigController {
  @Inject() private readonly systemConfigService: SystemConfigService

  @Get()
  // @Auth()
  async getSystemConfig(): Promise<any> {
    const result = await this.systemConfigService.getSystemConfig()
    return ApiBuilder.create().setMessage('Success').setData(result).build()
  }

  @Patch('/update')
  async updateSystemConfig(@Body() body: UpdateSystemConfigDto): Promise<any> {
    await this.systemConfigService.updateSystemConfig({}, body)
    return ApiBuilder.create().setMessage('Success').build()
  }
}
