import { CustomerType } from '@/lib/api/queries/customer/schema'

export const STATUS_OPTIONS = [
  { value: 'true', label: 'Hoạt động' },
  { value: 'false', label: 'Ngừng hoạt động' },
]

export const TYPE_OPTIONS = [
  { value: CustomerType.TA, label: 'Đại lý' },
  { value: CustomerType.RT, label: 'Bán lẻ' },
]

export const STATUS_OPTIONS_MAP = new Map(STATUS_OPTIONS.map((s) => [s.value, s]))
export const TYPE_OPTIONS_MAP = new Map(TYPE_OPTIONS.map((s) => [s.value, s]))
