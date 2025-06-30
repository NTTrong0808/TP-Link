'use client'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toastError } from '@/components/widgets/toast'
import { usePrintPortal } from '@/features/print/contexts/print-portal-context'
import { PrintType } from '@/features/print/types'
import { useTotalTicket } from '@/features/ticket/hooks/use-total-ticket'
import { useFilter } from '@/hooks/use-filter'
import { useSearch } from '@/hooks/use-search'
import { PanelViewHeader } from '@/layouts/panel/panel-view'
import { getIssuedTicketByBookingIdWithPaginationKey } from '@/lib/api/queries/order/get-issued-ticket-by-booking'
import { ISSUED_TICKET_STATUS_COLOR, ISSUED_TICKET_STATUS_LABEL } from '@/lib/api/queries/ticket/constants'
import { IIssuedTicket, ISSUED_TICKET_STATUS } from '@/lib/api/queries/ticket/schema'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Eye, FilterIcon } from 'lucide-react'
import { ComponentProps, useMemo, useRef, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useDebounce } from 'react-use'
import { z } from 'zod'

const statusOptions = [
  {
    value: ISSUED_TICKET_STATUS.USED,
    label: ISSUED_TICKET_STATUS_LABEL.USED,
    className: ISSUED_TICKET_STATUS_COLOR.USED,
  },
  {
    value: ISSUED_TICKET_STATUS.UN_USED,
    label: ISSUED_TICKET_STATUS_LABEL.UN_USED,
    className: ISSUED_TICKET_STATUS_COLOR.UN_USED,
  },
  {
    value: ISSUED_TICKET_STATUS.EXPIRED,
    label: ISSUED_TICKET_STATUS_LABEL.EXPIRED,
    className: ISSUED_TICKET_STATUS_COLOR.EXPIRED,
  },
  {
    value: ISSUED_TICKET_STATUS.DELETED,
    label: ISSUED_TICKET_STATUS_LABEL.DELETED,
    className: ISSUED_TICKET_STATUS_COLOR.DELETED,
  },
]

const statusOptionsMap = new Map(statusOptions.map((s) => [s.value, s]))

export const schema = z.object({
  search: z.string().optional(),
  status: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  printCount: z.string().optional(),
})

export interface TicketListFilterProps extends ComponentProps<typeof PanelViewHeader> {
  selectedTickets: IIssuedTicket[]
  setSelectedTickets: React.Dispatch<React.SetStateAction<IIssuedTicket[]>>
}

const TicketListFilter = ({ selectedTickets, setSelectedTickets, ...props }: TicketListFilterProps) => {
  const { total } = useTotalTicket()
  const searchRef = useRef<HTMLInputElement>(null)

  const [openFilter, setOpenFilter] = useState(false)

  const isCanAccess = useCanAccess()

  const queryClient = useQueryClient()

  const { handlePrint, isPrinting } = usePrintPortal({
    onAfterPrint() {
      setSelectedTickets([])
      queryClient.invalidateQueries({
        queryKey: [getIssuedTicketByBookingIdWithPaginationKey],
      })
    },
  })

  const [search, setSearch] = useSearch()
  const [filter, setFilter] = useFilter()

  const defaultStatus =
    filter.status?.map((s) => statusOptionsMap.get(s as keyof typeof ISSUED_TICKET_STATUS)).filter(Boolean) || []

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      search: search ?? '',
      status: defaultStatus,
      printCount: '',
    },
  })

  const [wSearch, wStatus, wPrintCount] = useWatch({
    control: form.control,
    name: ['search', 'status', 'printCount'],
  })

  useDebounce(
    () => {
      setSearch(wSearch ?? '')
    },
    1000,
    [wSearch],
  )

  const handleChangeFilter = () => {
    setFilter({
      status: wStatus?.map((s) => s?.value).filter(Boolean),
      printCount: wPrintCount,
    })
    setOpenFilter(false)
    if (searchRef.current) {
      searchRef.current.value = ''
    }
  }

  const handleClearFilter = () => {
    setFilter({
      status: [],
      printCount: '',
    })
    form.reset()
    setOpenFilter(false)
  }

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
        label: 'Lần in',
        key: 'printCount',
        value: filter.printCount,
        placeholder: 'Nhập lần in',
        emptyIndicator: 'Không có lần in',
        component: 'text',
        type: 'number',
      },
      {
        label: 'Trạng thái',
        key: 'status',
        value: filter.status,
        placeholder: 'Chọn trạng thái',
        emptyIndicator: 'Không có trạng thái',
        component: 'multiselect',
        options: statusOptions,
      },
    ]
  }, [filter])

  const handleClickPrintTicket = () => {
    if (selectedTickets.length === 0) {
      toastError('Vui lòng chọn vé để in')
      return
    }
    handlePrint(PrintType.TICKET, { issuedCodes: selectedTickets?.map((item) => item.issuedCode) })
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
            isCanAccess(CASL_ACCESS_KEY.TICKET_ORDER_PRINT_TICKET) && [
              <div
                key="selected-tickets"
                className="inline-flex items-center flex-1 text-sm font-medium text-neutral-grey-400"
              >
                Đã chọn {selectedTickets.length || 0} vé
              </div>,
              <Button
                key="print-ticket"
                size="lg"
                className="w-[120px]"
                onClick={handleClickPrintTicket}
                disabled={selectedTickets.length === 0}
                loading={isPrinting}
              >
                In vé
              </Button>,
            ]
          }
        >
          <div className="flex shrink-0 gap-3">
            <Field
              component="search"
              name="search"
              size="lg"
              placeholder="Tìm mã vé"
              containerClassName="w-[300px]"
              ref={searchRef}
            />
            <Popover open={openFilter} onOpenChange={setOpenFilter}>
              <PopoverTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className={cn(hasFiltered ? 'bg-green-50 border-green-500 text-green-500' : 'bg-neutral-white')}
                >
                  {!hasFiltered && (
                    <FilterIcon
                      className={cn('size-5 mr-2 text-neutral-grey-300', hasFiltered ? 'fill-neutral-grey-300' : null)}
                    />
                  )}
                  Bộ lọc {hasFiltered && <Eye className="!size-5 text-neutral-black" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="px-3 py-2 w-fit flex flex-col gap-y-4 gap-x-2">
                {/* <section className="px-4 py-2 border-b border-low">
                  <h2 className="text-base font-medium leading-6 text-neutral-black">Bộ lọc</h2>
                </section> */}

                <div className="flex gap-2">
                  {filterFields.map((field) => (
                    <section className="w-full" key={field.key}>
                      <Label className="flex flex-col gap-1">
                        <span className="w-20 shrink-0 text-sm font-medium text-neutral-grey-400">{field.label}</span>
                        <div className="w-full">
                          <Field
                            component={field.component as any}
                            name={field.key}
                            options={field.options}
                            placeholder={field.placeholder}
                            emptyIndicator={field.emptyIndicator}
                            className="w-full max-w-[200px]"
                            badgeClassName="border-none rounded-full"
                          />
                        </div>
                      </Label>
                    </section>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full" onClick={handleClearFilter}>
                    Xóa bộ lọc
                  </Button>
                  <Button onClick={handleChangeFilter} className="w-full">
                    Lưu
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </PanelViewHeader>
      </FormProvider>
    </ErrorBoundary>
  )
}

export default TicketListFilter
