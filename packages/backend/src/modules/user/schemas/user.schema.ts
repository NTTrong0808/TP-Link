import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument, Types } from 'mongoose'
import { UserCognitoStatus } from '../user.enum'

export const USER_STATUS = {
  NO_ACCOUNT: 'NO_ACCOUNT',
  ACTIVATED: 'ACTIVATED',
  DEACTIVATED: 'DEACTIVATED',
  UN_ACTIVATED: 'UN_ACTIVATED',
} as const

@Schema({
  timestamps: true,
})
export class User extends Document<Types.ObjectId> {
  @Prop({ required: true })
  cognitoId: string

  @Prop({ required: true, enum: Object.values(UserCognitoStatus) })
  cognitoStatus: string

  @Prop({ required: true })
  cognitoEnableStatus: boolean

  @Prop({ required: true })
  email: string

  @Prop({ default: '' })
  firstName: string

  @Prop({ default: '' })
  lastName: string

  @Prop()
  roleId?: string

  @Prop()
  isSuperAdmin?: boolean

  @Prop()
  createdAt: Date

  @Prop()
  isBranchAccount?: boolean

  @Prop({ type: Object })
  amisData?: Record<string, any>

  @Prop()
  codeEmp?: string

  @Prop()
  username: string

  @Prop()
  idPostgres?: string

  @Prop({ required: true, enum: Object.values(USER_STATUS) })
  status: string

  @Prop()
  note?: string

  @Prop({ default: false })
  isProvidedNewPassword?: boolean

  @Prop({ default: '' })
  searchValue?: string

  @Prop()
  partnerId?: string

  @Prop({ required: false })
  forgotPasswordToken?: string

  @Prop({ required: false })
  forgotPasswordTokenExpiresAt?: Date
}

export const UserSchema = SchemaFactory.createForClass(User)

export type UserDocument = HydratedDocument<User>
