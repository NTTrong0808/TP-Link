'use client'

import { AdvancedFilterSchema, IAdvancedFilter } from '@/components/advanced-table/types'
import { UseQueryStateOptions, useQueryStates } from 'nuqs'

import { parseAsArrayOf, parseAsBoolean, parseAsFloat, parseAsJson, parseAsString, Parser } from 'nuqs/server'
import { z } from 'zod'

const getParser = (value: any): Parser<any> => {
  switch (typeof value) {
    case 'string':
      return parseAsString.withDefault(value)
    case 'number':
      return parseAsFloat.withDefault(value)
    case 'boolean':
      return parseAsBoolean.withDefault(value)
    case 'object':
      if (Array.isArray(value)) {
        return parseAsArrayOf(z.any()).withDefault(value)
      }
      return parseAsJson(z.array(AdvancedFilterSchema).parse).withDefault(value)
    default:
      return parseAsString.withDefault(value)
  }
}

type AdvancedFilterProps<T> = T & {
  advancedFilters?: IAdvancedFilter[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface UseAdvancedFilterProps<T> {
  defaultFilter?: AdvancedFilterProps<T>
  options?: UseQueryStateOptions<Record<string, any>>
}

export type UseAdvancedFilterGetReturn<T> = AdvancedFilterProps<T>

export type UseAdvancedFilterSetReturn<T> = (
  value: AdvancedFilterProps<T> | ((prev: AdvancedFilterProps<T>) => AdvancedFilterProps<T>),
) => void

export type UseAdvancedFilterReturn<T> = [UseAdvancedFilterGetReturn<T>, UseAdvancedFilterSetReturn<T>]

export const useAdvancedFilter = <T extends Record<string, any>>(
  defaultFilter = {} as AdvancedFilterProps<T>,
  options?: UseQueryStateOptions<Record<string, any>>,
): UseAdvancedFilterReturn<T> => {
  const { advancedFilters, ...rest } = defaultFilter
  const [filter, setFilter] = useQueryStates(
    {
      advancedFilters: parseAsJson(z.array(AdvancedFilterSchema).catch([]).parse).withDefault(advancedFilters ?? []),
      sortBy: parseAsString.withDefault(defaultFilter?.defaultSortBy ?? '_id'),
      sortOrder: parseAsString.withDefault(defaultFilter?.defaultSortOrder ?? 'desc'),
      ...Object.keys(rest ?? {})?.reduce((acc, key) => {
        acc[key] = getParser(rest[key])
        return acc
      }, {} as Record<string, Parser<any>>),
    },
    {
      history: options?.history ?? 'replace',
      throttleMs: 320,
      shallow: true,
      ...options,
    },
  )

  return [
    filter as AdvancedFilterProps<T>,
    setFilter as (value: AdvancedFilterProps<T> | ((prev: AdvancedFilterProps<T>) => AdvancedFilterProps<T>)) => void,
  ]
}
