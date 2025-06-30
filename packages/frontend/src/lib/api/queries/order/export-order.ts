import { downloadExcel } from '@/helper/excel'
import { appDayJs } from '@/utils/dayjs'
import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { consumerApi } from '../..'
import { GetOrderVariables } from './schema'

export interface Variables extends GetOrderVariables {}

export interface Response extends Blob {}

export interface Error extends AxiosError<Response> {}

export const exportOrder = async (variables?: Variables): Promise<Blob> => {
  const fileName = `${appDayJs().format('YYMMDDHHmm')}-BaoCaoDanhSachDonHang.xlsx`

  const params = Object.keys(variables || {}).reduce(
    (acc, key) => {
      const value = variables?.[key as keyof Variables]
      if (value) {
        if (Array.isArray(value)) {
          acc[key] = value.join(',')
          return acc
        }
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, any>,
  )

  const response = await consumerApi.get<Blob>(`/export/booking`, {
    params: params,
    responseType: 'blob',
    headers: {
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-store, max-age=0',
    },
  })

  downloadExcel(response, fileName)

  // const link = document.createElement("a");
  // link.href = URL.createObjectURL(response.data);
  // link.download = fileName;
  // link.click();
  // URL.revokeObjectURL(link.href);

  return response.data
}

export const exportOrderKey = exportOrder.name

export const useExportOrderMutation = createMutation<Response, Variables, any>({
  mutationFn: exportOrder,
})
