import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthAbilityGuard implements CanActivate {

  constructor(private readonly refactor: Reflector) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const currentUser = request.currentUser
    const permissionKeys = this.refactor.get('permissionKeys', context.getHandler()) as string[]

    if (!currentUser) {
      return false
    }

    if (permissionKeys?.length <= 0) {
      return true
    }

    const role = currentUser?.role

    if (!role) {
      return false
    }

    return role.permissionKeys.some(pmKey => permissionKeys.includes(pmKey))

  }
}
