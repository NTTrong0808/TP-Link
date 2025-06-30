import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { servicePriceConfigService } from '.';

export interface Variables {
  date: string;
  servicePriceListId: string;
}

export interface Response
  extends Awaited<
    ReturnType<typeof servicePriceConfigService.removeConfigServicePriceList>
  > {}

export interface Error extends AxiosError<Response> {}

export const useRemoveConfigServicePriceList = createMutation<
  Response,
  Variables,
  any
>({
  mutationFn: (variables) =>
    servicePriceConfigService.removeConfigServicePriceList(
      variables.date,
      variables.servicePriceListId
    ),
});
