'use client'

import { DataTable, useDataTablePagination } from '@/components/data-table'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useDialoger } from '@/components/widgets/dialoger'
import { useTotalTicket } from '@/features/ticket/hooks/use-total-ticket'
import { TICKET_VALID_TIME_TO_SECOND } from '@/helper/ticket'
import { useFilter } from '@/hooks/use-filter'
import { useSearch } from '@/hooks/use-search'
import { PanelViewContent } from '@/layouts/panel/panel-view'
import { useIssuedTicketByBookingIdWithPagination } from '@/lib/api/queries/order/get-issued-ticket-by-booking'
import { ISSUED_TICKET_STATUS_LABEL } from '@/lib/api/queries/ticket/constants'
import { IIssuedTicket, ISSUED_TICKET_STATUS } from '@/lib/api/queries/ticket/schema'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { appDayJs } from '@/utils/dayjs'
import { ColumnDef } from '@tanstack/react-table'
import { useParams } from 'next/navigation'
import { ComponentProps } from 'react'
import { useUpdateEffect } from 'react-use'
import TicketHistoryDialog from '../../ticket/components/ticket-history-dialog'
export interface TicketListTableProps extends ComponentProps<typeof PanelViewContent> {
  selectedTickets: IIssuedTicket[]
  setSelectedTickets: React.Dispatch<React.SetStateAction<IIssuedTicket[]>>
}

const badgeVariant = {
  [ISSUED_TICKET_STATUS.USED]: 'warning',
  [ISSUED_TICKET_STATUS.UN_USED]: 'default',
  [ISSUED_TICKET_STATUS.EXPIRED]: 'destructive',
  [ISSUED_TICKET_STATUS.DELETED]: 'secondary',
} as Record<keyof typeof ISSUED_TICKET_STATUS, BadgeProps['variant']>

const TicketListTable = ({ selectedTickets, setSelectedTickets, ...props }: TicketListTableProps) => {
  const isCanAccess = useCanAccess()
  const [search] = useSearch()
  const [filter] = useFilter()
  const { setTotal } = useTotalTicket()

  const { addDialoger } = useDialoger()

  const { pagination, setPagination } = useDataTablePagination({
    defaultPageSize: 50,
    defaultPageIndex: 0,
  })

  const { id } = useParams()
  const bookingId = id as string
  const {
    data: ticketsResponse,
    isSuccess,
    isLoading,
    isFetching,
  } = useIssuedTicketByBookingIdWithPagination({
    variables: {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      bookingId,
      search: search ?? undefined,
      printCount: filter.printCount ?? undefined,
      status: (filter.status ??
        undefined) as unknown as (typeof ISSUED_TICKET_STATUS)[keyof typeof ISSUED_TICKET_STATUS][],
      sortBy: 'ticketIndex',
      sortOrder: 'asc',
    },
    enabled: !!bookingId,
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

  const isValidTicket = (expiryDate: string | Date) => {
    return (
      !expiryDate || appDayJs().isBefore(appDayJs(expiryDate).startOf('day').add(TICKET_VALID_TIME_TO_SECOND, 'second'))
    )
  }

  const handleSelectTicket = (ticket: IIssuedTicket) => {
    if (!isValidTicket(ticket?.expiryDate)) {
      return
    }

    setSelectedTickets((prev) => {
      const isSelected = prev.some((item) => item._id === ticket._id)
      if (isSelected) {
        return prev.filter((id) => id !== ticket)
      }
      return [...prev, ticket]
    })
  }

  // Lọc vé còn hạn sử dụng
  const validTickets = ticketsResponse?.data?.filter((ticket) => isValidTicket(ticket?.expiryDate)) || []

  const handleSelectAllTickets = () => {
    if (selectedTickets.length === validTickets.length) {
      setSelectedTickets([])
    } else {
      setSelectedTickets(validTickets)
    }
  }

  useUpdateEffect(() => {
    if (isSuccess && ticketsResponse?.meta) {
      setTotal(ticketsResponse.meta.total || 0)
    }
  }, [ticketsResponse, isSuccess])

  const columns: ColumnDef<IIssuedTicket>[] = [
    {
      header: 'STT',
      accessorKey: 'ticketIndex',
      cell: ({ row }) => {
        return <span>{row?.original?.ticketIndex || row?.index + 1}</span>
      },
    },
    {
      header: 'Mã vé',
      accessorKey: 'issuedCode',
    },
    {
      header: 'Lần in',
      accessorKey: 'printCount',
      meta: {
        justifyContent: 'center',
        textAlign: 'center',
      },
    },
    {
      header: 'Lần in cuối',
      accessorKey: 'printTimes',
      // meta: {
      //   justifyContent: 'center',
      //   textAlign: 'center',
      // },
      cell: ({ row }) => {
        if (row?.original?.printTimes && row?.original?.printTimes?.length > 0) {
          return (
            <div className="text-nowrap">
              {row?.original?.printTimes && row?.original?.printTimes?.length > 0
                ? appDayJs(row?.original?.printTimes?.[row?.original?.printTimes?.length - 1]).format(
                    'DD/MM/YYYY HH:mm:ss',
                  )
                : '-'}
            </div>
          )
        }
        return '-'
      },
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status',
      cell: ({ row }) => {
        return (
          <Badge
            variant={badgeVariant?.[row?.original?.status as keyof typeof badgeVariant] || 'default'}
            corner="full"
          >
            {ISSUED_TICKET_STATUS_LABEL[row?.original?.status as keyof typeof ISSUED_TICKET_STATUS_LABEL]}
          </Badge>
        )
      },
    },
    {
      header: 'Lịch sử vé',
      accessorKey: '_id',
      cell: ({ row }) => {
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleOpenTicketHistory(
                row?.original?._id,
                row?.original?.issuedCode,
                row?.original?.status,
                row?.original?.expiryDate,
              )
            }
          >
            Xem lịch sử
          </Button>
        )
      },
    },
    {
      header: () => (
        <Button variant="outline" size="sm" className="bg-white" onClick={handleSelectAllTickets}>
          Chọn tất cả
        </Button>
      ),
      accessorKey: 'selected',
      meta: {
        justifyContent: 'center',
        textAlign: 'center',
      },

      cell: ({ row }) => {
        if (row?.original?.status === ISSUED_TICKET_STATUS.EXPIRED || !isValidTicket(row?.original?.expiryDate)) {
          return
        }

        return (
          <Checkbox
            checked={selectedTickets.some((ticket) => ticket._id === row?.original?._id)}
            onCheckedChange={() => handleSelectTicket(row?.original)}
          />
        )
      },
    },
  ]

  if (!isCanAccess(CASL_ACCESS_KEY.TICKET_ORDER_PRINT_TICKET)) {
    columns.pop()
  }

  return (
    <PanelViewContent>
      <DataTable
        data={ticketsResponse?.data ?? []}
        columns={columns}
        pagination={{
          type: 'manual',
          total: ticketsResponse?.meta?.total || 0,
          ...pagination,
          setPagination,
        }}
        sortColumn="ticketIndex"
        sortDirection="asc"
        className="h-full"
        tableClassName="table-auto"
        loading={isLoading || isFetching}
      />
    </PanelViewContent>
  )
}

export default TicketListTable
