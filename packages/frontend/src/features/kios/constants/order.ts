import { KIOS_TYPE, KiosFormSchemaType } from '../schemas/kios-form-schema'
import { paymentMethodKey } from './payment-method'

export const defaultOrderFormData = {
  ta: '',
  vat: {
    taxCode: '',
    companyName: '',
    address: '',
    note: '',
  },
  customer: {
    name: '',
    icNumber: '',
    phone: '',
    email: '',
  },
  newCustomer: {
    name: '',
    icNumber: '',
    phone: '',
    email: '',
  },
  type: KIOS_TYPE.COMPANY,
  paymentMethod: paymentMethodKey.CASH,
  quantity: {},
  note: '',
  paymentNote: '',
  requireVat: false,
  requireCustomer: false,
} as KiosFormSchemaType
