import { IFilterItem, IFilterOperatorType } from '@/components/advanced-table/types'
import { z } from 'zod'

export const apiParamsSchema = z.object({
  page: z.number().default(0).optional(),
  size: z.number().default(10).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export const apiMetaSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  total: z.number().optional(),
  totalPages: z.number().optional(),
  hasNextPage: z.boolean().optional(),
  hasPrevPage: z.boolean().optional(),
  pageSize: z.number().optional(),
})

export const apiResponseSchema = z.object({
  status: z.boolean(),
  statusCode: z.number(),
  path: z.string(),
  data: z.unknown(),
  message: z.string(),
  timestamp: z.string(),
  meta: apiMetaSchema,
})

export type ApiResponse<T> = z.infer<typeof apiResponseSchema> & {
  data: T
}

export type ApiMeta = z.infer<typeof apiMetaSchema>

export type ApiParams = z.infer<typeof apiParamsSchema> & {
  [x: string]: unknown
} & {
  advancedFilters?: (IFilterOperatorType | IFilterItem)[]
}
