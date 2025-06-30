import { ApiResponse } from '@/lib/api/schema'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { createMutation } from 'react-query-kit'
import { IImportProductVariantDto } from './type'

export interface Variables {
  productVariants: IImportProductVariantDto[]
}

export interface Response extends ApiResponse<[]> {}

export interface Error extends AxiosError<Response> {}

export const importProductVariants = async (variables?: Variables): Promise<Response> => {
  const response: AxiosResponse<Response | Blob, any> | null = await axios.post<Blob>(
    `${process.env.NEXT_PUBLIC_API_URL}/product-variants/import`,
    variables,
  )

  return response?.data as Response
}

export const useImportProductVariants = createMutation<Response, Variables, any>({
  mutationFn: importProductVariants,
})
