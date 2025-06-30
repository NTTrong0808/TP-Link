import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Config, ConfigDocument } from './schemas/example.schema';
import { Model } from 'mongoose';

@Injectable()
export class ConfigService {
  constructor(
    @InjectModel(Config.name) 
    private readonly configModel: Model<ConfigDocument>,
  ) {}

  // TODO: Enhance type config
  async getConfig(type: number) {
    try {
      const config = await this.configModel.findOne({
        type
      }, 'baseUrl username password othersData').lean()
      return config
    } catch (error) {
      throw new Error(`Fail: ${error.message}`);
    }
  }

  async updateMetadataConfig(type: number, dataUpdated: Record<string, any>) {
    return this.configModel.findOneAndUpdate({ type }, { $set: dataUpdated })
  }
}