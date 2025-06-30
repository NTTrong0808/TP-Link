import { Authentication } from '@nestjs-cognito/auth'
import { CognitoJwtPayload } from '@nestjs-cognito/core'
import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from '@nestjs/common'
import { RolePermission } from '../role/role.enum'
import { Role } from '../role/schemas/role.schema'
import { User } from '../user/schemas/user.schema'
import { AuthAbilityGuard } from './guards/auth-ability.guard'
import { AuthGuard } from './guards/auth.guard'

export type CurrentUserPayload = User & { role: Role }

export type CurrentCognitoUserPayload = CognitoJwtPayload

export interface AuthOptions {
  permissionKeys?: RolePermission[]
}

export const Auth = (options?: AuthOptions) => {
  return applyDecorators(
    SetMetadata('permissionKeys', options?.permissionKeys || []),
    Authentication(),
    UseGuards(AuthGuard),
    UseGuards(AuthAbilityGuard),
  )
}

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ currentUser: CurrentUserPayload }>()
  return request.currentUser
})

export const CurrentCognitoUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ cognito_jwt_payload: CurrentCognitoUserPayload }>()
  return request?.cognito_jwt_payload
})
