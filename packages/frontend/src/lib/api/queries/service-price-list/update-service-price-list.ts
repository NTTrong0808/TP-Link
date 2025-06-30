import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { servicePriceListService } from '.'
import { ICreateServicePriceListDto } from './types'

export interface Variables {
  servicePriceListId: string
  priceConfigs: Record<string, number>
  priceConfigServiceCodes: Record<string, string>
}

export interface Response extends Awaited<ReturnType<typeof servicePriceListService.updateServicePriceList>> {}

export interface Error extends AxiosError<Response> {}

export const useUpdateServicePriceList = createMutation<Response, Variables, any>({
  mutationFn: (variables) =>
    servicePriceListService.updateServicePriceList(
      variables.servicePriceListId,
      variables.priceConfigs,
      variables.priceConfigServiceCodes,
    ),
})
