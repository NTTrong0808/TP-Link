'use client'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useDialoger } from '@/components/widgets/dialoger'
import ExportIcon from '@/components/widgets/icons/export-icon'
import { toastError } from '@/components/widgets/toast'
import { PanelViewHeader } from '@/layouts/panel/panel-view'
import { useExportCustomerMutation } from '@/lib/api/queries/customer/export-customer'
import { CustomerType } from '@/lib/api/queries/customer/schema'
import { useUsers } from '@/lib/api/queries/user/get-users'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { AlertCircle, FilterIcon, PlusIcon } from 'lucide-react'
import { ComponentProps } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useDebounce } from 'react-use'
import { z } from 'zod'
import { STATUS_OPTIONS, STATUS_OPTIONS_MAP, TYPE_OPTIONS, TYPE_OPTIONS_MAP } from '../constants/constant'
import { useFilter } from '../hooks/use-filter'
import { useSearch } from '../hooks/use-search'
import { useTotalUsers } from '../hooks/use-total-users'
import CreateCustomerForm from './create-customer-form'

export const schema = z.object({
  search: z.string().optional(),
  status: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  type: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
})

export interface CustomerListFilterProps extends ComponentProps<typeof PanelViewHeader> {}

const CustomerListFilter = (props: CustomerListFilterProps) => {
  const ql = useQueryClient()
  const { addDialoger } = useDialoger()
  const { total } = useTotalUsers()
  const isCanAccess = useCanAccess()

  const canExportCustomer = isCanAccess(CASL_ACCESS_KEY.TICKET_CUSTOMER_EXPORT)
  const canCreateCustomer = isCanAccess(CASL_ACCESS_KEY.TICKET_CUSTOMER_CREATE)

  const [search, setSearch] = useSearch()
  const [filter, setFilter] = useFilter()

  const defaultStatus = filter.status?.map((s) => STATUS_OPTIONS_MAP.get(s))?.filter(Boolean) || []
  const defaultType = filter.type?.map((s) => TYPE_OPTIONS_MAP.get(s as CustomerType))?.filter(Boolean) || []

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      search: search ?? '',
      status: defaultStatus,
      type: defaultType,
    },
  })

  const [wSearch, wStatus, wType] = useWatch({
    control: form.control,
    name: ['search', 'status', 'type'],
  })

  useDebounce(
    () => {
      setSearch(wSearch ?? '')
    },
    200,
    [wSearch],
  )

  const handleAddUserDialog = () => {
    addDialoger({
      title: 'Thêm TA',
      content: (
        <CreateCustomerForm
          onCompleted={() => {
            ql.invalidateQueries({ queryKey: useUsers.getKey() })
          }}
        />
      ),
      variant: 'dialog',
    })
  }

  const { mutateAsync: exportCustomer, isPending } = useExportCustomerMutation()

  const handleExportCustomer = async () => {
    if (!canExportCustomer) {
      toastError('Bạn không có quyền xuất báo cáo')
      return
    }
    try {
      await exportCustomer({
        search: search ?? undefined,
        type: (filter.type ?? undefined) as unknown as CustomerType[],
        status: (filter.status ?? undefined) as unknown as boolean[],
      })
    } catch (error) {
      toastError('Lỗi khi xuất báo cáo')
    }
  }

  useDebounce(
    () => {
      setFilter({ status: wStatus?.map((s) => s.value) })
      setFilter({ type: wType?.map((s) => s.value) })
    },
    200,
    [wStatus, wType],
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
        <PanelViewHeader
          title="Danh sách"
          action={[
            canExportCustomer && (
              <Button
                size="lg"
                loading={isPending}
                variant="outline"
                onClick={handleExportCustomer}
                key="export-customer"
                disabled={!canExportCustomer}
              >
                <ExportIcon className="size-6" />
                Xuất báo cáo
              </Button>
            ),
            canCreateCustomer && (
              <Button size="lg" onClick={handleAddUserDialog} key="add-customer" disabled={!canCreateCustomer}>
                <PlusIcon className="size-6 mr-1" />
                Thêm TA
              </Button>
            ),
          ]}
          badge={total}
          className="h-15"
        >
          <div className="flex shrink-0 gap-3">
            <Field
              component="search"
              name="search"
              size="lg"
              placeholder="Tìm tên khách hàng, sđt, email"
              containerClassName="w-[300px]"
            />

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
                    <span className="w-20 shrink-0 font-medium">Phân loại:</span>
                    <div className="w-full">
                      <Field
                        component="multiselect"
                        name="type"
                        options={TYPE_OPTIONS}
                        placeholder="Chọn phân loại"
                        emptyIndicator="Không có phân loại"
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
                        options={STATUS_OPTIONS}
                        placeholder="Chọn trạng thái"
                        emptyIndicator="Không có trạng thái"
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

export default CustomerListFilter
