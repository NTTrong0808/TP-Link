import { appDayJs } from '@/utils/dayjs'
import { parseAsString, useQueryStates } from 'nuqs'
import { DATE_FORMAT } from '../constants'

export interface FilterReport {
  from?: string
  to?: string
}

export const useFilterReport = (defaultFilter?: FilterReport) => {
  const [filter, setFilter] = useQueryStates(
    {
      from: parseAsString.withDefault(defaultFilter?.from || appDayJs().format(DATE_FORMAT)),
      to: parseAsString.withDefault(defaultFilter?.to || appDayJs().format(DATE_FORMAT)),
    },
    {
      history: 'replace',
    },
  )

  return [filter, setFilter]
}
