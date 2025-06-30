import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { posTerminalService } from '.';

export interface Variables {
  posId: string;
}

export interface Response
  extends Awaited<ReturnType<typeof posTerminalService.deletePos>> {}

export interface Error extends AxiosError<Response> {}

export const useDeletePos = createMutation<Response, Variables, any>({
  mutationFn: (variables) => posTerminalService.deletePos(variables.posId),
});
