import { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';
import { ServicePriceConfigService, servicePriceConfigService } from '.';

export interface Response
  extends Awaited<
    ReturnType<
      typeof servicePriceConfigService.getServicePriceConfigsByMonthYear
    >
  > {}

export interface Error extends AxiosError<Response> {}

export const useServicePriceConfigByMonthYear = createQuery<
  Response,
  {
    month: number;
    year: number;
  },
  any
>({
  queryKey: [
    ServicePriceConfigService.API_PATHS.GET_SERVICE_PRICE_CONFIG_BY_MONTH,
  ],
  fetcher: (variables) =>
    servicePriceConfigService.getServicePriceConfigsByMonthYear(
      variables.month,
      variables.year
    ),
});
