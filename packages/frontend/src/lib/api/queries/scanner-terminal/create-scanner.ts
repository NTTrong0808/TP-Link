import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { scannerTerminalService } from '.'
import { ICreateScannerDto } from './schema'

export interface Variables {
  dto: ICreateScannerDto
}

export interface Response extends Awaited<ReturnType<typeof scannerTerminalService.createScanner>> {}

export interface Error extends AxiosError<Response> {}

export const useCreateScanner = createMutation<Response, Variables, any>({
  mutationFn: (variables) => scannerTerminalService.createScanner(variables.dto),
})
