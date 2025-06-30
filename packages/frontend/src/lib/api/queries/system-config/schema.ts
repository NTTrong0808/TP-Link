import { ManipulateType } from 'dayjs'
import { z } from 'zod'

export const systemConfigSchema = z.object({
  autoIssuedInvoiceTime: z.union([z.string(), z.number()]).optional(),
  autoIssuedInvoice: z.boolean().optional(),
  autoIssuedInvoiceTimeType: z.custom<ManipulateType>().optional(),
})

export type SystemConfig = z.infer<typeof systemConfigSchema>
