'use client'

import { Button } from '@/components/ui/button'

import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Field } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ExportIcon from '@/components/widgets/icons/export-icon'
import { toastError } from '@/components/widgets/toast'
import { useFilter } from '@/hooks/use-filter'
import { useSearch } from '@/hooks/use-search'
import { PanelViewHeader } from '@/layouts/panel/panel-view'
import { useExportOrderMutation } from '@/lib/api/queries/order/export-order'
import { OrderStatus, OrderVariables } from '@/lib/api/queries/order/schema'
import { useSuspensePaymentMethods } from '@/lib/api/queries/payment-method/get-payment-methods'
import { useSuspenseSaleChannels } from '@/lib/api/queries/sale-channel/get-sale-channels'
import { GroupSaleChannel } from '@/lib/api/queries/sale-channel/types'
import { useSuspenseAllUsers } from '@/lib/api/queries/user/get-all-users'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { useAuth } from '@/lib/auth/context'
import { cn } from '@/lib/tw'
import { appDayJs } from '@/utils/dayjs'
import { AlertCircle, FilterIcon } from 'lucide-react'
import { ComponentProps, useCallback, useMemo, useRef, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useBoolean, useDebounce } from 'react-use'
import { DATE_FORMAT, STATUS_OPTIONS, STATUS_OPTIONS_MAP, VAT_OPTIONS, VAT_OPTIONS_MAP } from '../constants/constant'
import { ORDER_DEFAULT_FILTER, ORDER_EMPTY_FILTER } from '../constants/filter'
import { useTotalOrder } from '../hooks/use-total-order'
import { OrderListFilterType } from '../schemas/schema'

export interface OrderListFilterProps extends ComponentProps<typeof PanelViewHeader> {
  variables: OrderVariables
}

export interface OrderListFilterOption {
  value: string
  label: string
}

