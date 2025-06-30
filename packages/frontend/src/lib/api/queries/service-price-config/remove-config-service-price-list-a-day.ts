import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { servicePriceConfigService } from '.';

export interface Variables {
  date: string;
  servicePriceListId: string;
}

export interface Response
  extends Awaited<
    ReturnType<
      typeof servicePriceConfigService.removeConfigServicePriceListADay
    >
  > {}

export interface Error extends AxiosError<Response> {}

export const useRemoveConfigServicePriceListADay = createMutation<
  Response,
  Variables,
  any
>({
  mutationFn: (variables) =>
    servicePriceConfigService.removeConfigServicePriceListADay(
      variables.date,
      variables.servicePriceListId
    ),
});
