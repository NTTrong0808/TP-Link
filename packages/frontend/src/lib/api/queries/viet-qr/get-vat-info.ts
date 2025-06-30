import { AxiosError } from 'axios'
import { createMutation, createQuery } from 'react-query-kit'
import { vietQRService } from '.'

export interface Response extends Awaited<ReturnType<typeof vietQRService.getCompanyInfo>> {}

export interface Error extends AxiosError<Response> {}

export const useGetVATInfo = createQuery<Response, { taxCode: string }, any>({
  queryKey: ['/business/:id'],
  fetcher: (variable) => vietQRService.getCompanyInfo(variable),
})

export const useMutateGetVatInfo = createMutation<Response, { taxCode: string }, any>({
  mutationFn: (variable) => vietQRService.getCompanyInfo(variable),
})
