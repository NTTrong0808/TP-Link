import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RoleModule } from '../role/role.module'
import { SharedModule } from '../shared/shared.module'
import { User, UserSchema } from '../user/schemas/user.schema'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Global()
@Module({
  imports: [UserModule, RoleModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), SharedModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
