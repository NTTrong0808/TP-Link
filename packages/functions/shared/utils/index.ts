export function isISODateString(value: any): boolean {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value)
  );
}

export function normalizeDateFilters(
  obj: Record<string, any>
): Record<string, any> {
  if (!obj || typeof obj !== 'object') return obj;

  const normalized: Record<string, any> = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];

    // Nếu là object con (ví dụ: $gte, $lte, $in, $or...)
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      normalized[key] = normalizeDateFilters(value);
    }
    // Nếu là array → xử lý từng phần tử
    else if (Array.isArray(value)) {
      normalized[key] = value.map((v) =>
        isISODateString(v) ? new Date(v) : normalizeDateFilters(v)
      );
    }
    // Nếu là string ISO date → chuyển thành Date
    else if (isISODateString(value)) {
      normalized[key] = new Date(value);
    }
    // Trường hợp khác → giữ nguyên
    else {
      normalized[key] = value;
    }
  }

  return normalized;
}
