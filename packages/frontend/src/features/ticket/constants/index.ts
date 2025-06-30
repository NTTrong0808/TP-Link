import { appDayJs } from '@/utils/dayjs'

export const DATE_FORMAT = 'YYYY-MM-DD'

export const TICKET_LIST_FILTER_DEFAULT_VALUE = {
  from: appDayJs().startOf('day').format(DATE_FORMAT),
  to: appDayJs().endOf('day').format(DATE_FORMAT),
}
