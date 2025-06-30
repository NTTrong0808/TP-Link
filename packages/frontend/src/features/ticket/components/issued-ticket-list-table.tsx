'use client'

import { AdvancedTable, ColumnDefExtend, TableRefProps, useDataTablePagination } from '@/components/advanced-table'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useDialoger } from '@/components/widgets/dialoger'
import { URLS } from '@/constants/urls'
import { usePrintPortal } from '@/features/print/contexts/print-portal-context'
import { PrintType } from '@/features/print/types'
import PrintTicketPortal from '@/features/print/ui/print-ticket-portal'
import TicketHistoryDialog from '@/features/ticket/components/ticket-history-dialog'
import { useAdvancedFilter } from '@/hooks/use-advanced-filter'
import { PanelViewContent } from '@/layouts/panel/panel-view'
import { useGetAllIssuedTicketWithPagination } from '@/lib/api/queries/order/get-all-issued-ticket'
import { ISSUED_TICKET_STATUS_LABEL } from '@/lib/api/queries/ticket/constants'
import { IIssuedTicket, ISSUED_TICKET_STATUS } from '@/lib/api/queries/ticket/schema'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { appDayJs } from '@/utils/dayjs'
import { CheckedState } from '@radix-ui/react-checkbox'
import { CheckCheckIcon, EllipsisVerticalIcon, HistoryIcon, PrinterIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useUpdateEffect } from 'react-use'
import { TICKET_LIST_FILTER_DEFAULT_VALUE } from '../constants'
import { useTotalTicket } from '../hooks/use-total-ticket'
import IssuedTicketDeleteConfirm from './issued-ticket-delete-confirm-dialog'
import IssuedTicketMarkAsUsedConfirm from './issued-ticket-mark-as-used-confirm-dialog'

const TICKET_STATUS_BADGE_VARIANT = {
  [ISSUED_TICKET_STATUS.USED]: 'warning',
  [ISSUED_TICKET_STATUS.UN_USED]: 'default',
  [ISSUED_TICKET_STATUS.EXPIRED]: 'destructive',
  [ISSUED_TICKET_STATUS.DELETED]: 'secondary',
} as Record<keyof typeof ISSUED_TICKET_STATUS, BadgeProps['variant']>

export interface IssuedTicketListTableProps {
  ref?: React.Ref<HTMLDivElement | TableRefProps>
}

