import { z } from 'zod'

export const FilterOperatorSchema = z.enum([
  'equal',
  'contain',
  'notContain',
  'startWith',
  'endWith',
  'empty',
  'lessThan',
  'lessThanEqual',
  'greaterThan',
  'greaterThanEqual',
  'notEmpty',
])

export const FilterDataTypeSchema = z.enum([
  'string',
  'number',
  'boolean',
  'objectId',
  'date',
  'dateUnix',
  'dateString',
])

export const FilterOperatorTypeSchema = z.object({
  field: z.string(),
  operator: FilterOperatorSchema,
  value: z.union([z.string(), z.number(), z.null()]).optional(),
  type: FilterDataTypeSchema.optional(),
})

export const FilterItemSchema = z.object({
  field: z.string(),
  value: z.union([z.string(), z.number(), z.null()]).optional(),
  type: FilterDataTypeSchema.optional(),
})

export const AdvancedFilterSchema = z.union([FilterOperatorTypeSchema, FilterItemSchema])

export type IFilterOperator = z.infer<typeof FilterOperatorSchema>

export type IFilterDataType = z.infer<typeof FilterDataTypeSchema>

export type IFilterOperatorType = z.infer<typeof FilterOperatorTypeSchema>

export type IFilterItem = z.infer<typeof FilterItemSchema>

export type IAdvancedFilter = z.infer<typeof AdvancedFilterSchema>

export type IFilterComponent = 'compare' | 'select'
