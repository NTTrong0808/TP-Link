export const decimalNumber = (val: number | string, customSymbol?: string) =>
  new Intl.NumberFormat()
    .format(Number(val || 0))
    .replace(/,/g, customSymbol ?? ".");

export const formatInternationalCurrency = (
  currency: string | number,
  customSymbol?: string
) => `${decimalNumber(currency, customSymbol)} đ`;

export type FormatInternationalCurrency = typeof formatInternationalCurrency;

export const removeCurrencySymbol = (value: string) =>
  value.replace(/[đ]/g, "").trim();

export const formatInternationalWithoutCurrency: FormatInternationalCurrency = (
  currency: string | number,
  customSymbol?: string
) => removeCurrencySymbol(formatInternationalCurrency(currency, customSymbol));

export const parseCurrencyToNumber = (value: string | number) =>
  Number(removeCurrencySymbol(value.toString()).replace(/[^0-9]/g, ""));

/**
 * Convert a number to Vietnamese formatted number
 * @param value - The number to convert
 * @returns Formatted string in Vietnamese number format
 * @example
 * toVietnameseNumber(10000000000) // "10 tỷ"
 * toVietnameseNumber(1000000000) // "1 tỷ"
 * toVietnameseNumber(100000000) // "100 tr"
 * toVietnameseNumber(10000) // "10k"
 */
export const toVietnameseNumber = (value: number): string => {
  if (typeof value !== "number") return "0";

  // Handle negative numbers
  const isNegative = value < 0;
  const absoluteValue = Math.abs(value);

  // Billion (tỷ)
  if (absoluteValue >= 1000000000) {
    const billions = absoluteValue / 1000000000;
    return `${isNegative ? "-" : ""}${billions.toFixed(billions % 1 === 0 ? 0 : 1)} tỷ`;
  }

  // Million (triệu)
  if (absoluteValue >= 1000000) {
    const millions = absoluteValue / 1000000;
    return `${isNegative ? "-" : ""}${millions.toFixed(millions % 1 === 0 ? 0 : 1)} tr`;
  }

  // Thousand (nghìn)
  if (absoluteValue >= 1000) {
    const thousands = absoluteValue / 1000;
    if (thousands >= 100) {
      return `${isNegative ? "-" : ""}${Math.floor(thousands)}k`;
    }
    return `${isNegative ? "-" : ""}${thousands.toFixed(thousands % 1 === 0 ? 0 : 1)}k`;
  }

  // Regular numbers
  return `${isNegative ? "-" : ""}${absoluteValue}`;
};

/**
 * Convert a number to Vietnamese formatted number with full text
 * @param value - The number to convert
 * @returns Formatted string in Vietnamese number format with full text
 * @example
 * toVietnameseNumberFull(10000000000) // "10 tỷ"
 * toVietnameseNumberFull(1000000000) // "1 tỷ"
 * toVietnameseNumberFull(100000000) // "100 triệu"
 * toVietnameseNumberFull(10000) // "10 nghìn"
 */
export const toVietnameseNumberFull = (value: number): string => {
  if (typeof value !== "number") return "0";

  // Handle negative numbers
  const isNegative = value < 0;
  const absoluteValue = Math.abs(value);

  // Billion (tỷ)
  if (absoluteValue >= 1000000000) {
    const billions = absoluteValue / 1000000000;
    return `${isNegative ? "-" : ""}${billions.toFixed(billions % 1 === 0 ? 0 : 1)} tỷ`;
  }

  // Million (triệu)
  if (absoluteValue >= 1000000) {
    const millions = absoluteValue / 1000000;
    return `${isNegative ? "-" : ""}${millions.toFixed(millions % 1 === 0 ? 0 : 1)} triệu`;
  }

  // Thousand (nghìn)
  if (absoluteValue >= 1000) {
    const thousands = absoluteValue / 1000;
    if (thousands >= 100) {
      return `${isNegative ? "-" : ""}${Math.floor(thousands)} nghìn`;
    }
    return `${isNegative ? "-" : ""}${thousands.toFixed(thousands % 1 === 0 ? 0 : 1)} nghìn`;
  }

  // Regular numbers
  return `${isNegative ? "-" : ""}${absoluteValue}`;
};
