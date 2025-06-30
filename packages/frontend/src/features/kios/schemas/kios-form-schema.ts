import { icNumberRegex, noVietnameseRegex, phoneRegex } from '@/constants/regex'
import { z } from 'zod'

export const KIOS_TYPE = {
  PERSONAL: 'PERSONAL',
  COMPANY: 'COMPANY',
} as const

export const KIOS_TYPE_LABEL = {
  [KIOS_TYPE.PERSONAL]: 'Cá nhân',
  [KIOS_TYPE.COMPANY]: 'Công ty',
} as const

export type KiosTypeEnum = (typeof KIOS_TYPE)[keyof typeof KIOS_TYPE]
export type KiosTypeLabelEnum = (typeof KIOS_TYPE_LABEL)[keyof typeof KIOS_TYPE_LABEL]

const strictVatSchema = {
  taxCode: z.string().min(1, 'Mã số thuế không được để trống').trim(),
  companyName: z.string().min(1, 'Tên công ty không được để trống').trim(),
  address: z.string().min(1, 'Địa chỉ không được để trống').trim(),
  email: z
    .string({
      required_error: 'Email không được để trống',
    })
    .min(1, 'Email không được để trống')
    .trim()
    .email('Email không hợp lệ'),

  note: z.string().optional(),
}

const optionalVatSchemaObj = {
  ...strictVatSchema,
  taxCode: z.string().trim().optional(),
  companyName: z.string().trim().optional(),
  address: z.string().trim().optional(),
  email: z.string().trim().optional(),
}

const strictCustomerSchema = {
  name: z
    .string({
      required_error: 'Tên khách hàng không được để trống',
    })
    .min(1, 'Tên khách hàng không được để trống')
    .trim(),
  icNumber: z.string().trim().regex(icNumberRegex, 'Số CCCD phải có đúng 12 chữ số').or(z.literal('')),
  address: z.string().trim().optional(),
  email: z.string().trim().email('Email không hợp lệ').optional().or(z.literal('')),
  phone: z.string().trim().regex(phoneRegex, 'Số điện thoại không hợp lệ').optional().or(z.literal('')),
  note: z.string().trim().optional(),
}

const optionalCustomerSchema = {
  ...strictCustomerSchema,
  name: z.string().trim().optional(),
}

const baseFormSchema = {
  type: z
    .enum([KIOS_TYPE.PERSONAL, KIOS_TYPE.COMPANY], {
      required_error: 'Vui lòng chọn đối tượng',
    })
    .default(KIOS_TYPE.COMPANY)
    .optional(),
  requireCustomer: z.boolean().default(false),
  requireVat: z.boolean().default(false),

  newCustomer: z.object(optionalCustomerSchema).optional(),
  customer: z.object(optionalCustomerSchema).optional(),
  vat: z.object(optionalVatSchemaObj).optional(),

  ta: z.string().trim().optional(),
  note: z.string().trim().optional(),
  paymentNote: z
    .string()
    .max(39, 'Ghi chú thanh toán không được vượt quá 39 ký tự')
    .regex(noVietnameseRegex, 'Vui lòng nhập chữ không dấu và không chứa ký tự đặc biệt')
    .trim()
    .optional(),
  paymentMethod: z.string().min(1, 'Vui lòng chọn phương thức thanh toán').trim(),
  bankAccount: z.string().trim().optional(),
  quantity: z.record(
    z.string().trim(),
    z.preprocess((val) => (val ? val : 0), z.number().min(0, 'Số lượng không được âm')),
  ),
}

const newCustomerSchema = z.discriminatedUnion('requireCustomer', [
  z.object({
    ...baseFormSchema,

    newCustomer: z.object(strictCustomerSchema),

    requireCustomer: z.literal(true),
    requireVat: z.literal(false),
  }),
  z.object({
    ...baseFormSchema,

    newCustomer: z.object(optionalCustomerSchema),

    requireCustomer: z.literal(false),
    requireVat: z.literal(false),
  }),
])

const vatSchema = z.discriminatedUnion('type', [
  z.object({
    ...baseFormSchema,
    type: z.literal(KIOS_TYPE.COMPANY),

    vat: z.object(strictVatSchema),

    requireCustomer: z.literal(false),
    requireVat: z.literal(true),
  }),
  z.object({
    ...baseFormSchema,
    type: z.literal(KIOS_TYPE.PERSONAL),

    customer: z.object(strictCustomerSchema),

    requireCustomer: z.literal(false),
    requireVat: z.literal(true),
  }),
])

export const kiosFormSchema = z.union([vatSchema, newCustomerSchema])

export const kiosCustomerFormSchema = z.object(strictCustomerSchema)

export const kiosVatFormSchema = z.object(strictVatSchema)

export type KiosFormSchemaType = z.infer<typeof kiosFormSchema>

export type KiosCustomerFormSchemaType = z.infer<typeof kiosCustomerFormSchema>

export type KiosVatFormSchemaType = z.infer<typeof kiosVatFormSchema>