const OrderListFilter = (props: OrderListFilterProps) => {
  const searchRef = useRef<HTMLInputElement>(null)

  const { currentUser } = useAuth()

  const { total } = useTotalOrder()
  const [openFilter, setOpenFilter] = useBoolean(false)
  const [cacheFilter, setCacheFilter] = useState<OrderListFilterType | null>(null)

  const canAccess = useCanAccess()

  const isCanViewOrder = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_VIEW)
  const isCanViewOnlineOrder = canAccess(CASL_ACCESS_KEY.TICKET_ONLINE_ORDER_VIEW)
  const isCanViewOrderByEmployee = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_BY_EMP_VIEW)
  const canExport = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_EXPORT)

  const [search, setSearch] = useSearch()

  const { data: paymentMethods } = useSuspensePaymentMethods({
    select: (resp) =>
      resp?.data && Array.isArray(resp?.data)
        ? [
            ...(resp?.data ?? [])?.map((pm) => ({
              value: pm?._id,
              label: pm?.name,
            })),
            {
              value: 'bank-transfer',
              label: 'Payoo OL',
            },
          ]
        : [],
  })

  const { data: saleChannels } = useSuspenseSaleChannels({
    select: (resp) =>
      resp?.data && Array.isArray(resp?.data)
        ? resp?.data
            ?.filter((e) => isCanViewOnlineOrder || isCanViewOrder || e?.groupSaleChannel !== GroupSaleChannel.ONLINE)
            ?.map((e) => ({
              value: e?._id,
              label: e?.name,
            }))
        : [],
  })

  const { data: users } = useSuspenseAllUsers({
    select: (resp) =>
      resp?.data && Array.isArray(resp?.data)
        ? resp?.data?.map((e) => ({
            value: e?._id,
            label: `${e?.lastName} ${e?.firstName}`,
          }))
        : [],
  })

  const userOptionsMap = useMemo(() => {
    if (users) return new Map((users ?? []).map((s) => [s?.value, s]))
    return new Map([])
  }, [users])

  const saleChannelOptionsMap = useMemo(() => {
    if (saleChannels) return new Map((saleChannels ?? []).map((s) => [s?.value, s]))
    return new Map([])
  }, [saleChannels])

  const [filter, setFilter] = useFilter({
    ...ORDER_DEFAULT_FILTER,
    createdBy:
      isCanViewOrderByEmployee && !isCanViewOrder ? [currentUser?._id as string] : ORDER_DEFAULT_FILTER.createdBy,
  })

  const form = useForm<OrderListFilterType>({
    defaultValues: {
      search: search ?? '',
      status: filter.status?.map((s) => STATUS_OPTIONS_MAP.get(s as OrderStatus)),
      vat: filter.vat?.map((s) => VAT_OPTIONS_MAP.get(s)),
      paymentMethodId: filter.paymentMethodId
        ?.map((s) => {
          const pm = paymentMethods?.find((_pm) => {
            return _pm?.value === s
          })

          return {
            value: pm?.value,
            label: pm?.label,
          }
        })
        ?.filter(Boolean) as OrderListFilterOption[],
      saleChannelId: filter?.saleChannelId
        ?.map((s) => saleChannelOptionsMap.get(s))
        ?.filter(Boolean) as OrderListFilterOption[],
      createdBy: filter?.createdBy?.map((s) => userOptionsMap.get(s))?.filter(Boolean) as OrderListFilterOption[],
      createdFrom: filter?.createdFrom ?? '',
      createdTo: filter?.createdTo ?? '',
      totalPaidFrom: filter?.totalPaidFrom ?? '',
      totalPaidTo: filter?.totalPaidTo ?? '',
    },
  })

  const [wSearch, wCreatedFrom, wCreatedTo] = useWatch({
    control: form.control,
    name: ['search', 'createdFrom', 'createdTo'],
  })

  useDebounce(
    () => {
      setSearch(wSearch ?? '')
    },
    1000,
    [wSearch],
  )

  const hasFiltered = Object.values(filter).some((v) => {
    if (!v) return false
    if (Array.isArray(v)) {
      return v.length > 0
    }
    if (typeof v === 'number' && !isNaN(v)) {
      return v > 0
    }
    return false
  })

  const filterFields = useMemo(() => {
    return [
      {
        label: 'Kênh bán',
        key: 'saleChannelId',
        placeholder: 'Chọn kênh bán',
        emptyIndicator: 'Không có kênh bán',
        component: 'multiselect',
        options: saleChannels ?? [],
      },
      {
        label: 'Thu ngân',
        key: 'createdBy',
        placeholder: 'Chọn thu ngân',
        emptyIndicator: 'Không có thu ngân',
        component: 'multiselect',
        options: users ?? [],
        disabled: isCanViewOrderByEmployee && !isCanViewOrder,
      },
      {
        label: 'PTTT',
        key: 'paymentMethodId',
        placeholder: 'Chọn PTTT',
        emptyIndicator: 'Không có PTTT',
        component: 'multiselect',
        options: paymentMethods ?? [],
      },
      {
        label: 'Trạng thái',
        key: 'status',
        placeholder: 'Chọn trạng thái',
        emptyIndicator: 'Không có trạng thái',
        component: 'multiselect',
        options: STATUS_OPTIONS,
      },
      {
        label: 'VAT',
        key: 'vat',
        placeholder: 'Chọn VAT',
        emptyIndicator: 'Không có VAT',
        component: 'multiselect',
        options: VAT_OPTIONS,
      },
    ]
  }, [filter, paymentMethods, users, saleChannels])

  const handleApplyFilter = () => {
    if (searchRef.current) {
      searchRef.current.value = ''
    }
    const formValues = form.getValues()

    setFilter({
      status: formValues.status?.map((s) => s.value).filter(Boolean),
      vat: formValues.vat?.map((v) => v.value).filter(Boolean),
      paymentMethodId: formValues.paymentMethodId?.map((p) => p.value).filter(Boolean),
      saleChannelId: formValues.saleChannelId?.map((s) => s.value).filter(Boolean),
      createdBy: formValues.createdBy?.map((c) => c.value).filter(Boolean),
      totalPaidFrom: formValues.totalPaidFrom || '',
      totalPaidTo: formValues.totalPaidTo || '',
      createdFrom: formValues.createdFrom || '',
      createdTo: formValues.createdTo || '',
    })
    setOpenFilter(false)
  }

  const handleClearFilter = useCallback(() => {
    form.reset({
      ...Object.keys(ORDER_EMPTY_FILTER).reduce((acc, key) => {
        if (isCanViewOrderByEmployee && !(isCanViewOnlineOrder || isCanViewOrder) && key === 'createdBy') {
          return acc
        }
        acc[key as keyof typeof ORDER_EMPTY_FILTER] = ORDER_EMPTY_FILTER[key as keyof typeof ORDER_EMPTY_FILTER]
        return acc
      }, {} as Record<string, any>),
    })
  }, [form, setFilter])

  const { mutateAsync: exportOrders, isPending } = useExportOrderMutation()

  const handleExportOrders = async () => {
    if (!canExport) {
      toastError('Bạn không có quyền xuất báo cáo')
      return
    }
    try {
      await exportOrders(props.variables)
    } catch (error) {
      toastError('Lỗi khi xuất báo cáo')
      console.error(error)
    }
  }

  const handleToggleFilter = (open: boolean) => {
    if (open) {
      setCacheFilter(form.getValues())
    }
    setOpenFilter(open)
  }

  const handleCancelFilter = () => {
    setOpenFilter(false)
    form.reset({
      ...cacheFilter,
    })
  }

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
        <PanelViewHeader
          title="Danh sách"
          badge={total}
          action={
            <div className="flex items-center gap-4">
              {/* <DailyReportAction /> */}
              {canExport && (
                <Button
                  size="lg"
                  disabled={!canExport}
                  isLoading={isPending}
                  variant="outline"
                  onClick={handleExportOrders}
                >
                  <ExportIcon className="size-6" />
                  Xuất báo cáo
                </Button>
              )}
            </div>
          }
        >
          <div className="flex shrink-0 gap-3">
            <Field
              component="search"
              name="search"
              size="lg"
              placeholder="Tìm Số hóa đơn, tên khách hàng, mã meInvoice"
              containerClassName="w-[300px]"
              ref={searchRef}
            />

            <Popover open={openFilter} onOpenChange={handleToggleFilter}>
              <PopoverTrigger asChild>
                <Button size="lg" variant="outline" className="bg-neutral-white">
                  <FilterIcon
                    className={cn('size-5 mr-2 text-neutral-grey-300', hasFiltered ? 'fill-neutral-grey-300' : null)}
                  />
                  Bộ lọc
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0 w-[500px] overflow-hidden">
                <section className="px-4 py-2 border-b border-low">
                  <h2 className="text-base font-medium leading-6 text-neutral-black">Bộ lọc</h2>
                </section>
                <div className="flex flex-col h-full max-h-[500px] overflow-auto ">
                  <section className="p-4">
                    <div className="flex items-center gap-4 whitespace-nowrap text-xs text-neutral-grey-500">
                      <span className="w-20 shrink-0 font-medium">Thời gian:</span>
                      <div className="flex items-center gap-1 w-full">
                        <DateRangePicker
                          from={
                            wCreatedFrom && appDayJs(wCreatedFrom).isValid()
                              ? appDayJs(wCreatedFrom).toDate()
                              : undefined
                          }
                          to={wCreatedTo && appDayJs(wCreatedTo).isValid() ? appDayJs(wCreatedTo).toDate() : undefined}
                          showIcon={false}
                          onSelect={(data) => {
                            if (data?.from && appDayJs(data.from).isValid()) {
                              form.setValue('createdFrom', appDayJs(data.from).format(DATE_FORMAT))
                            } else {
                              form.setValue('createdFrom', '')
                            }

                            if (data?.to && appDayJs(data.to).isValid()) {
                              form.setValue('createdTo', appDayJs(data.to).format(DATE_FORMAT))
                            } else {
                              form.setValue('createdTo', '')
                            }
                          }}
                        />
                      </div>
                    </div>
                  </section>
                  <section className="p-4">
                    <Label className="flex items-center gap-4">
                      <span className="w-20 shrink-0 font-medium">Giá trị đơn hàng:</span>
                      <div className="w-full inline-flex items-center gap-1">
                        <Field
                          component="text"
                          name="totalPaidFrom"
                          placeholder="Từ"
                          className="w-full"
                          suffix="đ"
                          type="number"
                        />
                        <div>-</div>
                        <Field
                          component="text"
                          name="totalPaidTo"
                          placeholder="Đến"
                          className="w-full"
                          suffix="đ"
                          type="number"
                        />
                      </div>
                    </Label>
                  </section>
                  {filterFields.map((field) => (
                    <section className="p-4" key={field.key}>
                      <Label className="flex items-center gap-4">
                        <span className="w-20 shrink-0 font-medium">{field.label}:</span>
                        <div className="w-full">
                          <Field
                            {...field}
                            key={field.key}
                            component={field.component as any}
                            name={field.key}
                            options={field.options}
                            placeholder={field.placeholder}
                            emptyIndicator={field.emptyIndicator}
                            className="w-full"
                          />
                        </div>
                      </Label>
                    </section>
                  ))}
                </div>
                <div className="flex justify-between items-center p-4 bg-white border-t border-low shadow-sm">
                  <Button variant="ghost" className="text-semantic-danger-400" onClick={handleClearFilter}>
                    Xóa bộ lọc
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancelFilter}>
                      Huỷ
                    </Button>
                    <Button onClick={handleApplyFilter}>Áp dụng</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </PanelViewHeader>
      </FormProvider>
    </ErrorBoundary>
  )
}

export default OrderListFilter
