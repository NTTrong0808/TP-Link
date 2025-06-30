import { z } from 'zod'

export const bankListSchema = z.object({
  name: z.string(),
  code: z.string(),
  bin: z.string(),
  short_name: z.string(),
  supported: z.boolean(),
})

export const bankListResponseSchema = z.object({
  no_banks: z.string().optional(),
  data: z.array(bankListSchema),
})

export type BankList = z.infer<typeof bankListSchema>
export type BankListResponse = z.infer<typeof bankListResponseSchema>
