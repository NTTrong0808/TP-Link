import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, RootFilterQuery, UpdateQuery } from 'mongoose'
import { SystemConfig, SystemConfigType } from './schemas/system-config.schema'

@Injectable({})
export class SystemConfigService {
  constructor(
    @InjectModel(SystemConfig.name)
    private systemConfigModel: Model<SystemConfig>,
  ) {}

  async getSystemConfig(filter: RootFilterQuery<SystemConfig> = {}) {
    return this.systemConfigModel
      .findOne({
        configType: SystemConfigType.LF_TICKET,
        ...(filter as object),
      })
      .lean()
  }

  async updateSystemConfig(filter: RootFilterQuery<SystemConfig> = {}, update: UpdateQuery<SystemConfig>) {
    return this.systemConfigModel.findOneAndUpdate(
      {
        configType: SystemConfigType.LF_TICKET,
        ...(filter as object),
      },
      update,
      {
        upsert: true,
        new: true,
        lean: true,
      },
    )
  }
}
