import { z } from 'zod'

export const orderListFilterSchema = z.object({
  search: z.string().optional(),
  status: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  vat: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  paymentMethodId: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  saleChannelId: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  createdBy: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  totalPaidFrom: z.string().optional(),
  totalPaidTo: z.string().optional(),
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
})

export type OrderListFilterType = z.infer<typeof orderListFilterSchema>
