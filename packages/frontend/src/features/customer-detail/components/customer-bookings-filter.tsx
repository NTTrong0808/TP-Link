'use client'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PanelViewHeader } from '@/layouts/panel/panel-view'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, FilterIcon, PlusIcon } from 'lucide-react'
import { ComponentProps } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useDebounce } from 'react-use'
import { z } from 'zod'
import { useFilter } from '../hooks/use-filter'
import { useTotalCustomers } from '../hooks/use-total-customers'
import { cn } from '@/lib/tw'
import { CustomerType } from '@/lib/api/queries/customer/schema'
import { BookingStatus } from '@/lib/api/queries/booking/schema'
import { usePaymentMethods } from '@/lib/api/queries/payment-method/get-payment-methods'

const vatOptions = [
  { value: 'VAT', label: 'Có' },
  { value: 'NO_VAT', label: 'Không' },
]

const statusOptions = [
  { value: BookingStatus.CANCELLED, label: 'Đã huỷ' },
  { value: BookingStatus.COMPLETED, label: 'Hoàn thành' },
  { value: BookingStatus.PROCESSING, label: 'Đang xử lý' },
]

const statusOptionsMap = new Map(statusOptions.map((s) => [s.value, s]))

const vatOptionsMap = new Map(vatOptions.map((s) => [s.value, s]))

export const schema = z.object({
  status: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  paymentMethodId: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  vat: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  totalPaidFrom: z.string().optional(),
  totalPaidTo: z.string().optional(),
})

export interface CustomerListFilterProps extends ComponentProps<typeof PanelViewHeader> {}

const CustomerBookingsFilter = (props: CustomerListFilterProps) => {
  const { total } = useTotalCustomers()

  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = usePaymentMethods()
  const [filter, setFilter] = useFilter()

  const paymentMethodOptions = (paymentMethods?.data ?? [])?.map((e) => ({
    label: e?.name,
    value: e?._id,
  }))

  const paymentMethodOptionsMap = new Map(paymentMethodOptions.map((s) => [s.value, s]))

  const defaultStatus = filter.status?.map((s) => statusOptionsMap.get(s as BookingStatus))?.filter(Boolean) || []
  const defaultPaymentMethod =
    filter.paymentMethodId?.map((s) => paymentMethodOptionsMap.get(s as CustomerType))?.filter(Boolean) || []

  const defaultVAT = filter.vat?.map((s) => vatOptionsMap.get(s as CustomerType))?.filter(Boolean) || []

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: defaultStatus,
      paymentMethodId: defaultPaymentMethod,
      vat: defaultVAT,
      totalPaidFrom: filter?.totalPaidFrom ?? undefined,
      totalPaidTo: filter?.totalPaidTo ?? undefined,
    },
  })

  const [wStatus, wPaymentMethod, wVat, wTotalPaidFrom, wTotalPaidTo] = useWatch({
    control: form.control,
    name: ['status', 'paymentMethodId', 'vat', 'totalPaidFrom', 'totalPaidTo'],
  })

  useDebounce(
    () => {
      setFilter({ status: wStatus?.map((s) => s.value) })
      setFilter({ paymentMethodId: wPaymentMethod?.map((s) => s.value) })
      setFilter({ vat: wVat?.map((s) => s.value) })
      setFilter({ totalPaidFrom: wTotalPaidFrom ?? '' })
      setFilter({ totalPaidTo: wTotalPaidTo ?? '' })
    },
    300,
    [wStatus, wPaymentMethod, wVat, wTotalPaidFrom, wTotalPaidTo],
  )

  const hasFiltered = filter.status?.length > 0

  return (
    <ErrorBoundary
      fallback={
        <div className="text-semantic-danger-300 p-2 flex items-center gap-4">
          <AlertCircle className="size-5 mr-2" />
          Lỗi khi tải dữ liệu bộ lọc
        </div>
      }
    >
      <FormProvider {...form}>
        <PanelViewHeader title="Danh sách" badge={total} className="h-15">
          <div className="flex shrink-0 gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="lg" variant="outline" className="bg-neutral-white">
                  <FilterIcon
                    className={cn('size-5 mr-2 text-neutral-grey-300', hasFiltered ? 'fill-neutral-grey-300' : null)}
                  />
                  Bộ lọc
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0 w-[400px]">
                <section className="px-4 py-2 border-b border-low">
                  <h2 className="text-base font-medium leading-6 text-neutral-black">Bộ lọc</h2>
                </section>
                <section className="p-4 flex flex-col gap-4">
                  <Label className="flex items-center gap-4">
                    <span className="w-20 shrink-0 font-medium">Giá trị ĐH:</span>
                    <div className="w-full flex items-center gap-1">
                      <Field component="text" name="totalPaidFrom" placeholder="Từ" className="w-full flex-1" />
                      <span className=" text-sm text-[#A7A7A7]">-</span>
                      <Field component="text" name="totalPaidTo" placeholder="Đến" className="w-full flex-1" />
                    </div>
                  </Label>
                  <Label className="flex items-center gap-4">
                    <span className="w-20 shrink-0 font-medium">PTTT:</span>
                    <div className="w-full">
                      <Field
                        component="multiselect"
                        name="paymentMethodId"
                        options={paymentMethodOptions}
                        placeholder="Chọn PTTT"
                        emptyIndicator="Không có PTTT"
                        className="w-full"
                      />
                    </div>
                  </Label>

                  <Label className="flex items-center gap-4">
                    <span className="w-20 shrink-0 font-medium">Trạng thái:</span>
                    <div className="w-full">
                      <Field
                        component="multiselect"
                        name="status"
                        options={statusOptions}
                        placeholder="Chọn trạng thái"
                        emptyIndicator="Không có trạng thái"
                        className="w-full"
                      />
                    </div>
                  </Label>

                  <Label className="flex items-center gap-4">
                    <span className="w-20 shrink-0 font-medium">VAT:</span>
                    <div className="w-full">
                      <Field
                        component="multiselect"
                        name="vat"
                        options={vatOptions}
                        placeholder="Chọn VAT"
                        emptyIndicator="Không có VAT"
                        className="w-full"
                      />
                    </div>
                  </Label>
                </section>
              </PopoverContent>
            </Popover>
          </div>
        </PanelViewHeader>
      </FormProvider>
    </ErrorBoundary>
  )
}

export default CustomerBookingsFilter