const IssuedTicketListTable = ({ ref, ...props }: IssuedTicketListTableProps) => {
  const canAccess = useCanAccess()

  const isCanViewOrderDetail = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_VIEW_DETAIL)
  const isCanViewIssuedTicketList = canAccess(CASL_ACCESS_KEY.TICKET_ISSUED_TICKET_VIEW)
  const isCanViewIssuedTicketDetail = canAccess(CASL_ACCESS_KEY.TICKET_ISSUED_TICKET_VIEW_DETAIL)
  const isCanDeleteIssuedTicket = canAccess(CASL_ACCESS_KEY.TICKET_ISSUED_TICKET_DELETE)
  const isCanMarkAsUsedIssuedTicket = canAccess(CASL_ACCESS_KEY.TICKET_ISSUED_TICKET_MARK_AS_USED)
  const isCanPrintIssuedTicket = canAccess(CASL_ACCESS_KEY.TICKET_ISSUED_TICKET_PRINT)
  const isCanViewIssuedTicketHistory = canAccess(CASL_ACCESS_KEY.TICKET_ISSUED_TICKET_HISTORY_VIEW)

  const [selectedTickets, setSelectedTickets] = useState<IIssuedTicket[]>([])

  const [filters] = useAdvancedFilter(TICKET_LIST_FILTER_DEFAULT_VALUE)
  const { setTotal } = useTotalTicket()

  const { addDialoger } = useDialoger()

  const { pagination, setPagination } = useDataTablePagination({
    defaultPageSize: 50,
    defaultPageIndex: 0,
  })

  const [sorting, setSorting] = useState<{
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const { data, isSuccess, isLoading, isFetching, refetch } = useGetAllIssuedTicketWithPagination({
    enabled: isCanViewIssuedTicketList,
    variables: {
      ...filters,
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      sortBy: sorting.sortBy,
      sortOrder: sorting.sortOrder,
    },
  })

  const { isPrinting, handlePrint } = usePrintPortal({
    onAfterPrint: () => {
      refetch()
    },
  })

  const handleOpenTicketHistory = (
    ticketId?: string,
    issuedCode?: string,
    ticketStatus?: IIssuedTicket['status'],
    ticketExpiryDate?: IIssuedTicket['expiryDate'],
  ) => {
    if (ticketId) {
      addDialoger({
        title: `Lịch sử vé #${issuedCode}`,
        content: (
          <TicketHistoryDialog ticketId={ticketId} ticketStatus={ticketStatus} ticketExpiryDate={ticketExpiryDate} />
        ),
        variant: 'dialog',
        disableCloseOutside: true,
        hideXIcon: true,
      })
    }
  }

  useUpdateEffect(() => {
    if (isSuccess && data?.meta) {
      setTotal(data.meta.total || 0)
    }
  }, [data, isSuccess])

  const handleSelectTicket = (ticket: IIssuedTicket, checked?: boolean | null | CheckedState) => {
    const isSelected = selectedTickets.some((selectedTicket) => selectedTicket?._id === ticket?._id)

    // Nếu có tham số checked, sử dụng giá trị đó
    if (checked !== undefined && checked !== null) {
      if (checked) {
        // Thêm ticket nếu chưa có
        if (!isSelected) {
          setSelectedTickets((prev) => [...prev, ticket])
        }
      } else {
        // Xóa ticket nếu đã có
        if (isSelected) {
          setSelectedTickets((prev) => prev.filter((selectedTicket) => selectedTicket?._id !== ticket?._id))
        }
      }
    } else {
      // Toggle: nếu đã chọn thì bỏ chọn, chưa chọn thì chọn
      if (isSelected) {
        setSelectedTickets((prev) => prev.filter((selectedTicket) => selectedTicket?._id !== ticket?._id))
      } else {
        setSelectedTickets((prev) => [...prev, ticket])
      }
    }
  }

  const handleDeleteIssuedTickets = (ticketIds?: string[], ticketCodes?: string[]) => {
    if (ticketIds && ticketIds?.length > 0) {
      addDialoger({
        title: 'Xoá vé',
        content: (
          <IssuedTicketDeleteConfirm issuedTicketIds={ticketIds} issuedCodes={ticketCodes} handleRefetch={refetch} />
        ),
        variant: 'dialog',
        disableCloseOutside: true,
        hideXIcon: true,
      })
    }
  }
  const handleMarkAsUsedIssuedTickets = (ticketIds?: string[], ticketCodes?: string[]) => {
    if (ticketIds && ticketIds?.length > 0) {
      addDialoger({
        title: 'Đánh dấu đã sử dụng vé',
        content: (
          <IssuedTicketMarkAsUsedConfirm
            issuedTicketIds={ticketIds}
            issuedCodes={ticketCodes}
            handleRefetch={refetch}
          />
        ),
        variant: 'dialog',
        disableCloseOutside: true,
        hideXIcon: true,
      })
    }
  }

  console.log(
    data?.data?.every((ticket) => {
      const some = selectedTickets?.some((selectedTicket) => selectedTicket?._id === ticket?._id)
      console.log('some', some)
      return some
    }),
  )

  const columns: ColumnDefExtend<IIssuedTicket>[] = [
    // {
    //   header: 'STT',
    //   accessorKey: 'ticketIndex',
    //   cell: ({ row }) => {
    //     return <span>{row?.original?.ticketIndex || row?.index + 1}</span>
    //   },
    //   filterDataType: 'number',
    //   filterFieldName: 'ticketIndex',
    //   filterComponent: 'compare',
    // },

    {
      header: () => {
        return (
          <Checkbox
            checked={data?.data?.every((ticket) =>
              selectedTickets?.length > 0
                ? selectedTickets?.some((selectedTicket) => selectedTicket?._id === ticket?._id)
                : false,
            )}
            onCheckedChange={(checked) => {
              setSelectedTickets((prev) => (checked ? [...(prev || []), ...(data?.data || [])] : []))
            }}
          />
        )
      },
      enableSorting: false,
      accessorKey: 'checkbox',
      className: 'w-6',
      cell: ({ row }) => {
        return <Checkbox checked={selectedTickets.some((ticket) => ticket?._id === row?.original?._id)} />
      },
      onCellClick: (row) => {
        handleSelectTicket(row)
      },
    },

    {
      header: 'Mã biên lai',
      accessorKey: 'receiptNumber',
      filterDataType: 'string',
      filterFieldName: 'receiptNumber',
      filterComponent: 'compare',
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
      cell(props) {
        if (isCanViewOrderDetail) {
          return (
            <Link
              href={URLS.ADMIN.ORDER.DETAIL.replace(':id', props.row.original?.bookingId)}
              className="hover:underline text-semantic-info-300 hover:text-semantic-info-500"
            >
              {props.row.original?.booking?.receiptNumber}
            </Link>
          )
        }
        return props.row.original?.booking?.receiptNumber
      },
      footer: () => {
        return <div className="text-start">Đã chọn {selectedTickets?.length} vé</div>
      },
    },
    {
      header: 'Số booking',
      accessorKey: 'bookingCode',
      filterDataType: 'string',
      filterFieldName: 'bookingCode',
      filterComponent: 'compare',
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
      cell(props) {
        if (isCanViewOrderDetail) {
          return (
            <Link
              href={URLS.ADMIN.ORDER.DETAIL.replace(':id', props.row.original?.bookingId)}
              className="hover:underline text-semantic-info-300 hover:text-semantic-info-500"
            >
              {props.row.original?.booking?.bookingCode}
            </Link>
          )
        }
        return props.row.original?.booking?.bookingCode
      },
    },
    {
      header: 'Mã vé',
      accessorKey: 'issuedCode',
      filterDataType: 'string',
      filterFieldName: 'issuedCode',
      filterComponent: 'compare',
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
      cell(props) {
        if (isCanViewIssuedTicketDetail) {
          return (
            <Link
              href={URLS.ADMIN.TICKET.DETAIL.replace(':id', props.row.original._id)}
              className="hover:underline text-semantic-info-300 hover:text-semantic-info-500"
            >
              {props.row.original?.issuedCode}
            </Link>
          )
        }
        return props.row.original?.issuedCode
      },
    },
    {
      header: 'Thời gian tạo',
      accessorKey: 'createdAt',
      filterDataType: 'string',
      filterFieldName: 'createdAt',
      filterComponent: 'compare',
      cell: ({ row }) => {
        return <span>{appDayJs(row?.original?.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
      },
      meta: {
        justifyContent: 'center',
      },
    },

    {
      header: 'Trạng thái',
      accessorKey: 'status',
      cell: ({ row }) => {
        return (
          <Badge
            variant={
              TICKET_STATUS_BADGE_VARIANT?.[row?.original?.status as keyof typeof TICKET_STATUS_BADGE_VARIANT] ||
              'default'
            }
            corner="full"
          >
            {ISSUED_TICKET_STATUS_LABEL[row?.original?.status as keyof typeof ISSUED_TICKET_STATUS_LABEL]}
          </Badge>
        )
      },
      filterDataType: 'string',
      filterFieldName: 'status',
      filterComponent: 'select',
      filterOptions: Object.values(ISSUED_TICKET_STATUS).map((status) => ({
        value: status,
        label: ISSUED_TICKET_STATUS_LABEL[status as keyof typeof ISSUED_TICKET_STATUS_LABEL],
      })),
      meta: {
        justifyContent: 'center',
      },
    },
    {
      header: 'Lần in',
      accessorKey: 'printCount',
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
      filterDataType: 'number',
      filterFieldName: 'printCount',
      filterComponent: 'compare',
    },
    {
      header: 'Lần in cuối',
      accessorKey: 'lastPrintTime',
      // meta: {
      //   justifyContent: 'center',
      //   textAlign: 'center',
      // },

      filterDataType: 'string',
      filterFieldName: 'lastPrintTime',
      filterComponent: 'compare',
      meta: {
        justifyContent: 'center',
      },
    },
    {
      header: () => {
        return <div></div>
      },
      accessorKey: 'actions',
      enableSorting: false,
      className: 'w-10',
      cell: ({ row }) => {
        const isCanMarkAsUsed = isCanMarkAsUsedIssuedTicket && row?.original?.status === ISSUED_TICKET_STATUS.UN_USED
        const isCanDelete = isCanDeleteIssuedTicket && row?.original?.status !== ISSUED_TICKET_STATUS.DELETED

        if (!isCanPrintIssuedTicket && !isCanViewIssuedTicketHistory && !isCanMarkAsUsed && !isCanDelete) {
          return
        }
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-transparent">
                <EllipsisVerticalIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 max-w-fit" align="end">
              <div className="grid [&>*]:justify-start [&>*:last-child]:rounded-t-none [&>*:not(:last-child)]:rounded-none [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-low">
                {isCanPrintIssuedTicket && (
                  <Button
                    variant="ghost"
                    size="lg"
                    loading={isPrinting}
                    disabled={!(isCanPrintIssuedTicket && selectedTickets?.length > 0)}
                    onClick={() =>
                      selectedTickets?.length > 0 &&
                      handlePrint(PrintType.TICKET, {
                        issuedCodes: selectedTickets?.map((ticket) => ticket?.issuedCode),
                      })
                    }
                  >
                    <PrinterIcon />
                    In vé
                  </Button>
                )}
                {isCanViewIssuedTicketHistory && (
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() =>
                      handleOpenTicketHistory(
                        row?.original?._id,
                        row?.original?.issuedCode,
                        row?.original?.status,
                        row?.original?.expiryDate,
                      )
                    }
                    disabled={!isCanViewIssuedTicketHistory}
                  >
                    <HistoryIcon />
                    Lịch sử vé
                  </Button>
                )}
                {isCanMarkAsUsed && (
                  <Button
                    variant="ghost"
                    size="lg"
                    disabled={!isCanMarkAsUsedIssuedTicket}
                    onClick={() => {
                      const isSelectedTickets = selectedTickets?.length > 0

                      const ticketIds = isSelectedTickets
                        ? selectedTickets?.map((ticket) => ticket?._id)
                        : [row?.original?._id]
                      const ticketCodes = isSelectedTickets
                        ? selectedTickets?.map((ticket) => ticket?.issuedCode)
                        : [row?.original?.issuedCode]

                      handleMarkAsUsedIssuedTickets(ticketIds, ticketCodes)
                    }}
                  >
                    <CheckCheckIcon />
                    Đánh dấu đã sử dụng
                  </Button>
                )}
                {isCanDelete && (
                  <Button
                    variant="ghost"
                    size="lg"
                    disabled={!isCanDeleteIssuedTicket}
                    onClick={() => {
                      const isSelectedTickets = selectedTickets?.length > 0

                      const ticketIds = isSelectedTickets
                        ? selectedTickets?.map((ticket) => ticket?._id)
                        : [row?.original?._id]
                      const ticketCodes = isSelectedTickets
                        ? selectedTickets?.map((ticket) => ticket?.issuedCode)
                        : [row?.original?.issuedCode]

                      handleDeleteIssuedTickets(ticketIds, ticketCodes)
                    }}
                    className="text-secondary-strawberry-300"
                  >
                    <Trash2Icon />
                    Xoá vé
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )
      },
    },
  ]

  return (
    <PanelViewContent>
      <AdvancedTable
        ref={ref}
        data={data?.data || []}
        columns={columns}
        pagination={{
          type: 'manual',
          total: data?.meta?.total || 0,
          ...pagination,
          setPagination,
        }}
        sortColumn="createdAt"
        className="h-full"
        loading={isLoading || isFetching}
        defaultOuterFilters={filters?.advancedFilters}
        showFooter
        onSortChange={setSorting}
      />
      {selectedTickets.length > 0 && <PrintTicketPortal tickets={selectedTickets} />}
    </PanelViewContent>
  )
}

export default IssuedTicketListTable
