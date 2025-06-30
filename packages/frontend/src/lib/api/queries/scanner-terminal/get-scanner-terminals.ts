import { AxiosError } from 'axios'
import { createQuery } from 'react-query-kit'
import { ScannerTerminalService, scannerTerminalService } from '.'

export interface Response extends Awaited<ReturnType<typeof scannerTerminalService.getScannerTerminals>> {}

export interface Error extends AxiosError<Response> {}

export const useGetScannerTerminals = createQuery<
  Response,
  {
    search?: string
    page?: number
    pageSize?: number
    status?: string[]
  },
  any
>({
  queryKey: [ScannerTerminalService.API_PATHS.GET_SCANNER_TERMINALS],
  fetcher: (variables) => scannerTerminalService.getScannerTerminals(variables),
})
