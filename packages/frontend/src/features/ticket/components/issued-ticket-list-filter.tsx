'use client'

import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { DATE_FORMAT } from '@/features/report/constants'
import { useAdvancedFilter } from '@/hooks/use-advanced-filter'
import { PanelViewHeader } from '@/layouts/panel/panel-view'
import { getAllIssuedTicketWithPaginationKey } from '@/lib/api/queries/order/get-all-issued-ticket'
import { appDayJs } from '@/utils/dayjs'
import { useQueryClient } from '@tanstack/react-query'
import { RefreshCcwIcon } from 'lucide-react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { ErrorBoundary } from 'react-error-boundary'
import { FormProvider, useForm } from 'react-hook-form'
import { TICKET_LIST_FILTER_DEFAULT_VALUE } from '../constants'
import { useTotalTicket } from '../hooks/use-total-ticket'
import { AdvancedFilterTicket } from '../types'

export interface IssuedTicketListFilterProps {
  loading?: boolean
  handleClearFilters?: () => void
}

const IssuedTicketListFilter = ({ loading, handleClearFilters }: IssuedTicketListFilterProps) => {
  const queryClient = useQueryClient()

  const { total } = useTotalTicket()

  const [filter, setFilter] = useAdvancedFilter(TICKET_LIST_FILTER_DEFAULT_VALUE)

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: filter.from ? appDayJs(filter.from).toDate() : undefined,
    to: filter.to ? appDayJs(filter.to).toDate() : undefined,
  })

  const form = useForm<AdvancedFilterTicket>({
    defaultValues: filter,
  })

  // useUpdateEffect(() => {
  //   setFilter({
  //     ...filter,
  //     saleChannelGroup: wSaleChannelGroup,
  //   })
  // }, [wSaleChannelGroup])

  const handleGetData = () => {
    setFilter({
      ...filter,

      from: dateRange?.from ? appDayJs(dateRange?.from).format(DATE_FORMAT) : '',
      to: dateRange?.to ? appDayJs(dateRange?.to).format(DATE_FORMAT) : '',
    })

    queryClient.invalidateQueries({ queryKey: [getAllIssuedTicketWithPaginationKey] })
  }

  return (
    <ErrorBoundary fallback={<div>Lỗi khi tải dữ liệu bộ lọc</div>}>
      <FormProvider {...form}>
        <PanelViewHeader>
          <div className="flex shrink-0 gap-3">
            <DateRangePicker
              showIcon={false}
              from={filter?.from ? appDayJs(filter?.from).toDate() : undefined}
              to={filter?.to ? appDayJs(filter?.to).toDate() : undefined}
              onSelect={(range: DateRange | undefined) => {
                setDateRange({
                  from: range?.from ? appDayJs(range?.from).toDate() : undefined,
                  to: range?.to ? appDayJs(range?.to).toDate() : undefined,
                })
              }}
              placeholder="Chọn ngày"
            />

            <div className="flex items-center gap-1 text-sm text-neutral-grey-400">
              <div className="px-2 py-1 rounded-sm bg-neutral-grey-100 text-sm font-medium text-black">
                {total ?? 0}
              </div>
              vé
            </div>

            <Button
              loading={loading}
              onClick={() => handleGetData()}
              variant="outline"
              className="bg-white"
              type="submit"
            >
              <RefreshCcwIcon />
              Lấy dữ liệu
            </Button>

            {handleClearFilters ? (
              <Button loading={loading} onClick={() => handleClearFilters?.()} variant="outline" className="bg-white">
                Xóa bộ lọc
              </Button>
            ) : null}
          </div>
        </PanelViewHeader>
      </FormProvider>
    </ErrorBoundary>
  )
}

export default IssuedTicketListFilter
