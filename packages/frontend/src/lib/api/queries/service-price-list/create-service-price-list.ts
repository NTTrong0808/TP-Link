import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { servicePriceListService } from '.';
import { ICreateServicePriceListDto } from './types';

export interface Variables {
  dto: ICreateServicePriceListDto;
}

export interface Response
  extends Awaited<
    ReturnType<typeof servicePriceListService.createServicePriceList>
  > {}

export interface Error extends AxiosError<Response> {}

export const useCreateServicePriceList = createMutation<
  Response,
  Variables,
  any
>({
  mutationFn: (variables) =>
    servicePriceListService.createServicePriceList(variables.dto),
});
