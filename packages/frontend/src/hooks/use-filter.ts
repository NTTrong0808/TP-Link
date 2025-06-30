import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'
import { z } from 'zod'

export interface Filter {
  status?: string[]
  role?: string[]
  vat?: string[]
  paymentMethodId?: string[]
  createdBy?: string[]
  saleChannelId?: string[]
  totalPaidFrom?: string
  totalPaidTo?: string
  printCount?: string
  createdFrom?: string
  createdTo?: string
  saleChannelGroup?: string[]
}

const dateFormat = 'YYYY-MM-DD'

export const DEFAULT_FILTER: Filter = {
  status: [],
  role: [],
  vat: [],
  paymentMethodId: [],
  createdBy: [],
  saleChannelId: [],
  totalPaidFrom: '',
  totalPaidTo: '',
  printCount: '',
  createdFrom: '',
  createdTo: '',
  saleChannelGroup: [],
}

export const useFilter = <T extends Partial<Filter>>(defaultFilter?: T) => {
  const [filter, setFilter] = useQueryStates(
    {
      status: parseAsArrayOf(z.string()).withDefault(defaultFilter?.status ?? DEFAULT_FILTER.status!),
      role: parseAsArrayOf(z.string()).withDefault(defaultFilter?.role ?? DEFAULT_FILTER.role!),
      vat: parseAsArrayOf(z.string()).withDefault(defaultFilter?.vat ?? DEFAULT_FILTER.vat!),
      paymentMethodId: parseAsArrayOf(z.string()).withDefault(
        defaultFilter?.paymentMethodId ?? DEFAULT_FILTER.paymentMethodId!,
      ),
      createdBy: parseAsArrayOf(z.string()).withDefault(defaultFilter?.createdBy ?? DEFAULT_FILTER.createdBy!),
      saleChannelId: parseAsArrayOf(z.string()).withDefault(
        defaultFilter?.saleChannelId ?? DEFAULT_FILTER.saleChannelId!,
      ),
      saleChannelGroup: parseAsArrayOf(z.string()).withDefault(
        defaultFilter?.saleChannelGroup ?? DEFAULT_FILTER.saleChannelGroup!,
      ),
      totalPaidFrom: parseAsString.withDefault(defaultFilter?.totalPaidFrom ?? DEFAULT_FILTER.totalPaidFrom!),
      totalPaidTo: parseAsString.withDefault(defaultFilter?.totalPaidTo ?? DEFAULT_FILTER.totalPaidTo!),
      printCount: parseAsString.withDefault(defaultFilter?.printCount ?? DEFAULT_FILTER.printCount!),
      createdFrom: parseAsString.withDefault(defaultFilter?.createdFrom ?? DEFAULT_FILTER.createdFrom!),
      createdTo: parseAsString.withDefault(defaultFilter?.createdTo ?? DEFAULT_FILTER.createdTo!),
    },
    { history: 'replace', throttleMs: 300 },
  )

  return [filter, setFilter] as const
}
