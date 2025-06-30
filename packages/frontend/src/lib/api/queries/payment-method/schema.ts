import { z } from 'zod'

export const CASH_PAYOO_TYPE = 'cash'

export enum PaymentMethodType {
  PREPAID = 'PREPAID',
  POSTPAID = 'POSTPAID',
}

export const bankAccountSchema = z.object({
  name: z.string().optional(),

  accountNumber: z
    .string({
      required_error: 'Số tài khoản không được để trống',
    })
    .min(1, 'Số tài khoản không được để trống'),
  accountName: z
    .string({
      required_error: 'Tên tài khoản không được để trống',
    })
    .min(1, 'Tên tài khoản không được để trống'),
  bankName: z.string().optional(),
  bankCode: z
    .string({
      required_error: 'Mã ngân hàng không được để trống',
    })
    .min(1, 'Mã ngân hàng không được để trống'),
  bankShortName: z.string().optional(),

  bankNumber: z.string().optional(),
  bankBranch: z.string().optional(),

  qrCode: z.string().optional(),
  note: z.string().optional(),
  available: z.boolean().optional(),
  _id: z.string().optional(),
})

export const paymentMethodSchema = z.object({
  _id: z.string(),
  name: z.string(),
  logoUrl: z.string(),
  payooType: z.string().optional(),
  available: z.boolean().optional(),
  paymentType: z.nativeEnum(PaymentMethodType),
  bankAccounts: z.array(bankAccountSchema).optional(),
})

export type PaymentMethod = z.infer<typeof paymentMethodSchema>
export type BankAccount = z.infer<typeof bankAccountSchema>
