import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'
import { z } from 'zod'

export const useFilter = () => {
  const [filter, setFilter] = useQueryStates(
    {
      paymentMethodId: parseAsArrayOf(z.string()).withDefault([]),
      status: parseAsArrayOf(z.string()).withDefault([]),
      vat: parseAsArrayOf(z.string()).withDefault([]),
      totalPaidFrom: parseAsString.withDefault(''),
      totalPaidTo: parseAsString.withDefault(''),
    },
    { history: 'replace' },
  )

  return [filter, setFilter] as const
}
