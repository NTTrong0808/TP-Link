import isNil from 'lodash/isNil'
import { isValidObjectId } from 'mongoose'
import { appDayJs, appDayJsUnix } from '../dayjs'
import { toObjectId } from '../mongo/mongoose-utils'

type FilterOperator =
  | 'equal'
  | 'contain'
  | 'notContain'
  | 'startWith'
  | 'endWith'
  | 'empty'
  | 'notEmpty'
  | 'lessThan'
  | 'lessThanEqual'
  | 'greaterThan'
  | 'greaterThanEqual'

type FilterType = 'string' | 'number' | 'boolean' | 'objectId' | 'date' | 'dateUnix' | 'dateString'

export interface FilterItem {
  field: string
  operator?: FilterOperator
  value: unknown
  type?: FilterType
  format?: string
}

const DATE_FORMATS: Record<string, string> = {
  YMD_SLASH: 'YYYY/MM/DD',
  YMD_DASH: 'YYYY-MM-DD',
  DMY_DASH: 'DD-MM-YYYY',
  DMY_SLASH: 'DD/MM/YYYY',
}

// Hàm escape các ký tự đặc biệt trong regex
const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const processValueByType = ({
  value,
  type,
  format,
}: {
  value: unknown
  type?: FilterType
  format?: string
}): unknown => {
  //   if (!type) {
  //     if (typeof value === 'string' && !isNaN(Number(value))) {
  //       return Number(value)
  //     }
  //     return String(value)
  //   }

  switch (type) {
    case 'objectId':
      if (typeof value === 'string' && !isNaN(Number(value)) && isValidObjectId(value)) {
        return toObjectId(value)
      }
      return value
    case 'date':
      if (typeof value === 'string') {
        return format ? appDayJs(value).format(format) : appDayJs(value).toDate()
      }
      return value
    case 'dateUnix':
      if (typeof value === 'number') {
        return format ? appDayJsUnix(value).format(format) : appDayJsUnix(value).toDate()
      }
      return value
    case 'dateString':
      if (typeof value === 'string') {
        return format ? appDayJs(value, DATE_FORMATS).format(format) : appDayJs(value, DATE_FORMATS).toDate()
      }
      return value
    case 'number':
      return Number(value)
    case 'boolean':
      return Boolean(value)
    default:
      return String(value)
  }
}

const processOperator = (
  field: string,
  operator: FilterOperator,
  value: any,
  type?: FilterType,
  format?: string,
): Record<string, unknown> => {
  const processedValue = processValueByType({ value, type, format })
  switch (operator) {
    case 'equal':
      return type === 'date'
        ? {
            [field]: {
              $gte: appDayJs(processedValue as string | number | Date)
                .startOf('day')
                .toDate(),
              $lte: appDayJs(processedValue as string | number | Date)
                .endOf('day')
                .toDate(),
            },
          }
        : { [field]: processedValue }
    case 'contain':
      return typeof processedValue === 'string'
        ? { [field]: { $regex: escapeRegex(processedValue), $options: 'i' } }
        : { [field]: processedValue }
    case 'notContain':
      return typeof processedValue === 'string'
        ? { [field]: { $ne: { $regex: escapeRegex(processedValue), $options: 'i' } } }
        : { [field]: { $ne: processedValue } }
    case 'startWith':
      return typeof processedValue === 'string'
        ? { [field]: { $regex: `^${escapeRegex(processedValue)}`, $options: 'i' } }
        : { [field]: processedValue }
    case 'endWith':
      return typeof processedValue === 'string'
        ? { [field]: { $regex: `${escapeRegex(processedValue)}$`, $options: 'i' } }
        : { [field]: processedValue }
    case 'notEmpty':
      return {
        [field]: {
          $nin: [null, undefined, ''],
        },
      }
    case 'empty':
      return {
        [field]: {
          $in: [null, undefined, ''],
        },
      }
    case 'lessThan':
      return { [field]: { $lt: processedValue } }
    case 'lessThanEqual':
      return { [field]: { $lte: processedValue } }
    case 'greaterThan':
      return { [field]: { $gt: processedValue } }
    case 'greaterThanEqual':
      return { [field]: { $gte: processedValue } }
    default:
      return {}
  }
}

export const getAdvancedFilter = <T extends FilterItem[]>(advancedFilters: T) => {
  const filter: Record<string, unknown> = {}

  if (Array.isArray(advancedFilters)) {
    for (const filterItem of advancedFilters ?? []) {
      const { field, operator = 'equal', value, type, format } = filterItem
      if (isNil(value)) {
        continue
      }
      Object.assign(filter, processOperator(field, operator, value, type, format))
    }
  }

  return Object.keys(filter).length > 0 ? filter : undefined
}
