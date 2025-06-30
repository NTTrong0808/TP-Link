import { IAdvancedFilter } from '@/components/advanced-table/types'
import { appDayJs } from '@/utils/dayjs'
import { parseAsArrayOf, parseAsJson, parseAsString, useQueryStates } from 'nuqs'
import { z } from 'zod'

export interface Filter {
  createdBy?: string[]
  createdFrom?: string
  createdTo?: string
  saleChannelGroup?: string[]
  advancedFilters?: IAdvancedFilter[]
}

export const DEFAULT_FILTER: Filter = {
  createdBy: [],
  createdFrom: appDayJs().toISOString(),
  createdTo: appDayJs().toISOString(),
  saleChannelGroup: [],
  advancedFilters: [],
}

const FilterOperatorSchema = z.object({
  field: z.string(),
  operator: z.string(),
  value: z.any(),
})

const FilterTypeSchema = z.object({
  field: z.string(),
  value: z.any(),
})

const AdvancedFilterSchema = z.union([FilterOperatorSchema, FilterTypeSchema])

export const useFilter = <T extends Partial<Filter>>(defaultFilter?: T) => {
  const [filter, setFilter] = useQueryStates(
    {
      createdBy: parseAsArrayOf(z.string()).withDefault(defaultFilter?.createdBy ?? DEFAULT_FILTER.createdBy!),
      saleChannelGroup: parseAsArrayOf(z.string()).withDefault(
        defaultFilter?.saleChannelGroup ?? DEFAULT_FILTER.saleChannelGroup!,
      ),
      createdFrom: parseAsString.withDefault(defaultFilter?.createdFrom ?? DEFAULT_FILTER.createdFrom!),
      createdTo: parseAsString.withDefault(defaultFilter?.createdTo ?? DEFAULT_FILTER.createdTo!),
      advancedFilters: parseAsJson(z.array(AdvancedFilterSchema).parse).withDefault([]),
    },
    { history: 'replace', throttleMs: 300 },
  )

  return [filter, setFilter] as const
}
