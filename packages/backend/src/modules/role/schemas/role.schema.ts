import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument } from 'mongoose'
import { RoleProvider } from '../role.enum'

@Schema({
  timestamps: true,
})
export class Role extends Document {
  @Prop({ required: true })
  name: string

  @Prop()
  description: string

  @Prop({ required: true })
  roleCode: string

  @Prop({ type: [String], default: [] })
  permissionKeys: string[]

  @Prop({ default: 0 })
  totalUsers: number

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: false })
  isDeleted: boolean

  // @Prop({ required: false, default: RoleProvider.Ticket, enum: Object.values(RoleProvider) })
  // provider: RoleProvider
}

export const RoleSchema = SchemaFactory.createForClass(Role)

export type RoleDocument = HydratedDocument<Role>
