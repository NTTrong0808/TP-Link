import { URLS } from '@/constants/urls'

export const getInputVatUrl = (bookingId: string, bookingVatToken: string) => {
  return `${process.env.NEXT_PUBLIC_TICKET_URL}${URLS.VAT.INDEX.replace(':bookingId', bookingId).replace(
    ':bookingVatToken',
    bookingVatToken,
  )}`
}
