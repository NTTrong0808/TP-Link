import { Body, Controller, Post } from '@nestjs/common'
import { AppVersion } from '@src/enums/app.enum'
import { ApiBuilder } from '@src/lib/api/api.builder'
import { Auth } from '../auth/auth.decorator'
import { DashboardService } from './dashboard.service'

@Controller({
  version: AppVersion.v1,
  path: '/dashboard',
})
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // @Post()
  // @Auth()
  // async getDashboard(@Body() body: { from: Date; to: Date; type: 'hour' | 'day' | 'week' | 'month' | 'year' }) {
  //   const data = await this.dashboardService.getDashboardData(body)
  //   return ApiBuilder.create().setData(data).setMessage('Get dashboard data successfully').build()
  // }

  // @Post('update-data')
  // async updateDashboardData(@Body() body: { hour?: number; day?: number }) {
  //   await this.dashboardService.updateDashboardData(body)

  //   return ApiBuilder.create().setMessage('Update dashboard data is running! Please wait a moment').build()
  // }

  // @Post('clear-data')
  // async clearDashboardData() {
  //   await this.dashboardService.clearDashboard()
  //   return ApiBuilder.create().setMessage('Clear dashboard data successfully').build()
  // }
}
