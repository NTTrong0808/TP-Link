import { z } from 'zod'
import { ILocalizedText } from './types'

export const serviceSchema = z.object({
  shortTitle: z.object({
    vi: z.string(),
    en: z.string(),
  }),
  title: z.object({
    vi: z.string(),
    en: z.string(),
  }),
  invoiceTitle: z.string().optional(),
  invoiceUnit: z.string(), // Gói, Vé, ...
  description: z
    .object({
      vi: z.string(),
      en: z.string(),
    })
    .optional(),
  image: z.string(),
  isActive: z.boolean(),
  isDeleted: z.boolean(),
  createdBy: z.string().optional(),
  createdByName: z.string().optional(),
  position: z.number().optional(),
  note: z.string().optional(),
  termsOfUseId: z.string(),
  type: z.string(),
  childServiceIds: z.array(z.string()).optional(),
  childServiceNumOfUses: z.any().optional(),
})

export type ILCService = z.infer<typeof serviceSchema> & {
  _id: string
  createdAt: Date
  updatedAt: Date
}

export interface ILCServiceWithPrice extends ILCService {
  targetTitle: ILocalizedText
  targetShortTitle: ILocalizedText
  priceListTitle: ILocalizedText
  targetDescription: ILocalizedText
  price: number
  priceConfigId: string
  targetId: string
  saleChannelCode: string
  saleChannelId: string
  saleChannelName: string
  serviceCode: string
}
