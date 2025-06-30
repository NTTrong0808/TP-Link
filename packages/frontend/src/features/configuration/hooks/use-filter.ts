import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'
import { z } from 'zod'

export const useFilter = () => {
  const [filter, setFilter] = useQueryStates(
    {
      status: parseAsArrayOf(z.string()).withDefault([]),
      search: parseAsString.withDefault(''),
    },
    { history: 'replace' },
  )

  return [filter, setFilter] as const
}
