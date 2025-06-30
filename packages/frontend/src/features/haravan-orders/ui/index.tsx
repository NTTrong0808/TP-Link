'use client'

import LazadaImage from '@/assets/images/lazada.svg'
import ShopeeImage from '@/assets/images/shopee.svg'
import TiktokImage from '@/assets/images/tiktok.svg'
import { AdvancedTable, ColumnDefExtend, TableRefProps, useDataTablePagination } from '@/components/advanced-table'
import { Button } from '@/components/ui/button'
import ColsSetting from '@/components/ui/cols-setting'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toastError } from '@/components/widgets/toast'
import { URLS } from '@/constants/urls'
import { VAT_OPTIONS } from '@/features/order/constants/constant'
import { useAdvancedFilter } from '@/hooks/use-advanced-filter'
import { PanelView, PanelViewContent, PanelViewHeader } from '@/layouts/panel/panel-view'
import { useExportOrders, useGetOrders } from '@/lib/api/queries/haravan-orders/get-orders'
import { useOrdersSummary } from '@/lib/api/queries/haravan-orders/get-orders-summary'
import { useGetVatInvoiceByTransId } from '@/lib/api/queries/haravan-orders/get-vat-invoice-by-transId'
import { IOrder, OrderChannel, OrderPaymentMethod, OrderStatus } from '@/lib/api/queries/haravan-orders/type'
import { cn } from '@/lib/tw'
import { formatInternationalWithoutCurrency } from '@/utils/currency'
import { appDayJs } from '@/utils/dayjs'
import { FileIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-day-picker'
import ErrorsDialog from '../components/errors-dialog'
import ExportOrderExcel from '../components/export-exel-orders'
import ImportExcelVAT from '../components/import-excel-vat'
import RemoveVATButton from '../components/remove-vat-button'
import SuccessDialog from '../components/success-dialog'
import VATForm from '../components/vat-form'
import { INVOICE_SYMBOL } from '../constants/constant'
import { DEFAULT_FILTER } from '../queries/hook'
import { mappingPaymentMethod } from '../utils'

export interface OrderListTableProps extends ComponentProps<typeof PanelViewContent> {}

const mappingOrderStatus = (status: OrderStatus) => {
  if (status === OrderStatus.CANCELLED) {
    return 'Đã hủy'
  }
  if (status === OrderStatus.COMPLETED) {
    return 'Hoàn thành'
  }
  if (status === OrderStatus.RETURNED) {
    return 'Trà hàng'
  }
  return 'Đang xử lý'
}

const mappingOrderStatusStyle = (status: OrderStatus) => {
  if (status === OrderStatus.CANCELLED) {
    return 'bg-[#FFE6E5] text-[#E73C3E]'
  }
  if (status === OrderStatus.COMPLETED) {
    return 'bg-[#D5FCEA] text-[#0D8F53]'
  }
  if (status === OrderStatus.RETURNED) {
    return 'bg-[#EAEAEA] text-[#1F1F1F]'
  }
  return 'bg-[#FAEFCA] text-[#F68342]'
}

const mappingChannel = (channel: OrderChannel) => {
  if (channel === OrderChannel.SPE) {
    return <Image src={ShopeeImage} width={24} height={24} alt="shopee" />
  }
  if (channel === OrderChannel.LZD) {
    return <Image src={LazadaImage} width={24} height={24} alt="lazada" />
  }
  if (channel === OrderChannel.TTS) {
    return <Image src={TiktokImage} width={24} height={24} alt="tiktok" />
  }
  return 'Chưa xác định'
}

const filterOptions = [
  {
    label: 'Ngày đặt hàng',
    value: 'createdAt',
  },
  {
    label: 'Ngày giao ĐVVC',
    value: 'deliveringAt',
  },
  {
    label: 'Ngày giao người mua',
    value: 'deliveredAt',
  },
  {
    label: 'Ngày hóa đơn',
    value: 'invoiceCreatedAt',
  },
]

const HaravanOrdersTable = () => {
  const [filters, setFilters] = useAdvancedFilter({
    createdFrom: DEFAULT_FILTER.createdFrom,
    createdTo: DEFAULT_FILTER.createdTo,
    filterOption: filterOptions?.[0]?.value,
  })
  const [openError, setOpenError] = useState<boolean>(false)
  const [openSuccess, setOpenSuccess] = useState<boolean>(false)
  const [errorRows, setErrorRows] = useState<
    {
      rowNumber: number
      rowData: {
        orderNumber: string
        taxCode: string
        email: string
      }
      errors: string[]
    }[]
  >([])

  const handleErrorImport = (
    errors: {
      rowNumber: number
      rowData: {
        orderNumber: string
        taxCode: string
        email: string
      }
      errors: string[]
    }[],
  ) => {
    setErrorRows(errors)
    setOpenError(true)
  }

  const [dateFilters, setDateFilters] = useState<{
    createdFrom?: string
    createdTo?: string
  }>({
    createdFrom: filters?.createdFrom ? filters?.createdFrom : appDayJs().toISOString(),
    createdTo: filters?.createdTo ? filters?.createdTo : appDayJs().toISOString(),
  })

  const [filterOption, setFilterOption] = useState<string>(filters?.filterOption)

  const ref = useRef<TableRefProps>(null)

  const [sorting, setSorting] = useState<{
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const { mutateAsync: exportInvoices, isPending } = useExportOrders()

  const [columns, setColumns] = useState<ColumnDefExtend<IOrder>[]>([
    {
      header: 'Mã đơn hàng',
      accessorKey: 'orderNumber',
      cell(props) {
        return (
          <Link
            href={URLS.HARAVAN_ORDERS.DETAIL.replace(':id', props.row.original._id)}
            className="hover:underline text-blue-500"
          >
            <span>{props.row.original.orderNumber}</span>
          </Link>
        )
      },
      haveFilter: true,
      filterFieldName: 'orderNumber',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[190px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'orderNumber'),
    },
    {
      header: 'Kênh bán',
      accessorKey: 'channel',
      cell(props) {
        return mappingChannel(props.row.original.channel as OrderChannel)
      },
      haveFilter: true,
      filterFieldName: 'channel',
      filterComponent: 'select',
      filterDataType: 'string',
      filterOptions: [
        {
          label: 'Shopee',
          value: OrderChannel.SPE,
        },
        {
          label: 'Lazada',
          value: OrderChannel.LZD,
        },
        {
          label: 'Tiktok Shop',
          value: OrderChannel.TTS,
        },
      ],
      meta: {
        columnClassName: '!w-[120px]',
        textAlign: 'center',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'channel'),
    },
    {
      header: 'Trạng thái đơn hàng',
      accessorKey: 'status',
      cell(props) {
        return (
          <span
            className={cn(
              mappingOrderStatusStyle(props.row.original?.status as OrderStatus),
              'rounded-lg px-2 py-[2px] mx-auto text-sm font-medium',
            )}
          >
            {mappingOrderStatus(props.row.original?.status as OrderStatus)}
          </span>
        )
      },
      haveFilter: true,
      filterFieldName: 'status',
      filterComponent: 'select',
      filterDataType: 'string',
      filterOptions: [
        {
          label: 'Đã hủy',
          value: OrderStatus.CANCELLED,
        },
        {
          label: 'Hoàn thành',
          value: OrderStatus.COMPLETED,
        },
        {
          label: 'Đang xử lý',
          value: OrderStatus.PROCESSING,
        },
        {
          label: 'Trả hàng',
          value: OrderStatus.RETURNED,
        },
      ],
      meta: {
        columnClassName: '!w-[160px]',
        textAlign: 'center',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'status'),
    },
    {
      header: 'Ngày đặt hàng',
      accessorKey: 'createdAt',
      cell(props) {
        return <span className="">{appDayJs(props.row.original.createdAt).format('DD/MM/YYYY HH:mm')}</span>
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
      header: 'Ngày giao ĐVVC',
      accessorKey: 'deliveringAt',
      cell(props) {
        return (
          <span className="">
            {props.row.original?.deliveringAt
              ? appDayJs(props.row.original?.deliveringAt).format('DD/MM/YYYY HH:mm')
              : '-'}
          </span>
        )
      },
      haveFilter: true,
      filterFieldName: 'deliveringAt',
      filterComponent: 'compare',
      filterDataType: 'date',
      meta: {
        columnClassName: '!w-[240px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'deliveringAt'),
    },
    {
      header: 'Ngày giao người mua',
      accessorKey: 'deliveredAt',
      cell(props) {
        return (
          <span className="">
            {props.row.original?.deliveredAt
              ? appDayJs(props.row.original?.deliveredAt).format('DD/MM/YYYY HH:mm')
              : '-'}
          </span>
        )
      },
      haveFilter: true,
      filterFieldName: 'deliveredAt',
      filterComponent: 'compare',
      filterDataType: 'date',
      meta: {
        columnClassName: '!w-[240px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'deliveredAt'),
    },
    {
      header: 'Hình thức thanh toán',
      accessorKey: 'paymentMethod',
      cell(props) {
        return <span className="">{mappingPaymentMethod(props.row.original?.paymentMethod)}</span>
      },
      haveFilter: true,
      filterFieldName: 'paymentMethod',
      filterComponent: 'select',
      filterDataType: 'string',
      filterOptions: [
        {
          label: 'COD',
          value: OrderPaymentMethod.COD,
        },
        {
          label: 'Sàn thanh toán',
          value: OrderPaymentMethod.PLATFORM,
        },
      ],
      meta: {
        columnClassName: '!w-[180px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'paymentMethod'),
    },
    {
      header: 'Tiền hàng',
      accessorKey: 'totalAmountListPrice',
      cell(props) {
        return (
          <span className="">{formatInternationalWithoutCurrency(props.row.original?.totalAmountListPrice ?? 0)}</span>
        )
      },
      haveFilter: true,
      filterFieldName: 'totalAmountListPrice',
      filterComponent: 'compare',
      filterDataType: 'number',
      meta: {
        columnClassName: '!w-[140px]',
        textAlign: 'right',
      },
      isActive: true,
      footer: () => <span>{formatInternationalWithoutCurrency(summaryData?.data?.totalAmountListPrice ?? 0)}</span>,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'totalAmountListPrice'),
    },
    {
      header: 'Chiết khấu/giảm giá',
      accessorKey: 'totalDiscount',
      cell(props) {
        return <span className="">{formatInternationalWithoutCurrency(props.row.original?.totalDiscount ?? 0)}</span>
      },
      haveFilter: true,
      filterFieldName: 'totalDiscount',
      filterComponent: 'compare',
      filterDataType: 'number',
      meta: {
        columnClassName: '!w-[180px]',
        textAlign: 'right',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'totalDiscount'),
      footer: () => <span>{formatInternationalWithoutCurrency(summaryData?.data?.totalDiscount ?? 0)}</span>,
    },
    {
      header: 'Mã giảm giá',
      accessorKey: 'discountCodes',
      cell(props) {
        return (
          <span className="">{props.row.original?.discountCodes?.map((e: any) => e?.code)?.join(', ') ?? '-'}</span>
        )
      },
      haveFilter: true,
      filterFieldName: 'discountCodes',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[180px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'discountCodes'),
    },
    {
      header: 'Tiền hàng sau giảm giá',
      accessorKey: 'totalAmount',
      cell(props) {
        return <span className="">{formatInternationalWithoutCurrency(props.row.original?.totalAmount ?? 0)}</span>
      },
      haveFilter: true,
      filterFieldName: 'totalAmount',
      filterComponent: 'compare',
      filterDataType: 'number',
      meta: {
        columnClassName: '!w-[180px]',
        textAlign: 'right',
        justifyContent: 'end',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'totalAmount'),
      footer: () => <span>{formatInternationalWithoutCurrency(summaryData?.data?.totalAmount ?? 0)}</span>,
    },
    {
      header: 'Ký hiệu',
      accessorKey: 'invoiceIssuedData.invSymbol',
      cell(props) {
        return <span className="">{props.row.original?.invoiceIssuedData?.invNo ? INVOICE_SYMBOL : '-'}</span>
      },
      haveFilter: true,
      filterFieldName: 'invoiceIssuedData.invSymbol',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[140px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'invoiceIssuedData.invSymbol'),
    },
    {
      header: 'Số hóa đơn',
      accessorKey: 'invoiceIssuedData.invNo',
      cell(props) {
        return (
          <span className="">
            {props.row.original?.invoiceIssuedData?.invNo ? props.row.original?.invoiceIssuedData?.invNo : '-'}
          </span>
        )
      },
      haveFilter: true,
      filterFieldName: 'invoiceIssuedData.invNo',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[140px]',
        textAlign: 'end',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'invoiceIssuedData.invNo'),
    },
    {
      header: 'Ngày hóa đơn',
      accessorKey: 'invoiceCreatedAt',
      cell(props) {
        return (
          <span className="">
            {props.row.original?.invoiceCreatedAt
              ? appDayJs(props.row.original?.invoiceCreatedAt).format('DD/MM/YYYY HH:mm')
              : '-'}
          </span>
        )
      },
      haveFilter: true,
      filterFieldName: 'invoiceCreatedAt',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[180px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'meInvoiceCreatedAt'),
    },
    {
      header: 'Mã CQT',
      accessorKey: 'invoiceIssuedData.invCode',
      cell(props) {
        return (
          <span className="">
            {props.row.original?.invoiceIssuedData?.invCode ? props.row.original?.invoiceIssuedData?.invCode : '-'}
          </span>
        )
      },
      haveFilter: true,
      filterFieldName: 'invoiceIssuedData.invCode',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[240px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'invoiceIssuedData.invCode'),
    },
    {
      header: 'Đơn vị mua hàng',
      accessorKey: 'vatData.legalName',
      cell(props) {
        return (
          <Tooltip>
            <TooltipTrigger className="">
              <p className="line-clamp-1 w-full text-start">{props.row.original?.vatData?.legalName ?? '-'}</p>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              <p className="w-full text-start">{props.row.original?.vatData?.legalName ?? '-'}</p>
            </TooltipContent>
          </Tooltip>
        )
      },
      haveFilter: true,
      filterFieldName: 'vatData.legalName',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[240px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'vatData.legalName'),
    },
    {
      header: 'Mã số thuế',
      accessorKey: 'vatData.taxCode',
      cell(props) {
        return <span className="">{props.row.original?.vatData?.taxCode ?? '-'}</span>
      },
      haveFilter: true,
      filterFieldName: 'vatData.taxCode',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[240px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'vatData.taxCode'),
    },
    {
      header: 'Địa chỉ',
      accessorKey: 'vatData.address',
      cell(props) {
        return (
          <Tooltip>
            <TooltipTrigger className="">
              <p className="line-clamp-1 w-full text-start">{props.row.original?.vatData?.address ?? '-'}</p>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              <p className="w-full text-start">{props.row.original?.vatData?.address ?? '-'}</p>
            </TooltipContent>
          </Tooltip>
        )
      },
      haveFilter: true,
      filterFieldName: 'vatData.address',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[240px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'vatData.address'),
    },
    {
      header: 'Email nhận hóa đơn',
      accessorKey: 'vatData.receiverEmail',
      cell(props) {
        return (
          <Tooltip>
            <TooltipTrigger className="">
              <p className="line-clamp-1 w-full text-start">{props.row.original?.vatData?.receiverEmail || '-'}</p>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              <p className="w-full text-start">{props.row.original?.vatData?.receiverEmail || '-'}</p>
            </TooltipContent>
          </Tooltip>
        )
      },
      haveFilter: true,
      filterFieldName: 'vatData.receiverEmail',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[240px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'vatData.receiverEmail'),
    },
    {
      header: 'Xem HĐ',
      accessorKey: 'vatInfo',
      cell(props) {
        return props.row.original?.invoiceIssuedData?.transId ? (
          <Button
            variant="ghost"
            onClick={() => getVatInvoice({ transId: props.row.original.invoiceIssuedData?.transId ?? '' })}
            disabled={isGetVatInvoicePending}
          >
            <FileIcon className="text-zinc-600" />
          </Button>
        ) : (
          <div className="flex items-center gap-2 justify-center w-full">
            {props?.row?.original?.status !== OrderStatus.CANCELLED && <VATForm orderId={props.row.original?._id} />}
            {props?.row?.original?.status !== OrderStatus.CANCELLED && props?.row?.original?.vatData && (
              <RemoveVATButton orderId={props.row.original?._id} />
            )}
          </div>
        )
      },
      haveFilter: true,
      filterFieldName: 'vatInfo',
      filterComponent: 'select',
      filterDataType: 'string',
      filterOptions: VAT_OPTIONS ?? [],
      meta: {
        columnClassName: '!w-[160px]',
        textAlign: 'center',
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
  } = useGetOrders({
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

  const { mutate: getVatInvoice, isPending: isGetVatInvoicePending } = useGetVatInvoiceByTransId({
    onSuccess: (data, variables) => {
      const url = URL.createObjectURL(data)
      window.open(url, '_blank')
    },
    onError: (error, variables) => {
      toastError('Lỗi khi xem hóa đơn VAT')
    },
  })

  const handleExportOrders = async (receiverEmail: string) => {
    try {
      if (!filters?.createdFrom || !filters?.createdTo) {
        toastError('Vui lòng chọn khoảng thời gian muốn xuất báo cáo.')
        return
      }

      await exportInvoices({
        page: 1,
        size: 50,
        isExportExcel: true,
        receiverEmail,
        ...filters,
      })
      toastError('Yêu cầu xuất báo cáo đang được xử lý và gửi về email. Vui lòng chờ trong giây lát')
    } catch (error) {
      toastError('Lỗi khi xuất báo cáo')
      console.error(error)
    }
  }

  const handleRefetch = async () => {
    setFilters((state) => ({ ...state, ...dateFilters, filterOption: filterOption }))
    setPagination((value) => ({ ...value, pageIndex: 0 }))
    await Promise.all([await refetchOrderSummary(), await refetchOrders()])
  }

  useEffect(() => {
    setColumns((state) => {
      const temp = [...state]

      const totalAmountListPriceIndex = temp.findIndex((e) => e?.filterFieldName === 'totalAmountListPrice')
      if (totalAmountListPriceIndex !== -1) {
        temp[totalAmountListPriceIndex] = {
          ...temp[totalAmountListPriceIndex],
          footer: () => (
            <span className="text-sm font-semibold">
              {formatInternationalWithoutCurrency(summaryData?.data?.totalAmountListPrice ?? 0)}
            </span>
          ),
        }
      }

      const totalAmountIndex = temp.findIndex((e) => e?.filterFieldName === 'totalAmount')
      if (totalAmountIndex !== -1) {
        temp[totalAmountIndex] = {
          ...temp[totalAmountIndex],
          footer: () => (
            <span className="text-sm font-semibold">
              {formatInternationalWithoutCurrency(summaryData?.data?.totalAmount ?? 0)}
            </span>
          ),
        }
      }

      const totalDiscountIndex = temp.findIndex((e) => e?.filterFieldName === 'totalDiscount')
      if (totalDiscountIndex !== -1) {
        temp[totalDiscountIndex] = {
          ...temp[totalDiscountIndex],
          footer: () => (
            <span className="text-sm font-semibold">
              {formatInternationalWithoutCurrency(summaryData?.data?.totalDiscount ?? 0)}
            </span>
          ),
        }
      }

      return temp
    })
  }, [summaryData])

  useEffect(() => {
    setPagination((value) => ({ ...value, pageIndex: 0 }))
  }, [filters])

  return (
    <TooltipProvider delayDuration={0}>
      <PanelView>
        <PanelViewHeader
          action={
            <div className="flex items-center gap-4">
              <ImportExcelVAT onError={handleErrorImport} onSuccess={() => setOpenSuccess(true)} />
              <ColsSetting columns={columns} onSaveColsSetting={(columns) => setColumns(columns as any)} />
              <ExportOrderExcel handleSubmit={handleExportOrders} isLoading={isPending} />
            </div>
          }
        >
          <div className="flex shrink-0 gap-3">
            {errorRows.length > 0 && <ErrorsDialog open={openError} setOpen={setOpenError} errorRows={errorRows} />}
            <SuccessDialog open={openSuccess} setOpen={setOpenSuccess} />
            <Select
              defaultValue={filterOptions?.[0]?.value}
              onValueChange={(value) => {
                setFilterOption(value)
              }}
            >
              <SelectTrigger className="!h-10 bg-white">
                <SelectValue placeholder="Giá trị" className="!h-8 !bg-white" />
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                {filterOptions.map((option) => (
                  <SelectItem key={`filter-${option.value}`} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              className="[&_button]:!h-10"
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
              onClick={() => ref?.current?.clearFilters()}
              variant="outline"
              size="lg"
              className="bg-white"
            >
              Xóa bộ lọc
            </Button>
            {/* <Button
            onClick={handleResetFilter}
            disabled={isPending || isFetching}
            variant="outline"
            size="lg"
            className="bg-white"
          >
            Xóa bộ lọc
          </Button> */}
            <div className="flex items-center gap-1 text-sm text-neutral-grey-400 whitespace-nowrap">
              <div className="px-2 py-1 rounded-sm bg-neutral-grey-100 text-sm font-medium text-black">
                {data?.meta?.total ?? 0}
              </div>
              đơn hàng
            </div>
          </div>
        </PanelViewHeader>
        <PanelViewContent>
          <AdvancedTable
            ref={ref}
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
    </TooltipProvider>
  )
}

export default HaravanOrdersTable
