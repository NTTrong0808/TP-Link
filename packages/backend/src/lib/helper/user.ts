import { get } from 'lodash'

export function replaceAccent(vieString = '') {
  if (!vieString) return ''
  const result = vieString
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'))

  return result
}

export function normalizeVie(vieStr = '', upper = true): string {
  if (!vieStr) return ''
  const result = replaceAccent(vieStr)
  return upper ? result.toUpperCase().trim() : result.toLowerCase().trim()
}

export function getSearchValue<T>(data: T, fields: (keyof T)[]) {
  const propertyValues: string[] = fields.map((p) => get(data, p, '') as string)
  const newSearchValue = normalizeVie(propertyValues.join(' '), false)
  // replace - and , to whitespace -> remove all text that starts with {{ and ends with }} ->  replace 2 whitespace to 1
  return newSearchValue
    .replace(/[-,]/g, ' ')
    .replace(/\{\{.*?\}\}/g, '')
    .replace(/ {2,}/g, ' ')
    .trim()
}
