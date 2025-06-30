'use client'

import { AdvancedTable, ColumnDefExtend, TableRefProps, useDataTablePagination } from '@/components/advanced-table'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ColsSetting from '@/components/ui/cols-setting'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toastError } from '@/components/widgets/toast'
import { URLS } from '@/constants/urls'
import { STATUS_OPTIONS, VAT_OPTIONS } from '@/features/order/constants/constant'
import { formatCurrency } from '@/helper'
import { useAdvancedFilter } from '@/hooks/use-advanced-filter'
import { PanelView, PanelViewContent, PanelViewHeader } from '@/layouts/panel/panel-view'
import { ORDER_STATUS_LABEL } from '@/lib/api/queries/order/constant'
import { useExportOrders, useOrders } from '@/lib/api/queries/order/get-orders'
import { useOrdersSummary } from '@/lib/api/queries/order/get-orders-summary'
import { useGetVatInvoiceMutation } from '@/lib/api/queries/order/get-vat-invoice'
import { IOrder, OrderStatus } from '@/lib/api/queries/order/schema'
import { useSuspensePaymentMethods } from '@/lib/api/queries/payment-method/get-payment-methods'
import { useGetTerminals } from '@/lib/api/queries/pos-terminal/get-pos-terminals'
import { useGetSaleChannels } from '@/lib/api/queries/sale-channel/get-sale-channels'
import { GroupSaleChannel } from '@/lib/api/queries/sale-channel/types'
import { SALE_CHANNEL_RETAIL_CODE } from '@/lib/api/queries/service/get-services-by-sale-channel-code'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { useAuth } from '@/lib/auth/context'
import { formatInternationalCurrency } from '@/utils/currency'
import { appDayJs } from '@/utils/dayjs'
import { FileIcon } from 'lucide-react'
import Link from 'next/link'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-day-picker'
import ExportBookingExcel from '../components/export-exel-bookings'
import { DEFAULT_FILTER } from '../queries/hook'

export interface OrderListTableProps extends ComponentProps<typeof PanelViewContent> {}

const badgeVariant = {
  PROCESSING: 'warning',
  COMPLETED: 'default',
  CANCELLED: 'destructive',
} as Record<keyof typeof OrderStatus, BadgeProps['variant']>

