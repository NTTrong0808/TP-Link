import { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';
import { PosTerminalService, posTerminalService } from '.';

export interface Response
  extends Awaited<ReturnType<typeof posTerminalService.getPosTerminals>> {}

export interface Error extends AxiosError<Response> {}

export const useGetTerminals = createQuery<
  Response,
  {
    search?: string;
    page?: number;
    pageSize?: number;
    status?: string[];
  },
  any
>({
  queryKey: [PosTerminalService.API_PATHS.GET_POS_TERMINALS],
  fetcher: (variables) => posTerminalService.getPosTerminals(variables),
});
