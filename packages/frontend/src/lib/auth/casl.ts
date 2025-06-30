import { AbilityBuilder, AnyAbility, PureAbility } from '@casl/ability'
import { createContextualCan, useAbility } from '@casl/react'
import { createContext } from 'react'
import { CASL_ACCESS_KEY } from './casl-key'

export const AbilityContext = createContext<AnyAbility>(new PureAbility())
export const Can = createContextualCan(AbilityContext.Consumer)

export function useAbilityInstance(): AnyAbility {
  return useAbility(AbilityContext)
}

export function updateAbility(ability: AnyAbility, permissionKeys: string[]) {
  const { can, rules } = new AbilityBuilder(PureAbility)
  permissionKeys.forEach((key) => {
    can(key)
  })
  ability.update(rules)
}

export function caslIsAbleTo(ability: AnyAbility, caslKey: string | boolean) {
  if (typeof caslKey === 'boolean') {
    return caslKey
  }

  if (ability.can(CASL_ACCESS_KEY.MANAGE_ALL_ACCESS)) {
    return true
  }

  return ability.can(caslKey)
}

export function useCanAccess() {
  const ability = useAbilityInstance()

  return (permissionKey?: boolean | string | string[]): boolean => {
    if (permissionKey === undefined) {
      return true
    }

    if (typeof permissionKey === 'boolean') {
      return permissionKey
    }

    if (Array.isArray(permissionKey)) {
      return permissionKey.some((key) => caslIsAbleTo(ability, key))
    }

    return caslIsAbleTo(ability, permissionKey)
  }
}
