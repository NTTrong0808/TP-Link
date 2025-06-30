import { AxiosError } from "axios";
import { createQuery } from "react-query-kit";
import { servicePriceListService, ServicePriceListService } from ".";

export interface Response
  extends Awaited<
    ReturnType<typeof servicePriceListService.getServicePriceListById>
  > {}

export interface Error extends AxiosError<Response> {}

export const useServicePriceListById = createQuery<
  Response,
  { servicePriceListId: string },
  any
>({
  queryKey: [ServicePriceListService.API_PATHS.GET_SERVICE_PRICE_LIST_BY_ID],
  fetcher: (variable) =>
    servicePriceListService.getServicePriceListById(
      variable.servicePriceListId
    ),
});
