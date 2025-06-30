import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useConfigServicePriceList } from '@/lib/api/queries/service-price-config/config-service-price-list'
import { useServicePriceConfigByMonthYear } from '@/lib/api/queries/service-price-config/get-service-price-config-by-month-year'
import { useServicePriceList } from '@/lib/api/queries/service-price-list/get-all-service-price-list'
import { useQueryClient } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { usePriceConfigContext } from './price-config-context'

export interface PriceConfigDistributionProps {}

export const PriceConfigDistributionSchema = z.object({
  servicePriceListId: z.string({
    message: 'Vui lòng chọn bảng giá dịch vụ',
  }),
})

export type PriceConfigDistributionSchema = z.infer<typeof PriceConfigDistributionSchema>

const PriceConfigDistribution = (props: PriceConfigDistributionProps) => {
  const { selectedPriceConfigs, setSelectedPriceConfigs } = usePriceConfigContext()
  const { data, isLoading } = useServicePriceList()
  const queryClient = useQueryClient()
  const methods = useForm<PriceConfigDistributionSchema>({})
  const { mutate: configServicePriceList, isPending } = useConfigServicePriceList({
    onSuccess() {
      toastSuccess('Cấu hình thành công')
      setSelectedPriceConfigs([])
      queryClient.invalidateQueries({
        queryKey: useServicePriceConfigByMonthYear.getKey(),
      })
    },
  })
  const handleSubmit = methods.handleSubmit((values) => {
    if (!values.servicePriceListId) {
      toastError('Vui lòng chọn bảng giá dịch vụ')
      return
    }
    if (!selectedPriceConfigs.length) {
      toastError('Vui lòng chọn ngày để cấu hình!')
      return
    }
    configServicePriceList({
      days: selectedPriceConfigs.map((ticket) => ticket.date),
      servicePriceListId: values?.servicePriceListId,
    })
  })

  return (
    <FormProvider {...methods}>
      <form className="w-full" onSubmit={handleSubmit}>
        <p className="mb-4 text-base font-medium text-neutral-black">Chọn cấu hình</p>

        <div className="flex flex-col gap-4">
          <Field
            name="servicePriceListId"
            component="select"
            type="number"
            className="w-full"
            placeholder="Chọn bảng giá vé"
            options={data?.map((e) => ({ label: e?.title?.vi, value: e?._id })) ?? []}
          />

          <Button size="sm" type="submit" disabled={isPending || isLoading}>
            Xác nhận
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default PriceConfigDistribution
