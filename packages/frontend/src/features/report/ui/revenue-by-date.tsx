'use client'

import { AdvancedTable, TableRefProps, useDataTablePagination } from '@/components/advanced-table'
import { formatCurrency } from '@/helper'
import { useAdvancedFilter } from '@/hooks/use-advanced-filter'
import { PanelView, PanelViewContent } from '@/layouts/panel/panel-view'
import { useExportRevenueByDateMutation, useGetRevenueByDate } from '@/lib/api/queries/report/get-revenue-by-date'
import { IRevenueByDate } from '@/lib/api/queries/report/schema'
import { appDayJs } from '@/utils/dayjs'
import { useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useBoolean } from 'react-use'
import { ColumnDefExtend } from '../../../components/advanced-table'
import ReportFilter from '../components/report-filter'
import { DEFAULT_REPORT_FILTER } from '../constants'

const RevenueByDate = () => {
  const ql = useQueryClient()
  const [isGetData, setIsGetData] = useBoolean(false)
  const tableRef = useRef<TableRefProps>(null)

  const [filter, setFilter] = useAdvancedFilter({
    ...DEFAULT_REPORT_FILTER,
    sortBy: 'date',
    sortOrder: 'desc',
  })

  const { pagination, setPagination } = useDataTablePagination()

  const { data, isFetching, refetch } = useGetRevenueByDate({
    variables: {
      ...filter,
      page: pagination?.pageIndex + 1,
      size: pagination?.pageSize,
    },
    enabled: isGetData,
  })

  const { mutate: exportReport } = useExportRevenueByDateMutation()

  const summary = data?.meta?.summary

  const columns: ColumnDefExtend<IRevenueByDate>[] = [
    {
      header: 'Ngày',
      accessorKey: 'date',
      filterComponent: 'compare',
      filterDataType: 'date',
      filterFieldName: 'date',
      cell: ({ row }) => appDayJs(row.original.date).format('DD/MM/YYYY'),
      footer: () => <span>Cộng</span>,
      meta: {
        justifyContent: 'center',
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
        textAlign: 'right',
        justifyContent: 'center',
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
        textAlign: 'right',
        justifyContent: 'center',
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
        textAlign: 'right',
        justifyContent: 'center',
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
        textAlign: 'right',
        justifyContent: 'center',
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
        textAlign: 'right',
        justifyContent: 'center',
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
        textAlign: 'right',
        justifyContent: 'center',
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
        textAlign: 'right',
        justifyContent: 'center',
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
        textAlign: 'right',
        justifyContent: 'center',
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
        textAlign: 'right',
        justifyContent: 'center',
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
        textAlign: 'right',
        justifyContent: 'center',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Tổng thu (13= </div>
          <div>7+8+9+10+11-12)</div>
        </div>
      ),
      accessorKey: 'totalCollected',
      cell: ({ row }) => formatCurrency(row.original.totalCollected),
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalCollected',
      footer: () => <span>{formatCurrency(summary?.totalCollected || 0)}</span>,
      meta: {
        textAlign: 'right',
        justifyContent: 'center',
      },
    },
  ]

  const handleRefresh = () => {
    if (!isGetData) setIsGetData(true)
    else ql.invalidateQueries({ queryKey: useGetRevenueByDate.getKey() })
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

export default RevenueByDate
