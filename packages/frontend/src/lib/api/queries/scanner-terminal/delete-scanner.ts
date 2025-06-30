import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { scannerTerminalService } from '.'

export interface Variables {
  scannerId: string
}

export interface Response extends Awaited<ReturnType<typeof scannerTerminalService.deleteScanner>> {}

export interface Error extends AxiosError<Response> {}

export const useDeleteScanner = createMutation<Response, Variables, any>({
  mutationFn: (variables) => scannerTerminalService.deleteScanner(variables.scannerId),
})
