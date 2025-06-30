import isNil from 'lodash/isNil'

export const formatCurrency = (value?: number, options?: Intl.NumberFormatOptions, locale = 'vi-VN') => {
  if (isNil(value) || isNaN(value)) return '-'
  if (!isNaN(value) && value === 0) return '0'
  return new Intl.NumberFormat(locale, { useGrouping: true, maximumFractionDigits: 0, ...options }).format(value)
}
