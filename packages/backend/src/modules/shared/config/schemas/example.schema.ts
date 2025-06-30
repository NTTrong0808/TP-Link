import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConfigDocument = HydratedDocument<Config>;

@Schema()
export class Config {
  @Prop({ type: String, required: true })
  baseUrl: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: false })
  env?: string;

  @Prop({ type: String, required: false })
  branchId?: string;

  @Prop({ type: Number, required: false })
  type?: number;

  @Prop({ type: Object, required: false })
  othersData?: Record<string, any>;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
