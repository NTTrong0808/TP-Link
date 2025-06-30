import { caslIsAbleTo, useAbilityInstance } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'

const useConfigurationPermissions = () => {
  const caslAbility = useAbilityInstance()

  const isHavePermissionViewPos = caslIsAbleTo(caslAbility, CASL_ACCESS_KEY.TICKET_POS_TERMINAL_VIEW)
  const isHavePermissionViewSaleChannel = caslIsAbleTo(caslAbility, CASL_ACCESS_KEY.TICKET_SALE_CHANNEL_VIEW)
  const isHavePermissionViewPaymentMethod = caslIsAbleTo(caslAbility, CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_VIEW)
  const isHavePermissionTogglePaymentMethod = caslIsAbleTo(caslAbility, CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_TOGGLE)
  const isHavePermissionCreatePos = caslIsAbleTo(caslAbility, CASL_ACCESS_KEY.TICKET_POS_TERMINAL_CREATE)
  const isHavePermissionUpdatePos = caslIsAbleTo(caslAbility, CASL_ACCESS_KEY.TICKET_POS_TERMINAL_UPDATE)
  const isHavePermissionDeletePos = caslIsAbleTo(caslAbility, CASL_ACCESS_KEY.TICKET_POS_TERMINAL_DELETE)

  return {
    isHavePermissionViewPos,
    isHavePermissionViewSaleChannel,
    isHavePermissionViewPaymentMethod,
    isHavePermissionTogglePaymentMethod,
    isHavePermissionCreatePos,
    isHavePermissionUpdatePos,
    isHavePermissionDeletePos,
  }
}

export default useConfigurationPermissions
