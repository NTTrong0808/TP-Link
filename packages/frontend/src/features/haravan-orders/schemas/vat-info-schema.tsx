import { phoneRegex, taxCodeRegex } from '@/constants/regex'
import { z } from 'zod'

export const VAT_TYPE = {
  PERSONAL: 'PERSONAL',
  COMPANY: 'COMPANY',
} as const

export const VAT_TYPE_LABEL = {
  [VAT_TYPE.PERSONAL]: 'Cá nhân',
  [VAT_TYPE.COMPANY]: 'Công ty',
} as const

export const VAT_INFO_FIELDS = {
  TYPE: 'type',
  TAX_CODE: 'taxCode',
  COMPANY: {
    LEGAL_NAME: 'vatInfo.legalName',
    ADDRESS: 'vatInfo.address',
    RECEIVER_EMAIL: 'vatInfo.receiverEmail',
    NOTE: 'vatInfo.note',
  },
  CUSTOMER: {
    NAME: 'customer.name',
    IC_NUMBER: 'customer.icNumber',
    PHONE: 'customer.phone',
    ADDRESS: 'customer.address',
    EMAIL: 'customer.email',
    NOTE: 'customer.note',
  },
} as const

const customerVatSchema = {
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
    address: z.string().optional(),
    note: z.string().optional(),
  }),
}

const companyVatSchema = {
  vatInfo: z.object({
    legalName: z
      .string({
        required_error: 'Tên công ty không được để trống',
      })
      .min(1, 'Tên công ty không được để trống'),
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
  type: z
    .enum([VAT_TYPE.PERSONAL, VAT_TYPE.COMPANY], {
      required_error: 'Vui lòng chọn đối tượng',
    })
    .default(VAT_TYPE.COMPANY)
    .optional(),
  taxCode: z
    .string({
      required_error: 'Mã số thuế không được để trống',
    })
    .min(1, 'Mã số thuế không được để trống')
    .regex(taxCodeRegex, 'Mã số thuế không đúng định dạng'),
}

export const vatInfoSchema = z.discriminatedUnion('type', [
  z.object({ ...companyVatSchema, ...baseInputSchema, type: z.literal(VAT_TYPE.COMPANY) }),
  z.object({ ...customerVatSchema, ...baseInputSchema, type: z.literal(VAT_TYPE.PERSONAL) }),
])

export const companyVatInfoSchema = z.object(companyVatSchema)

export const customerVatInfoSchema = z.object(customerVatSchema)

export type CompanyVatInfo = z.infer<typeof companyVatInfoSchema>
export type CustomerVatInfo = z.infer<typeof customerVatInfoSchema>

export type VatInfoSchema = z.infer<typeof vatInfoSchema>
