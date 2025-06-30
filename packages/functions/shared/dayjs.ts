import dayjs from 'dayjs'
import vi from 'dayjs/locale/vi'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import timezone from 'dayjs/plugin/timezone'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'
export const TIMEZONE = 'Asia/Bangkok'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.extend(localeData)
dayjs.extend(updateLocale)
dayjs.updateLocale('vi', {
  weekStart: 1,
})
dayjs.locale(vi)

export const appDayJs = (...date: Parameters<typeof dayjs>) => {
  return dayjs?.(...date)?.tz?.(TIMEZONE)
}
