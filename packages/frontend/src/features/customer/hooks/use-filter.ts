import { parseAsArrayOf, useQueryStates } from 'nuqs'
import { z } from 'zod'

export const useFilter = () => {
  const [filter, setFilter] = useQueryStates(
    {
      type: parseAsArrayOf(z.string()).withDefault([]),
      status: parseAsArrayOf(z.string()).withDefault([]),
    },
    { history: 'replace' },
  )

  return [filter, setFilter] as const
}
