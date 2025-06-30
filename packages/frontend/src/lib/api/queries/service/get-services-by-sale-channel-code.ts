import { AxiosError } from 'axios'
import { createQuery } from 'react-query-kit'
import { ServiceService, serviceService } from '.'

export interface Response extends Awaited<ReturnType<typeof serviceService.getServicesBySaleChannelCode>> {}

export interface Error extends AxiosError<Response> {}

export const SALE_CHANNEL_TA_CODE = 'TA'
export const SALE_CHANNEL_RETAIL_CODE = 'RT'
export const SALE_CHANNEL_WS = 'WS'

export const useServicesBySaleChannelCode = createQuery<Response, { date: string; saleChannelCode: string }, any>({
  queryKey: [ServiceService.API_PATHS.GET_SERVICES_BY_SALE_CHANNEL_CODE],
  fetcher: (variables) => serviceService.getServicesBySaleChannelCode(variables),
})