const NewOrderListTable = () => {
  const isCanAccess = useCanAccess()
  const { currentUser } = useAuth()
  const isCanViewOrderByEmployee = isCanAccess(CASL_ACCESS_KEY.TICKET_ORDER_BY_EMP_VIEW)
  const isCanViewOrder = isCanAccess(CASL_ACCESS_KEY.TICKET_ORDER_VIEW)
  const isCanViewOnlineOrder = isCanAccess(CASL_ACCESS_KEY.TICKET_ONLINE_ORDER_VIEW)
  const [filters, setFilters] = useAdvancedFilter({
    createdBy: isCanViewOrderByEmployee && !isCanViewOrder ? [currentUser?._id as string] : [],
    saleChannelGroup: isCanViewOnlineOrder && !isCanViewOrder ? [GroupSaleChannel.ONLINE] : [],
    createdFrom: DEFAULT_FILTER.createdFrom,
    createdTo: DEFAULT_FILTER.createdTo,
  })
  const { data: saleChannels } = useGetSaleChannels()
  const { data: posTerminals } = useGetTerminals()

  const isCanExportOrder = isCanAccess(CASL_ACCESS_KEY.TICKET_ORDER_EXPORT)

  const [dateFilters, setDateFilters] = useState<{
    createdFrom?: string
    createdTo?: string
  }>({
    createdFrom: filters?.createdFrom ? filters?.createdFrom : appDayJs().toISOString(),
    createdTo: filters?.createdTo ? filters?.createdTo : appDayJs().toISOString(),
  })
  const [sorting, setSorting] = useState<{
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const tableRef = useRef<TableRefProps>(null)

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
  const { mutateAsync: exportOrders, isPending } = useExportOrders()

  const [columns, setColumns] = useState<ColumnDefExtend<IOrder>[]>([
    {
      header: 'Số booking',
      accessorKey: 'bookingCode',
      cell(props) {
        if (isCanAccess(CASL_ACCESS_KEY.TICKET_ORDER_VIEW_DETAIL)) {
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
      haveFilter: true,
      filterFieldName: 'bookingCode',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[180px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'bookingCode'),
    },
    {
      header: 'Mã biên lai',
      accessorKey: 'receiptNumber',
      cell(props) {
        return <div className="text-nowrap">{props.row.original.receiptNumber}</div>
      },
      haveFilter: true,
      filterFieldName: 'receiptNumber',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[180px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'receiptNumber'),
    },
    {
      header: 'Thu ngân',
      accessorKey: 'createdByName',
      cell(props) {
        return (
          <Tooltip>
            <TooltipTrigger className="">
              <p className="line-clamp-1 w-full text-start">{props?.row?.original?.createdByName || '-'}</p>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              <p className="w-full text-start">{props?.row?.original?.createdByName || '-'}</p>
            </TooltipContent>
          </Tooltip>
        )
      },
      haveFilter: true,
      filterFieldName: 'createdByName',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[180px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'createdByName'),
    },
    {
      header: 'Kênh',
      accessorKey: 'saleChannelName',
      cell(props) {
        return <div className="text-nowrap">{props.row.original.saleChannelName}</div>
      },
      haveFilter: true,
      filterFieldName: 'saleChannelId',
      filterComponent: 'select',
      meta: {
        columnClassName: '!w-[120px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'saleChannelId'),
    },
    {
      header: 'Máy POS',
      accessorKey: 'posTerminalName',
      cell(props) {
        if (props?.row?.original?.posTerminalName) {
          return (
            <Tooltip>
              <TooltipTrigger className="">
                <p className="line-clamp-1 w-full text-start">{props?.row?.original?.posTerminalName || '-'}</p>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                <p className="w-full text-start">{props?.row?.original?.posTerminalName || '-'}</p>
              </TooltipContent>
            </Tooltip>
          )
        }
        return '-'
      },
      haveFilter: true,
      filterFieldName: 'posTerminalId',
      filterComponent: 'select',
      meta: {
        columnClassName: '!w-[120px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'posTerminalId'),
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
      haveFilter: true,
      filterFieldName: 'createdAt',
      filterComponent: 'compare',
      filterDataType: 'date',
      meta: {
        columnClassName: '!w-[240px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'createdAt'),
    },
    {
      header: 'Ngày đến',
      accessorKey: 'checkInDate',
      sortDescFirst: true,
      cell(props) {
        return (
          <div className="text-nowrap">
            {props.row.original.checkInDate && appDayJs(props.row.original.checkInDate).isValid()
              ? appDayJs(props.row.original.checkInDate).format('DD/MM/YYYY')
              : '-'}
          </div>
        )
      },
      haveFilter: true,
      filterFieldName: 'checkInDate',
      filterComponent: 'compare',
      filterDataType: 'date',
      meta: {
        columnClassName: '!w-[240px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'checkInDate'),
    },
    {
      header: 'Khách hàng',
      accessorKey: 'customer.name',

      cell(props) {
        if (props?.row?.original?.customer?.name) {
          return (
            <Tooltip>
              <TooltipTrigger className="">
                <p className="w-full text-start line-clamp-1 break-all">
                  {props?.row?.original?.customer?.name || '-'}
                </p>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                <p className="w-full text-start">{props?.row?.original?.customer?.name || '-'}</p>
              </TooltipContent>
            </Tooltip>
          )
        }
        return '-'
      },
      haveFilter: true,
      filterFieldName: 'customer.name',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[180px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'customer.name'),
    },
    {
      header: 'Tổng tiền',
      accessorKey: 'totalPaid',
      cell(props) {
        return <span>{formatInternationalCurrency(props.row.original.totalPaid)}</span>
      },
      haveFilter: true,
      filterFieldName: 'totalPaid',
      filterComponent: 'compare',
      filterDataType: 'number',
      meta: {
        columnClassName: '!w-[160px]',
        textAlign: 'right',
        justifyContent: 'end',
      },
      footer: () => <span>{formatInternationalCurrency(summaryData?.data?.totalRevenue ?? 0)}</span>,
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'totalPaid'),
    },
    {
      header: 'Số vé',
      accessorKey: 'totalTickets',
      haveFilter: true,
      filterFieldName: 'totalTickets',
      filterComponent: 'compare',
      filterDataType: 'number',
      meta: {
        columnClassName: '!w-[120px]',
        textAlign: 'right',
        justifyContent: 'end',
      },
      footer: () => <span>{formatInternationalCurrency(summaryData?.data?.totalTickets ?? 0)}</span>,

      isActive: true,

      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'totalTickets'),
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
      haveFilter: true,
      filterFieldName: 'paymentMethodId',
      filterComponent: 'select',
      meta: {
        columnClassName: '!w-[150px]',
      },
      isActive: true,

      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'paymentMethodId'),
    },

    {
      header: 'Trạng thái',
      accessorKey: 'status',
      cell(props) {
        return (
          <Badge
            variant={badgeVariant?.[props.row.original.status as keyof typeof badgeVariant] || 'secondary'}
            corner="full"
            className="text-nowrap"
          >
            {ORDER_STATUS_LABEL[props.row.original.status as keyof typeof ORDER_STATUS_LABEL] ||
              props.row.original.status ||
              'Không rõ'}
          </Badge>
        )
      },
      haveFilter: true,
      filterFieldName: 'status',
      filterComponent: 'select',
      filterOptions: STATUS_OPTIONS ?? [],
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[150px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'status'),
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
      haveFilter: true,
      filterFieldName: 'note',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[160px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'note'),
    },
    {
      header: 'Ngày phát hành HĐ',
      accessorKey: 'meInvoiceCreatedAt',
      sortDescFirst: true,
      cell(props) {
        return (
          <div className="text-nowrap">
            {props.row.original.meInvoiceCreatedAt
              ? appDayJs(props.row.original.meInvoiceCreatedAt * 1000).format('DD/MM/YY HH:mm:ss')
              : '-'}
          </div>
        )
      },
      haveFilter: true,
      filterFieldName: 'meInvoiceCreatedAt',
      filterComponent: 'compare',
      filterDataType: 'date',
      meta: {
        columnClassName: '!w-[240px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'meInvoiceCreatedAt'),
    },
    {
      header: 'Ký hiệu',
      accessorKey: 'invoiceSymbol',
      sortDescFirst: true,
      cell(props) {
        return <div className="text-nowrap">{props.row.original.metadata?.invNo ? '1C25MLV' : '-'}</div>
      },
      haveFilter: true,
      filterFieldName: 'invoiceSymbol',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[120px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'invoiceSymbol'),
    },
    {
      header: 'Số hoá đơn',
      accessorKey: 'metadata.invNo',
      sortDescFirst: true,
      cell(props) {
        return (
          <div className="text-nowrap">
            {props.row.original.metadata?.invNo ? props.row.original.metadata?.invNo : '-'}
          </div>
        )
      },
      haveFilter: true,
      filterFieldName: 'metadata.invNo',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[120px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'metadata.invNo'),
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
      haveFilter: true,
      filterFieldName: 'vatInfo',
      filterComponent: 'select',
      filterDataType: 'string',
      filterOptions: VAT_OPTIONS ?? [],
      meta: {
        columnClassName: '!w-[120px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'vatInfo'),
    },
  ])

  const { pagination, setPagination } = useDataTablePagination()

  const {
    data,
    isLoading,
    isFetching,
    isSuccess,
    refetch: refetchOrders,
  } = useOrders({
    select: (resp) => resp,
    variables: {
      ...filters,
      sortBy: sorting.sortBy,
      sortOrder: sorting.sortOrder,
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
    },
  })

  const { data: summaryData, refetch: refetchOrderSummary } = useOrdersSummary({
    select: (resp) => resp,
    variables: {
      ...filters,
    },
  })

  const { mutate: getVatInvoice, isPending: isGetVatInvoicePending } = useGetVatInvoiceMutation({
    onSuccess: (data, variables) => {
      const url = URL.createObjectURL(data)
      window.open(url, '_blank')
    },
    onError: (error, variables) => {
      console.log(error)
      toastError('Lỗi khi xem hóa đơn VAT')
    },
  })

  useEffect(() => {
    setColumns((state) => {
      const temp = [...state]
      const paymentMethodIndex = temp.findIndex((e) => e?.filterFieldName === 'paymentMethodId')
      if (paymentMethodIndex !== -1) {
        temp[paymentMethodIndex] = {
          ...temp[paymentMethodIndex],
          filterOptions: paymentMethods,
        }
      }

      const posIndex = temp.findIndex((e) => e?.filterFieldName === 'posTerminalId')
      if (posIndex !== -1) {
        temp[posIndex] = {
          ...temp[posIndex],
          filterOptions: posTerminals?.data?.map((e) => ({
            value: e?._id?.toString(),
            label: e?.name,
          })),
        }
      }

      const saleChannelIndex = temp.findIndex((e) => e?.filterFieldName === 'saleChannelId')
      if (saleChannelIndex !== -1) {
        temp[saleChannelIndex] = {
          ...temp[saleChannelIndex],
          filterOptions: saleChannels?.data
            ?.filter((e) =>
              isCanViewOnlineOrder && !isCanViewOrder && !isCanViewOrderByEmployee
                ? e.groupSaleChannel === GroupSaleChannel.ONLINE
                : !isCanViewOrder && !isCanViewOnlineOrder && isCanViewOrderByEmployee
                ? e.code === SALE_CHANNEL_RETAIL_CODE
                : true,
            )
            ?.map((e) => ({
              value: e?._id,
              label: e?.name,
            })),
        }
      }

      const totalPaidIndex = temp.findIndex((e) => e?.filterFieldName === 'totalPaid')
      if (totalPaidIndex !== -1) {
        temp[totalPaidIndex] = {
          ...temp[totalPaidIndex],
          footer: () => (
            <span className="text-sm font-semibold">
              {formatInternationalCurrency(summaryData?.data?.totalRevenue ?? 0)}
            </span>
          ),
        }
      }

      const totalTicketsIndex = temp.findIndex((e) => e?.filterFieldName === 'totalTickets')
      if (totalTicketsIndex !== -1) {
        temp[totalTicketsIndex] = {
          ...temp[totalTicketsIndex],
          footer: () => (
            <span className="text-sm font-semibold">{formatCurrency(summaryData?.data?.totalTickets ?? 0)}</span>
          ),
        }
      }

      return temp
    })
  }, [paymentMethods, posTerminals, saleChannels, summaryData])

  const handleExportOrders = async (receiverEmail: string) => {
    try {
      if (!filters?.createdFrom || !filters?.createdTo) {
        toastError('Vui lòng chọn khoảng thời gian muốn xuất báo cáo.')
        return
      }

      await exportOrders({
        ...filters,
        sortBy: sorting.sortBy,
        sortOrder: sorting.sortOrder,
        isExportExcel: true,
        receiverEmail,
      })
      toastError('Yêu cầu xuất báo cáo đang được xử lý và gửi về email. Vui lòng kiểm tra email')
    } catch (error) {
      toastError('Lỗi khi xuất báo cáo')
      console.error(error)
    }
  }

  const handleRefetch = async () => {
    setFilters((state) => ({ ...state, ...dateFilters }))
    await Promise.all([await refetchOrderSummary(), await refetchOrders()])
  }

  return (
    <PanelView>
      <PanelViewHeader
        action={
          <div className="flex items-center gap-4">
            <ColsSetting columns={columns} onSaveColsSetting={(columns) => setColumns(columns as any)} />
            {isCanExportOrder && (
              <ExportBookingExcel
                handleSubmit={handleExportOrders}
                isLoading={isPending}
                defaultEmail={currentUser?.email}
              />
            )}
          </div>
        }
      >
        <div className="flex shrink-0 gap-3">
          <DateRangePicker
            showIcon={false}
            from={dateFilters?.createdFrom ? appDayJs(dateFilters?.createdFrom).toDate() : undefined}
            to={dateFilters?.createdTo ? appDayJs(dateFilters?.createdTo).toDate() : undefined}
            onSelect={function (range: DateRange | undefined): void {
              setDateFilters({
                createdFrom: range?.from ? appDayJs(range.from).toISOString() : undefined,
                createdTo: range?.to ? appDayJs(range.to).toISOString() : undefined,
              })
            }}
            placeholder="Chọn ngày"
          />
          <Button
            isLoading={isPending || isFetching}
            onClick={handleRefetch}
            variant="outline"
            size="lg"
            className="bg-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M6.875 7.5H3.125V3.75"
                stroke="#A7A7A7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.125 7.50002L5.33437 5.29065C6.61388 4.01119 8.34621 3.28775 10.1556 3.27722C11.9651 3.26669 13.7057 3.96992 15 5.2344"
                stroke="#A7A7A7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.125 12.5H16.875V16.25"
                stroke="#A7A7A7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.875 12.5L14.6656 14.7094C13.3861 15.9888 11.6538 16.7123 9.84437 16.7228C8.03494 16.7333 6.29431 16.0301 5 14.7656"
                stroke="#A7A7A7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Lấy dữ liệu
          </Button>
          <Button
            isLoading={isPending || isFetching}
            onClick={() => tableRef?.current?.clearFilters()}
            variant="outline"
            size="lg"
            className="bg-white"
          >
            Xóa bộ lọc
          </Button>
          <div className="flex items-center gap-1 text-sm text-neutral-grey-400">
            <div className="px-2 py-1 rounded-sm bg-neutral-grey-100 text-sm font-medium text-black">
              {data?.meta?.total ?? 0}
            </div>
            đơn hàng
          </div>
        </div>
      </PanelViewHeader>
      <PanelViewContent>
        <AdvancedTable
          ref={tableRef}
          data={data?.data || []}
          columns={columns?.filter((column) => column.isActive)}
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
      </PanelViewContent>
    </PanelView>
  )
}

export default NewOrderListTable
