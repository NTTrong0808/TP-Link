import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { defaultVariables, getDashboardKey } from '@/lib/api/queries/dashboard/get-dashboard'
import { useRefreshDashboardMutation } from '@/lib/api/queries/dashboard/refresh-dashboard'
import { appDayJs } from '@/utils/dayjs'
import { useQueryClient } from '@tanstack/react-query'
import { OpUnitType } from 'dayjs'
import { RefreshCcwIcon } from 'lucide-react'
import { useUpdateEffect } from 'react-use'
import { DASHBOARD_TYPE_OPTIONS, DATE_FORMAT } from '../constants/constant'
import { useQueryDateRange, useQueryType } from '../hooks/use-query'

export interface OverallRootRangeProps {
  lastUpdated?: Date
}

const OverallRootRange = (props: OverallRootRangeProps) => {
  const [range, setRange] = useQueryDateRange()
  const [type] = useQueryType()

  const queryClient = useQueryClient()

  const { mutate: refreshDashboard, isPending: isRefreshing } = useRefreshDashboardMutation({
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [getDashboardKey] })
    },
  })

  const isValidType = DASHBOARD_TYPE_OPTIONS.some((opt) => opt.value === type) && type !== 'hour'

  useUpdateEffect(() => {
    if (isValidType) {
      setRange({
        from: appDayJs(range?.from || defaultVariables.from)
          .startOf(type as OpUnitType)
          .format(DATE_FORMAT),
        to: appDayJs(range?.to || defaultVariables.to)
          .endOf(type as OpUnitType)
          .format(DATE_FORMAT),
      })
    }
  }, [type])

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2">
      <DateRangePicker
        from={appDayJs(range.from).toDate()}
        to={appDayJs(range.to).toDate()}
        showIcon={false}
        onSelect={(data) => {
          if (data?.from) {
            setRange((prev) => ({
              ...prev,
              from: isValidType
                ? appDayJs(data.from)
                    .startOf(type as OpUnitType)
                    .format(DATE_FORMAT)
                : appDayJs(data.from).format(DATE_FORMAT),
            }))
          }

          if (data?.to) {
            setRange((prev) => ({
              ...prev,
              to: isValidType
                ? appDayJs(data.to)
                    .endOf(type as OpUnitType)
                    .format(DATE_FORMAT)
                : appDayJs(data.to).format(DATE_FORMAT),
            }))
          }
        }}
        className="w-full sm:w-fit"
      />
      <div className="flex items-center justify-center gap-1">
        {props.lastUpdated && (
          <div className="text-xs ">Cập nhật lần cuối: {appDayJs(props.lastUpdated).format('DD/MM/YYYY HH:mm')}</div>
        )}
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            refreshDashboard({})
          }}
          loading={isRefreshing}
        >
          <RefreshCcwIcon />
        </Button>
      </div>
    </div>
  )
}

export default OverallRootRange
