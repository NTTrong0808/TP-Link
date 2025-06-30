'use client'

import { AdvancedTable, TableRefProps, useDataTablePagination } from '@/components/advanced-table'
import { Badge } from '@/components/ui/badge'
import { STATUS_OPTIONS } from '@/features/new-orders/constants/constant'
import { ORDER_STATUS_BADGE_VARIANT } from '@/features/order/constants/constant'
import { formatCurrency } from '@/helper'
import { useAdvancedFilter } from '@/hooks/use-advanced-filter'
import { PanelView, PanelViewContent } from '@/layouts/panel/panel-view'
import { ORDER_STATUS_LABEL } from '@/lib/api/queries/order/constant'
import {
  useExportRevenueByBookingMutation,
  useGetRevenueByBooking,
} from '@/lib/api/queries/report/get-revenue-by-booking'
import { IRevenueByBooking } from '@/lib/api/queries/report/schema'
import { appDayJs } from '@/utils/dayjs'
import { useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useBoolean } from 'react-use'
import { ColumnDefExtend } from '../../../components/advanced-table'
import ReportFilter from '../components/report-filter'
import { DEFAULT_REPORT_FILTER } from '../constants'

const RevenueByBooking = () => {
  const ql = useQueryClient()

  const [isGetData, setIsGetData] = useBoolean(false)
  const tableRef = useRef<TableRefProps>(null)

  const [filter, setFilter] = useAdvancedFilter({
    ...DEFAULT_REPORT_FILTER,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const { pagination, setPagination } = useDataTablePagination()

  const { data, isFetching, refetch } = useGetRevenueByBooking({
    variables: {
      ...filter,
      page: pagination?.pageIndex + 1,
      size: pagination?.pageSize,
    },
    enabled: isGetData,
  })

  const { mutate: exportReport } = useExportRevenueByBookingMutation()

  const summary = data?.meta?.summary

  const columns: ColumnDefExtend<IRevenueByBooking>[] = [
    {
      header: 'Ngày',
      accessorKey: 'createdAt',
      cell: ({ row }) => appDayJs(row.original.createdAt).format('DD/MM/YYYY'),
      filterComponent: 'compare',
      filterDataType: 'date',
      filterFieldName: 'createdAt',
      footer: () => <span>Cộng</span>,
      meta: {
        justifyContent: 'center',
      },
    },
    {
      header: 'Giờ',
      accessorKey: 'createdAtTime',
      // cell: ({ row }) => appDayJs(row.original.createdAt).format('HH:mm:ss'),
      filterComponent: 'compare',
      filterDataType: 'string',
      filterFieldName: 'createdAtTime',
      meta: {
        justifyContent: 'center',
      },
    },
    {
      header: 'Số booking',
      accessorKey: 'bookingCode',
      filterComponent: 'compare',
      filterDataType: 'string',
      filterFieldName: 'bookingCode',
      className: 'w-48',
      meta: {
        justifyContent: 'center',
      },
    },
    {
      header: 'Số biên lai',
      accessorKey: 'receiptNumber',
      filterComponent: 'compare',
      filterDataType: 'string',
      filterFieldName: 'receiptNumber',
      className: 'w-48',
      meta: {
        justifyContent: 'center',
      },
    },
    {
      header: 'Trạng thái đơn hàng',
      accessorKey: 'status',
      filterComponent: 'select',
      filterDataType: 'string',
      filterFieldName: 'status',
      filterOptions: STATUS_OPTIONS ?? [],
      cell(props) {
        return (
          <Badge
            variant={
              ORDER_STATUS_BADGE_VARIANT?.[props.row.original.status as keyof typeof ORDER_STATUS_BADGE_VARIANT] ||
              'secondary'
            }
            corner="full"
            className="text-nowrap"
          >
            {ORDER_STATUS_LABEL[props.row.original.status as keyof typeof ORDER_STATUS_LABEL] ||
              props.row.original.status ||
              'Không rõ'}
          </Badge>
        )
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Tổng doanh số</div>
          <div>(1=2+3)</div>
        </div>
      ),
      accessorKey: 'totalRevenue',
      cell: ({ row }) => formatCurrency(row.original.totalRevenue),
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalRevenue',
      footer: () => <span>{formatCurrency(summary?.totalRevenue || 0)}</span>,
      meta: {
        textAlign: 'right',
        justifyContent: 'center',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Tiền thuế GTGT</div>
          <div>(2)</div>
        </div>
      ),
      accessorKey: 'totalVAT',
      cell: ({ row }) => formatCurrency(row.original.totalVAT),
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalVAT',
      footer: () => <span>{formatCurrency(summary?.totalVAT || 0)}</span>,
      meta: {
        textAlign: 'right',
        justifyContent: 'center',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Tiền trước thuế</div>
          <div>(3=6-5-4)</div>
        </div>
      ),
      accessorKey: 'totalPreVAT',
      cell: ({ row }) => formatCurrency(row.original.totalPreVAT),
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalPreVAT',
      footer: () => <span>{formatCurrency(summary?.totalPreVAT || 0)}</span>,
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Chiết khấu/giảm giá</div>
          <div>(4)</div>
        </div>
      ),
      accessorKey: 'totalDiscount',
      cell: ({ row }) => formatCurrency(row.original.totalDiscount),
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalDiscount',
      footer: () => <span>{formatCurrency(summary?.totalDiscount || 0)}</span>,
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Khuyến mại</div>
          <div>(5)</div>
        </div>
      ),
      accessorKey: 'totalPromotion',
      cell: ({ row }) => formatCurrency(row.original.totalPromotion),
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalPromotion',
      footer: () => <span>{formatCurrency(summary?.totalPromotion || 0)}</span>,
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Tiền hàng</div>
          <div>(6)</div>
        </div>
      ),
      accessorKey: 'totalOriginalRevenue',
      cell: ({ row }) => formatCurrency(row.original.totalOriginalRevenue),
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalOriginalRevenue',
      footer: () => <span>{formatCurrency(summary?.totalOriginalRevenue || 0)}</span>,
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Chuyển khoản</div>
          <div>(7)</div>
        </div>
      ),
      accessorKey: 'totalRevenueByBankTransfer',
      cell: ({ row }) => formatCurrency(row.original.totalRevenueByBankTransfer),
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalRevenueByBankTransfer',
      footer: () => <span>{formatCurrency(summary?.totalRevenueByBankTransfer || 0)}</span>,
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Tiền mặt</div>
          <div>(8)</div>
        </div>
      ),
      accessorKey: 'totalRevenueByCash',
      cell: ({ row }) => formatCurrency(row.original.totalRevenueByCash),
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalRevenueByCash',
      footer: () => <span>{formatCurrency(summary?.totalRevenueByCash || 0)}</span>,
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Payoo</div>
          <div>(9)</div>
        </div>
      ),
      accessorKey: 'totalRevenueByPayoo',
      cell: ({ row }) => formatCurrency(row.original.totalRevenueByPayoo),
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalRevenueByPayoo',
      footer: () => <span>{formatCurrency(summary?.totalRevenueByPayoo || 0)}</span>,
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Voucher</div>
          <div>(10)</div>
        </div>
      ),
      accessorKey: 'totalVoucher',
      cell: ({ row }) => formatCurrency(row.original.totalVoucher),
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalVoucher',
      footer: () => <span>{formatCurrency(summary?.totalVoucher || 0)}</span>,
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Điểm</div>
          <div>(11)</div>
        </div>
      ),
      accessorKey: 'totalPoint',
      cell: ({ row }) => formatCurrency(row.original.totalPoint),
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalPoint',
      footer: () => <span>{formatCurrency(summary?.totalPoint || 0)}</span>,
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Ghi nợ</div>
          <div>(12)</div>
        </div>
      ),
      accessorKey: 'totalDebt',
      cell: ({ row }) => formatCurrency(row.original.totalDebt),
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalDebt',
      footer: () => <span>{formatCurrency(summary?.totalDebt || 0)}</span>,
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Tổng thu (13= </div>
          <div>7+8+9+10+11-12)</div>
        </div>
      ),
      accessorKey: 'total',
      cell: ({ row }) =>
        formatCurrency(
          (row.original.totalRevenueByBankTransfer || 0) +
            (row.original.totalRevenueByCash || 0) +
            (row.original.totalRevenueByPayoo || 0) +
            (row.original.totalVoucher || 0) +
            (row.original.totalPoint || 0) -
            (row.original.totalDebt || 0),
        ),
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalRevenue',
      footer: () => (
        <span>
          {formatCurrency(
            (summary?.totalRevenueByBankTransfer || 0) +
              (summary?.totalRevenueByCash || 0) +
              (summary?.totalRevenueByPayoo || 0) +
              (summary?.totalVoucher || 0) +
              (summary?.totalPoint || 0) -
              (summary?.totalDebt || 0),
          )}
        </span>
      ),
      className: 'w-48',
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
    },
  ]

  const handleRefresh = () => {
    if (!isGetData) setIsGetData(true)
    else ql.invalidateQueries({ queryKey: useGetRevenueByBooking.getKey() })
  }

  const handleClearFilters = () => {
    tableRef?.current?.clearFilters()
  }
  const handleExportReport = (email: string) => {
    exportReport({ ...filter, email })
  }
  return (
    <PanelView>
      <ReportFilter
        handleRefresh={handleRefresh}
        loading={isFetching}
        handleClearFilters={handleClearFilters}
        handleExportReport={handleExportReport}
      />
      <PanelViewContent>
        <AdvancedTable
          ref={tableRef}
          columns={columns}
          data={data?.data || []}
          pagination={{
            type: 'manual',
            total: data?.meta?.total || 0,
            ...pagination,
            setPagination,
          }}
          className="h-full"
          sortColumn={filter.sortBy}
          sortDirection={filter.sortOrder}
          onFilterChanges={(filters) => {
            setFilter({
              ...filter,
              advancedFilters: filters,
            })
          }}
        />
      </PanelViewContent>
    </PanelView>
  )
}

export default RevenueByBooking
