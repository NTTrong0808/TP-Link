import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RoleModule } from '../role/role.module'
import { User, UserSchema } from './schemas/user.schema'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { SharedModule } from '../shared/shared.module'

@Global()
@Module({
  imports: [RoleModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), SharedModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
