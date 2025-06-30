import { z } from 'zod'

export enum CustomerType {
  TA = 'TA',
  RT = 'RT',
}

export const customerSchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  taxCode: z.string().optional(),
  companyEmail: z.string().optional(),
  companyName: z.string().optional(),
  address: z.string().optional(),
  bankNumber: z.string().optional(),
  bankName: z.string().optional(),
  bankBranch: z.string().optional(),
  isActive: z.boolean().optional(),
  type: z.string(),
  icNumber: z.string().optional(),
  contract: z.string().optional(),
})

export const customerHistorySchema = z.object({
  _id: z.string(),
  changeAt: z.date(),
  changeBy: z.string(),
  changeByName: z.string(),
  changeId: z.string(),
  collectionName: z.string(),
  actionType: z.string(),
  oldData: z.record(z.string(), z.any()),
  newData: z.record(z.string(), z.any()),
  changes: z.record(z.string(), z.array(z.any())),
})

export type ILCCustomerHistory = z.infer<typeof customerHistorySchema>

export type ILCCustomer = z.infer<typeof customerSchema> & {
  _id: string
  createdAt: Date
  updatedAt: Date
}

export interface GetCustomerVariables {
  size?: number
  page?: number
  search?: string
  type?: CustomerType[]
  isActive?: boolean[]
  status?: boolean[]
}

export interface UpdateCustomerDto {
  name?: string
  phone?: string
  email?: string
  taxCode?: string
  companyName?: string
  companyEmail?: string
  companyAddress?: string
  bankNumber?: string
  bankName?: string
  bankBranch?: string
  isActive?: boolean
  type?: CustomerType
  icNumber?: string
}

export interface CreateCustomerDto {
  name: string
  phone: string
  email: string
  taxCode?: string
  companyName?: string
  companyEmail?: string
  companyAddress?: string
  bankNumber?: string
  bankName?: string
  bankBranch?: string
  isActive?: boolean
  type?: CustomerType
  icNumber?: string
  contract?: string
}
