'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useServicePriceConfigByMonthYear } from '@/lib/api/queries/service-price-config/get-service-price-config-by-month-year'
import { useRemoveConfigServicePriceList } from '@/lib/api/queries/service-price-config/remove-config-service-price-list'
import { useRemoveConfigServicePriceListADay } from '@/lib/api/queries/service-price-config/remove-config-service-price-list-a-day'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { getVietnamHoliday } from '@/utils/holiday'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { usePriceConfigContext } from './price-config-context'
export interface PriceConfigCalendarProps {}

const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

const PriceConfigCalendar = (props: PriceConfigCalendarProps) => {
  const isCanAccess = useCanAccess()
  const { currentDate, priceConfigs, selectedPriceConfigs, setSelectedPriceConfigs, isLoadingServicePriceConfig } =
    usePriceConfigContext()

  const queryClient = useQueryClient()

  const { mutate: removeConfigServicePriceList } = useRemoveConfigServicePriceList({
    onError() {
      toastError('Gỡ cấu hình thất bại')
    },
    onSuccess() {
      queryClient
        .invalidateQueries({
          queryKey: useServicePriceConfigByMonthYear.getKey(),
        })
        .then(() => toastSuccess('Gỡ cấu hình thành công'))
    },
  })

  const { mutate: removeConfigServicePriceListADay } = useRemoveConfigServicePriceListADay({
    onError() {
      toastError('Gỡ cấu hình thất bại')
    },
    onSuccess() {
      queryClient
        .invalidateQueries({
          queryKey: useServicePriceConfigByMonthYear.getKey(),
        })
        .then(() => toastSuccess('Gỡ cấu hình thành công'))
    },
  })

  const id = currentDate.format('MM/YYYY')

  const days = dayjs(currentDate).daysInMonth()

  const daysArray = Array.from({ length: days }, (_, index) => index + 1)

  const isToday = (day: number) => {
    return dayjs().date() === day && dayjs().format('MM/YYYY') === id
  }

  const onRemoveConfigServicePriceList = (date: string, servicePriceListId: string) => {
    removeConfigServicePriceList({
      date,
      servicePriceListId,
    })
  }

  const onRemoveConfigServicePriceListADay = (date: string, servicePriceListId: string) => {
    removeConfigServicePriceListADay({
      date,
      servicePriceListId,
    })
  }

  const canConfigServicePriceByDate = isCanAccess(CASL_ACCESS_KEY.TICKET_CONFIG_SERVICE_PRICE_BY_DATE)

  return (
    <section className="grid grid-cols-7 p-0 bg-white  rounded-b-lg">
      {daysArray.map((day) => {
        const dayFormatted = day < 10 ? `0${day}` : day
        const dayOfWeek = daysOfWeek[dayjs(currentDate).date(day).format('d') as unknown as number]

        const currentPriceConfigByDate = priceConfigs.find((config) => config.id === `${dayFormatted}/${id}`)

        const checked = selectedPriceConfigs.findIndex((config) => config.id === currentPriceConfigByDate?.id) !== -1
        const date = dayjs(`${dayFormatted}/${id}`)
        // const isConfigable =
        //   (dayjs(date).isSame(dayjs(), 'day') ||
        //     dayjs(date).isAfter(dayjs(), 'day')) &&
        //   (dayjs(date).isSame(dayjs().add(60, 'days'), 'day') ||
        //     dayjs(date).isBefore(dayjs().add(60, 'days'), 'day'));
        const holiday = getVietnamHoliday(currentPriceConfigByDate?.date)
        return (
          <div
            key={`${day}/${id}`}
            className={cn(
              'group flex h-48 flex-col border border-neutral-grey-100 p-4',
              canConfigServicePriceByDate && 'cursor-pointer',
            )}
          >
            <div
              onClick={() => {
                if (!currentPriceConfigByDate) return
                if (!canConfigServicePriceByDate) return
                if (!checked) {
                  setSelectedPriceConfigs([...selectedPriceConfigs, currentPriceConfigByDate])
                } else {
                  setSelectedPriceConfigs(
                    selectedPriceConfigs.filter((config) => config.id !== currentPriceConfigByDate.id),
                  )
                }
              }}
              className="flex items-center justify-start gap-2"
            >
              <p className={cn(isToday(day) ? 'text-primary-orange-400' : 'text-neutral-grey-400')}>{dayFormatted}</p>
              <p className="text-neutral-grey-300">{dayOfWeek}</p>

              {canConfigServicePriceByDate && (
                <div
                  className={cn(
                    'ml-auto',
                    selectedPriceConfigs.find((e) => e.id === currentPriceConfigByDate?.id)
                      ? ''
                      : 'hidden group-hover:block',
                  )}
                >
                  <Checkbox
                    className={cn(
                      // "hover:[&_.ant-checkbox-inner]:!border-primary-orange-400",
                      '[&_.ant-checkbox-checked_.ant-checkbox-inner]:!bg-primary-orange-400',
                      '[&_.ant-checkbox-checked_.ant-checkbox-inner]:!border-primary-orange-400',
                    )}
                    disabled={!canConfigServicePriceByDate}
                    checked={checked}
                  />
                </div>
              )}
            </div>
            {holiday && <p className="text-sm text-[#616161] mt-auto mb-1">{holiday}</p>}

            {currentPriceConfigByDate?.isDefault ? (
              <p
                className={cn(
                  'text-lg font-medium text-[#616161] px-3 py-1 border-[1px] border-[#EAEAEA] bg-[#F5F5F5] rounded-md',
                  !holiday && 'mt-auto',
                )}
              >
                {currentPriceConfigByDate?.title}
              </p>
            ) : canConfigServicePriceByDate ? (
              <Popover>
                <PopoverTrigger
                  className={cn(
                    'text-lg font-medium text-[#388D3D] px-3 py-1 border-[1px] border-[#C1DCC3] bg-[#EBF4EC] rounded-md',
                    currentPriceConfigByDate?.isRepeat && ' border-[#E0BEE5] bg-[#F5E2F9] text-[#9F67A9]',
                    !holiday && 'mt-auto',
                  )}
                >
                  <p className="text-start">{currentPriceConfigByDate?.title}</p>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="end" alignOffset={-150} className="w-fit p-0">
                  <div
                    onClick={() =>
                      currentPriceConfigByDate?.id &&
                      onRemoveConfigServicePriceListADay(
                        currentPriceConfigByDate?.id,
                        currentPriceConfigByDate?.servicePriceListId,
                      )
                    }
                    className="px-4 py-3 text-sm text-black bg-white hover:cursor-pointer border-b-[1px] border-[#EAEAEA]"
                  >
                    Gỡ cấu hình này
                  </div>
                  <div
                    onClick={() =>
                      currentPriceConfigByDate?.id &&
                      onRemoveConfigServicePriceList(
                        currentPriceConfigByDate?.id,
                        currentPriceConfigByDate?.servicePriceListId,
                      )
                    }
                    className="px-4 py-3 text-sm text-secondary-strawberry-300 bg-white hover:cursor-pointer"
                  >
                    Gỡ tất cả cấu hình
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <p
                className={cn(
                  'text-lg text-start font-medium text-[#388D3D] px-3 py-1 border-[1px] border-[#C1DCC3] bg-[#EBF4EC] rounded-md',
                  currentPriceConfigByDate?.isRepeat && ' border-[#E0BEE5] bg-[#F5E2F9] text-[#9F67A9]',
                  !holiday && 'mt-auto',
                )}
              >
                {currentPriceConfigByDate?.title}
              </p>
            )}
          </div>
        )
      })}
    </section>
  )
}

export default PriceConfigCalendar
