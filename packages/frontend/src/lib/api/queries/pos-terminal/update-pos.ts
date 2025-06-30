import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { posTerminalService } from '.';
import { IUpdatePosDto } from './schema';

export interface Variables {
  id: string;
  dto: IUpdatePosDto;
}

export interface Response
  extends Awaited<ReturnType<typeof posTerminalService.update>> {}

export interface Error extends AxiosError<Response> {}

export const useUpdatePos = createMutation<Response, Variables, any>({
  mutationFn: (variables) =>
    posTerminalService.update(variables.id, variables.dto),
});
