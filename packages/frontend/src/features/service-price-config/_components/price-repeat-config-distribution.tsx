import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useConfigServicePriceList } from '@/lib/api/queries/service-price-config/config-service-price-list'
import { useServicePriceConfigByMonthYear } from '@/lib/api/queries/service-price-config/get-service-price-config-by-month-year'
import { useServicePriceList } from '@/lib/api/queries/service-price-list/get-all-service-price-list'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import MonthCalendar from './month-calendar'
import { usePriceConfigContext } from './price-config-context'
import WeekCalendar from './week-calendar'
import YearCalendar from './year-calendar'

export interface PriceConfigDistributionProps {}

export enum RepeatType {
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  YEARLY = 'YEARLY',
}

export const PriceConfigDistributionSchema = z.object({
  servicePriceListId: z.string({
    message: 'Vui lòng chọn bảng giá dịch vụ',
  }),
  repeatType: z.string(),
})

export type PriceConfigDistributionSchema = z.infer<typeof PriceConfigDistributionSchema>

const repeatOptions = [
  {
    label: 'Hàng tuần',
    value: RepeatType.WEEKLY,
  },
  {
    label: 'Hàng tháng',
    value: RepeatType.MONTHLY,
  },
  {
    label: 'Hàng năm',
    value: RepeatType.YEARLY,
  },
]

const PriceRepeatConfigDistribution = (props: PriceConfigDistributionProps) => {
  const { selectedPriceConfigs, setSelectedPriceConfigs } = usePriceConfigContext()
  const { data, isLoading } = useServicePriceList()
  const queryClient = useQueryClient()
  const methods = useForm<PriceConfigDistributionSchema>({
    defaultValues: {
      repeatType: RepeatType.WEEKLY,
    },
  })
  const [days, setDays] = useState<{
    monthDays?: string[]
    weekDays?: string[]
    dates?: string[]
  }>()

  const repeatType = methods.watch('repeatType')
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
    if (!values.repeatType) {
      toastError('Vui lòng chọn loại lặp lại!')
      return
    }
    if (values.repeatType === RepeatType.WEEKLY && (!days?.weekDays || days?.weekDays?.length === 0)) {
      toastError('Vui lòng chọn thứ trong tuần!')
      return
    }
    if (values.repeatType === RepeatType.MONTHLY && (!days?.monthDays || days?.monthDays?.length === 0)) {
      toastError('Vui lòng chọn ngày trong tháng!')
      return
    }
    if (values.repeatType === RepeatType.YEARLY && (!days?.dates || days?.dates?.length === 0)) {
      toastError('Vui lòng chọn ngày trong năm!')
      return
    }
    let _days: string[] = []
    if (values.repeatType === RepeatType.YEARLY && days?.dates) {
      _days = days?.dates
    } else if (values.repeatType === RepeatType.WEEKLY && days?.weekDays) {
      _days = days?.weekDays
    } else if (values.repeatType === RepeatType.MONTHLY && days?.monthDays) {
      _days = days?.monthDays
    }

    configServicePriceList({
      days: _days,
      servicePriceListId: values?.servicePriceListId,
    })
  })

  const handleChangeDays = ({
    monthDays,
    weekDays,
    dates,
  }: {
    monthDays?: string[]
    weekDays?: string[]
    dates?: string[]
  }) => {
    if (monthDays) setDays({ monthDays })
    if (weekDays) setDays({ weekDays })
    if (dates) setDays({ dates })
  }

  return (
    <FormProvider {...methods}>
      <form className="w-full" onSubmit={handleSubmit}>
        <p className="mb-4 text-base font-medium text-neutral-black">Cấu hình vé</p>

        <div className="flex flex-col gap-4">
          <Field
            name="servicePriceListId"
            component="select"
            type="number"
            label="Chọn cấu hình"
            className="w-full"
            placeholder="Chọn bảng giá vé"
            options={data?.map((e) => ({ label: e?.title?.vi, value: e?._id })) ?? []}
          />
          <Field
            name="repeatType"
            component="select"
            label="Lặp lại theo"
            className="w-full"
            placeholder="Chọn bảng giá vé"
            options={repeatOptions}
          />
          {repeatType === RepeatType.WEEKLY && (
            <WeekCalendar
              onChangeWeekDays={(days) =>
                handleChangeDays({
                  weekDays: days,
                })
              }
            />
          )}
          {repeatType === RepeatType.MONTHLY && (
            <MonthCalendar
              onChangeMonthDays={(days) =>
                handleChangeDays({
                  monthDays: days,
                })
              }
            />
          )}
          {repeatType === RepeatType.YEARLY && (
            <YearCalendar
              onChangeDates={(days) =>
                handleChangeDays({
                  dates: days,
                })
              }
            />
          )}
          <Button size="sm" type="submit" disabled={isPending || isLoading}>
            Xác nhận
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default PriceRepeatConfigDistribution
