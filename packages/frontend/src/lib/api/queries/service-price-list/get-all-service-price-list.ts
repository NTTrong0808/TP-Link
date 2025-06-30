import { AxiosError } from "axios";
import { createQuery } from "react-query-kit";
import { servicePriceListService, ServicePriceListService } from ".";

export interface Response
  extends Awaited<
    ReturnType<typeof servicePriceListService.getAllServicePriceList>
  > {}

export interface Error extends AxiosError<Response> {}

export const useServicePriceList = createQuery<Response, {}, any>({
  queryKey: [ServicePriceListService.API_PATHS.GET_ALL_SERVICE_PRICE_LIST],
  fetcher: () => servicePriceListService.getAllServicePriceList(),
});
