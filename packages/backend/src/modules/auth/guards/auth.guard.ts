import { CognitoJwtPayload } from '@nestjs-cognito/core'
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { merge } from 'lodash'
import { RoleService } from '../../role/role.service'
import { Role } from '../../role/schemas/role.schema'
import { User } from '../../user/schemas/user.schema'
import { UserService } from '../../user/user.service'

declare global {
  namespace Express {
    interface Request {
      currentUser?: User & { role: Role }
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject() private readonly userService: UserService
  @Inject() private readonly roleService: RoleService

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const cognitoUser = request.cognito_jwt_payload as CognitoJwtPayload

    if (!cognitoUser) {
      return false
    }

    const user = await this.userService.findUserByCognitoId(cognitoUser.sub)

    if (!user) {
      return false
    }

    const role = await this.roleService.findRoleById(user.roleId!)

    if (!role) {
      return false
    }

    const currentUser = merge(user, { role: role })

    request.currentUser = currentUser

    return true
  }
}
