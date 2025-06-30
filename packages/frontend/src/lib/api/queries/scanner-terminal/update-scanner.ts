import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { scannerTerminalService } from '.'
import { IUpdateScannerDto } from './schema'

export interface Variables {
  id: string
  dto: IUpdateScannerDto
}

export interface Response extends Awaited<ReturnType<typeof scannerTerminalService.update>> {}

export interface Error extends AxiosError<Response> {}

export const useUpdateScanner = createMutation<Response, Variables, any>({
  mutationFn: (variables) => scannerTerminalService.update(variables.id, variables.dto),
})
