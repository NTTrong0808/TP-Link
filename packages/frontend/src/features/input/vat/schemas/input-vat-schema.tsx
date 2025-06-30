import { phoneRegex, taxCodeRegex } from '@/constants/regex'
import { z } from 'zod'

const inputCustomerSchema = {
  customer: z.object({
    name: z
      .string({
        required_error: 'Tên công ty / cá nhân không được để trống',
      })
      .min(1, 'Tên công ty / cá nhân không được để trống'),
    icNumber: z.string({
      required_error: 'CCCD không được để trống',
    }),
    phone: z
      .string({
        required_error: 'Số điện thoại không được để trống',
      })
      .regex(phoneRegex, {
        message: 'Số điện thoại không đúng định dạng',
      }),
    email: z
      .string({
        required_error: 'Email không được để trống',
      })
      .email('Email không đúng định dạng'),
    note: z.string().optional(),
  }),
}

const inputCompanySchema = {
  vatInfo: z.object({
    legalName: z
      .string({
        required_error: 'Tên công ty / cá nhân không được để trống',
      })
      .min(1, 'Tên công ty / cá nhân không được để trống'),
    address: z
      .string({
        required_error: 'Địa chỉ không được để trống',
      })
      .min(1, 'Địa chỉ không được để trống'),
    receiverEmail: z
      .string({
        required_error: 'Email không được để trống',
      })
      .min(1, 'Email không được để trống')
      .email('Email không đúng định dạng'),
    note: z.string().optional(),
  }),
}

const baseInputSchema = {
  taxCode: z
    .string({
      required_error: 'Mã số thuế không được để trống',
    })
    .min(1, 'Mã số thuế không được để trống')
    .regex(taxCodeRegex, 'Mã số thuế không đúng định dạng'),
}

export const inputVatSchema = z.union([
  z.object({ ...inputCustomerSchema, ...baseInputSchema }),
  z.object({ ...inputCompanySchema, ...baseInputSchema }),
])

export type InputVatSchema = z.infer<typeof inputVatSchema>
