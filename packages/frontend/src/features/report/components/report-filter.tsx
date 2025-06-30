import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Field } from '@/components/ui/form'
import { useAdvancedFilter } from '@/hooks/use-advanced-filter'
import { PanelViewHeader } from '@/layouts/panel/panel-view'
import { appDayJs } from '@/utils/dayjs'
import { RefreshCcwIcon } from 'lucide-react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { ErrorBoundary } from 'react-error-boundary'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { DATE_FORMAT, DEFAULT_REPORT_FILTER, SALE_CHANNEL_GROUP } from '../constants'
import { AdvancedFilterReport } from '../types'
import ExportReportExcel from './export-report-excel'

export interface ReportFilterProps {
  disabled?: boolean
  loading?: boolean
  handleRefresh?: () => void
  handleClearFilters?: () => void
  handleExportReport?: (email: string) => void
}

const ReportFilter = ({
  disabled,
  loading,
  handleRefresh,
  handleClearFilters,
  handleExportReport,
}: ReportFilterProps) => {
  const [filter, setFilter] = useAdvancedFilter<AdvancedFilterReport>(DEFAULT_REPORT_FILTER)

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: filter.from ? appDayJs(filter.from).toDate() : undefined,
    to: filter.to ? appDayJs(filter.to).toDate() : undefined,
  })
  const form = useForm<AdvancedFilterReport>({
    defaultValues: filter,
  })

  const [wSaleChannelGroup] = useWatch({
    control: form.control,
    name: ['saleChannelGroup'],
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
      saleChannelGroup: wSaleChannelGroup,
      from: dateRange?.from ? appDayJs(dateRange?.from).format(DATE_FORMAT) : '',
      to: dateRange?.to ? appDayJs(dateRange?.to).format(DATE_FORMAT) : '',
    })
    handleRefresh?.()
  }

  return (
    <ErrorBoundary fallback={<div>Lỗi khi tải dữ liệu bộ lọc</div>}>
      <FormProvider {...form}>
        <PanelViewHeader
          action={handleExportReport ? <ExportReportExcel handleSubmit={handleExportReport} isLoading={false} /> : null}
        >
          <div className="flex shrink-0 gap-3">
            <Field
              name="saleChannelGroup"
              component="select"
              placeholder="Tất cả"
              options={SALE_CHANNEL_GROUP}
              disabled={disabled}
              value={filter?.saleChannelGroup}
            />
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
              disabled={disabled}
            />
            {handleRefresh ? (
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
            ) : null}

            {handleClearFilters ? (
              <Button isLoading={loading} onClick={() => handleClearFilters?.()} variant="outline" className="bg-white">
                Xóa bộ lọc
              </Button>
            ) : null}
          </div>
        </PanelViewHeader>
      </FormProvider>
    </ErrorBoundary>
  )
}

export default ReportFilter
