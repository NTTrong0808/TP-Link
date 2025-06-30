'use client'

import { DataTable, useDataTablePagination } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toastError } from '@/components/widgets/toast'
import { URLS } from '@/constants/urls'
import { formatCurrency } from '@/helper/number'
import { useSearch } from '@/hooks/use-search'
import { PanelViewContent } from '@/layouts/panel/panel-view'
import { ORDER_STATUS_LABEL } from '@/lib/api/queries/order/constant'
import { useOrders } from '@/lib/api/queries/order/get-orders'
import { useGetVatInvoiceMutation } from '@/lib/api/queries/order/get-vat-invoice'
import { IOrder, OrderVariables } from '@/lib/api/queries/order/schema'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { appDayJs } from '@/utils/dayjs'
import { ColumnDef } from '@tanstack/react-table'
import { FileIcon } from 'lucide-react'
import Link from 'next/link'
import { ComponentProps } from 'react'
import { useUpdateEffect } from 'react-use'
import { useTotalOrder } from '../hooks/use-total-order'
import OrderStatusBadge from './order-status-badge'

export interface OrderListTableProps extends ComponentProps<typeof PanelViewContent> {
  variables?: OrderVariables
}

const OrderListTable = ({ variables }: OrderListTableProps) => {
  const canAccess = useCanAccess()
  const isCanViewOrder = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_VIEW)
  const isCanViewOrderDetail = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_VIEW_DETAIL)
  const isCanViewOnlineOrder = canAccess(CASL_ACCESS_KEY.TICKET_ONLINE_ORDER_VIEW)
  const isCanViewOrderByEmployee = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_BY_EMP_VIEW)

  const [search] = useSearch()

  const { setTotal } = useTotalOrder()

  const { pagination, setPagination } = useDataTablePagination({
    defaultPageSize: 50,
    defaultPageIndex: 0,
  })

  const { data, isLoading, isFetching, isSuccess } = useOrders({
    select: (resp) => resp,
    variables: {
      ...variables,
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
    },

    enabled: isCanViewOrder || isCanViewOnlineOrder || isCanViewOrderByEmployee,
  })

  const { mutate: getVatInvoice, isPending: isGetVatInvoicePending } = useGetVatInvoiceMutation({
    onSuccess: (data, variables) => {
      const url = URL.createObjectURL(data)
      window.open(url, '_blank')
    },
    onError: (error, variables) => {
      toastError('Lỗi khi xem hóa đơn VAT')
    },
  })

  useUpdateEffect(() => {
    if (isSuccess) {
      setTotal(data?.meta?.total || 0)
    }
  }, [data, isSuccess])

  useUpdateEffect(() => {
    if (search) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }))
    }
  }, [search])

  const columns: ColumnDef<IOrder>[] = [
    {
      header: 'Số booking',
      accessorKey: 'bookingCode',
      cell(props) {
        if (isCanViewOrderDetail) {
          return (
            <Link
              href={URLS.ADMIN.ORDER.DETAIL.replace(':id', props.row.original._id)}
              className="hover:underline text-semantic-info-300 hover:text-semantic-info-500"
            >
              {props.row.original.bookingCode}
            </Link>
          )
        }
        return props.row.original.bookingCode
      },
    },

    {
      header: 'Mã biên lai',
      accessorKey: 'receiptNumber',
      cell(props) {
        return <div className="text-nowrap">{props.row.original.receiptNumber}</div>
      },
    },
    {
      header: 'Thu ngân',
      accessorKey: 'createdByName',
      cell(props) {
        return (
          <Tooltip>
            <TooltipTrigger className="">
              <p className=" line-clamp-1 w-full text-start">{props?.row?.original?.createdByName || '-'}</p>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              <p className="  w-full text-start">{props?.row?.original?.createdByName || '-'}</p>
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      header: 'Kênh',
      accessorKey: 'saleChannelName',
      cell(props) {
        return <div className="text-nowrap">{props.row.original.saleChannelName}</div>
      },
    },
    {
      header: 'Máy POS',
      accessorKey: 'posTerminalName',
      cell(props) {
        if (props?.row?.original?.posTerminalName) {
          return (
            <Tooltip>
              <TooltipTrigger className="">
                <p className=" line-clamp-1 w-full text-start">{props?.row?.original?.posTerminalName || '-'}</p>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                <p className="  w-full text-start">{props?.row?.original?.posTerminalName || '-'}</p>
              </TooltipContent>
            </Tooltip>
          )
        }
        return '-'
      },
    },
    {
      header: 'Ngày đặt',
      accessorKey: 'createdAt',
      sortDescFirst: true,
      cell(props) {
        return (
          <div className="text-nowrap">
            {props.row.original.createdAt && appDayJs(props.row.original.createdAt).isValid()
              ? appDayJs(props.row.original.createdAt).format('DD/MM/YY HH:mm:ss')
              : '-'}
          </div>
        )
      },
    },
    {
      header: 'Khách hàng',
      accessorKey: 'customer.name',

      cell(props) {
        if (props?.row?.original?.customer?.name) {
          return (
            <Tooltip>
              <TooltipTrigger className="">
                <p className=" line-clamp-1 w-full text-start">{props?.row?.original?.customer?.name || '-'}</p>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                <p className="  w-full text-start">{props?.row?.original?.customer?.name || '-'}</p>
              </TooltipContent>
            </Tooltip>
          )
        }
        return '-'
      },
    },
    {
      header: 'Tổng tiền',
      accessorKey: 'totalPaid',
      meta: {
        textAlign: 'right',
        justifyContent: 'end',
      },
      cell(props) {
        return <span className="after:content-['đ'] after:ml-0.5">{formatCurrency(props.row.original.totalPaid)}</span>
      },
    },
    {
      header: 'Số vé',
      accessorKey: 'items',
      meta: {
        textAlign: 'right',
        justifyContent: 'end',
      },
      cell(props) {
        return props.row.original?.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0
      },
    },
    {
      header: 'PTTT',
      accessorKey: 'paymentMethodName',
      cell(props) {
        const booking = props.row.original

        let value = ''

        if (
          booking?.paymentMethodName &&
          booking?.paymentMethodName?.toLowerCase()?.includes('payoo') &&
          booking?.payooData?.InvoiceNo
        ) {
          value = booking?.payooData?.InvoiceNo?.toUpperCase()?.includes('QR') ? 'Payoo QR' : booking?.paymentMethodName
        }
        value = booking?.paymentMethodName || 'Không có'

        return <div className="text-nowrap">{value}</div>
      },
    },

    {
      header: 'Trạng thái',
      accessorKey: 'status',
      cell(props) {
        return <OrderStatusBadge status={props.row.original.status as keyof typeof ORDER_STATUS_LABEL} />
      },
    },

    {
      header: 'Ghi chú',
      accessorKey: 'note',
      cell(props) {
        return (
          <Tooltip>
            <TooltipTrigger className="">
              <p className=" line-clamp-1 w-full text-start">{props?.row?.original?.note}</p>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              <p className="  w-full text-start">{props?.row?.original?.note}</p>
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      header: 'VAT',

      accessorKey: 'vatInfo',
      cell(props) {
        if (props.row.original?.metadata?.transId) {
          return (
            <Button
              variant="ghost"
              onClick={() => getVatInvoice({ bookingId: props.row.original._id })}
              disabled={isGetVatInvoicePending}
            >
              <FileIcon className="text-zinc-600" />
            </Button>
          )
        }
      },
    },
  ]

  return (
    <PanelViewContent>
      <DataTable
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
        tableClassName="table-auto"
        loading={isLoading || isFetching}
      />
    </PanelViewContent>
  )
}

export default OrderListTable
