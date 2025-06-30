/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import dayjs from 'dayjs'
import vi from 'dayjs/locale/vi'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import timezone from 'dayjs/plugin/timezone'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.extend(localeData)
dayjs.extend(updateLocale)

dayjs.updateLocale('vi', {
  weekStart: 1,
})

dayjs.locale(vi)

export const TIMEZONE = 'Asia/Bangkok'

// dayjs.tz.setDefault("Asia/Saigon");
export const appDayJs = (...date: Parameters<typeof dayjs>) => {
  return dayjs?.(...date)?.tz?.(TIMEZONE)
}

export const appDayJsUnix = (unixTs: number) => {
  return dayjs.unix(unixTs)?.tz?.(TIMEZONE)
}

export const formatUnixTs = (unixTs: number, format = 'DD/MM/YYYY HH:mm'): string => {
  return dayjs.unix(unixTs).format(format)
}
