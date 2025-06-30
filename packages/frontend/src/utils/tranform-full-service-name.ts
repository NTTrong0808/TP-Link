import { ILCServiceWithPrice } from '@/lib/api/queries/service/schema'

export function transformFullServiceName(service: ILCServiceWithPrice) {
  return `${service?.title?.vi} (${service?.targetTitle?.vi}, ${
    service?.priceListTitle?.en === 'Default' ? '' : `${service?.priceListTitle?.vi}, `
  }${service?.saleChannelCode})`
}
