import { appDayJs } from '@/utils/dayjs'

export const DATE_FORMAT = 'YYYY-MM-DD'

export const SALE_CHANNEL_GROUP = [
  // {
  //   label: 'Tất cả',
  //   value: 'ALL',
  // },
  {
    label: 'Online',
    value: 'ONLINE',
  },
  {
    label: 'Offline',
    value: 'OFFLINE',
  },
]

export const SALE_CHANNEL_GROUP_MAP = new Map(SALE_CHANNEL_GROUP.map((s) => [s?.value, s]))

export const DEFAULT_REPORT_FILTER = {
  from: appDayJs().startOf('day').format(DATE_FORMAT),
  to: appDayJs().endOf('day').format(DATE_FORMAT),
  saleChannelGroup: '',
  sortOrder: 'desc' as const,
}
