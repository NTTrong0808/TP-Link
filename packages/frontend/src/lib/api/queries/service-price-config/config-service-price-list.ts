import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { servicePriceConfigService } from '.';

export interface Variables {
  days: string[];
  servicePriceListId: string;
}

export interface Response
  extends Awaited<
    ReturnType<typeof servicePriceConfigService.configServicePriceList>
  > {}

export interface Error extends AxiosError<Response> {}

export const useConfigServicePriceList = createMutation<
  Response,
  Variables,
  any
>({
  mutationFn: (variables) =>
    servicePriceConfigService.configServicePriceList(
      variables.days,
      variables.servicePriceListId
    ),
});
