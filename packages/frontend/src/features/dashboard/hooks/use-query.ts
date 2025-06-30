import { defaultVariables } from '@/lib/api/queries/dashboard/get-dashboard'
import { appDayJs } from '@/utils/dayjs'
import { parseAsString, useQueryState, useQueryStates } from 'nuqs'

export const useQueryType = () => {
  const [type, setType] = useQueryState(
    'type',
    parseAsString.withDefault('day').withOptions({
      history: 'replace',
    }),
  )

  return [type, setType] as const
}

export const useQueryDateRange = () => {
  const [dateRange, setDateRange] = useQueryStates(
    {
      // default current
      from: parseAsString.withDefault(appDayJs(defaultVariables.from).format('YYYY-MM-DD')),
      to: parseAsString.withDefault(appDayJs(defaultVariables.to).format('YYYY-MM-DD')),
    },
    {
      throttleMs: 300,
      history: 'replace',
    },
  )

  return [dateRange, setDateRange] as const
}
