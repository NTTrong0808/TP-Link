export const getCellValue = (value: any) => {
  if (!value) return ''
  if (typeof value === 'object') {
    if ('text' in value) return String(value.text).trim()
    if ('richText' in value && Array.isArray(value.richText)) {
      return value.richText
        .map((t: any) => t.text)
        .join('')
        .trim()
    }
    return JSON.stringify(value) // fallback
  }
  return String(value).trim()
}
