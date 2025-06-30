import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { servicePriceListService } from '.';
import { ICreateServicePriceListDto } from './types';

export interface Variables {
  servicePriceListId: string;
}

export interface Response
  extends Awaited<
    ReturnType<typeof servicePriceListService.deleteServicePriceList>
  > {}

export interface Error extends AxiosError<Response> {}

export const useDeleteServicePriceList = createMutation<
  Response,
  Variables,
  any
>({
  mutationFn: (variables) =>
    servicePriceListService.deleteServicePriceList(
      variables.servicePriceListId
    ),
});
