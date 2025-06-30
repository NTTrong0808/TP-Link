import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { posTerminalService } from '.';
import { ICreatePosDto } from './schema';

export interface Variables {
  dto: ICreatePosDto;
}

export interface Response
  extends Awaited<ReturnType<typeof posTerminalService.createPos>> {}

export interface Error extends AxiosError<Response> {}

export const useCreatePos = createMutation<Response, Variables, any>({
  mutationFn: (variables) => posTerminalService.createPos(variables.dto),
});
