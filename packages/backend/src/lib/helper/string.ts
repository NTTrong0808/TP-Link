export const fuzzyString = (str: string, position: 'start' | 'end' = 'start') => {
  const charMap: Record<string, string> = {
    a: '[aáàảãạăắằẳẵặâấầẩẫậAÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬ]',
    e: '[eéèẻẽẹêếềểễệEÉÈẺẼẸÊẾỀỂỄỆ]',
    i: '[iíìỉĩịIÍÌỈĨỊ]',
    o: '[oóòỏõọôốồổỗộơớờởỡợOÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢ]',
    u: '[uúùủũụưứừửữựUÚÙỦŨỤƯỨỪỬỮỰ]',
    y: '[yýỳỷỹỵYÝỲỶỸỴ]',
    d: '[dđDĐ]',
  }

  const getCharMapKey = (char: string) => {
    for (const [key, value] of Object.entries(charMap)) {
      if (value.includes(char)) {
        return key
      }
    }
    return null
  }

  let modifiedRegexPattern = str
    .trim()
    .split('')
    .map((char: string) => {
      const key = getCharMapKey(char)
      return key ? charMap[key] : char.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    })
    .join('')
    .replace(/\s+/g, ' ')

  if (str?.startsWith('+84') || str?.startsWith('84') || str?.startsWith('0')) {
    modifiedRegexPattern = modifiedRegexPattern.replace(/^(\+84|84|0)/, '')
  }
  switch (position) {
    case 'start':
      return new RegExp(`^${modifiedRegexPattern}`, 'i')
    case 'end':
      return new RegExp(`${modifiedRegexPattern}$`, 'i')
  }

  return new RegExp(modifiedRegexPattern, 'i')
}
