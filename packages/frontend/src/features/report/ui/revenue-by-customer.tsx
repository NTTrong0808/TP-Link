'use client'

import { AdvancedTable, TableRefProps, useDataTablePagination } from '@/components/advanced-table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatCurrency } from '@/helper'
import { useAdvancedFilter } from '@/hooks/use-advanced-filter'
import { PanelView, PanelViewContent } from '@/layouts/panel/panel-view'
import {
  useExportRevenueByCustomerMutation,
  useGetRevenueByCustomer,
} from '@/lib/api/queries/report/get-revenue-by-customer'
import { IRevenueByCustomer } from '@/lib/api/queries/report/schema'
import { appDayJs } from '@/utils/dayjs'
import { useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useBoolean } from 'react-use'
import { ColumnDefExtend } from '../../../components/advanced-table'
import ReportFilter from '../components/report-filter'
import { DEFAULT_REPORT_FILTER } from '../constants'

const RevenueByCustomer = () => {
  const ql = useQueryClient()
  const [isGetData, setIsGetData] = useBoolean(false)
  const tableRef = useRef<TableRefProps>(null)

  const [filter, setFilter] = useAdvancedFilter({
    ...DEFAULT_REPORT_FILTER,
    sortBy: 'customerName',
    sortOrder: 'asc',
  })

  const { pagination, setPagination } = useDataTablePagination()

  const { data, isFetching, refetch } = useGetRevenueByCustomer({
    variables: {
      ...filter,
      page: pagination?.pageIndex + 1,
      size: pagination?.pageSize,
    },
    enabled: isGetData,
  })

  const { mutate: exportReport } = useExportRevenueByCustomerMutation()

  const summary = data?.meta?.summary

  const columns: ColumnDefExtend<IRevenueByCustomer>[] = [
    {
      header: 'Mã khách hàng',
      accessorKey: 'customerUniqueId',
      filterComponent: 'compare',
      filterDataType: 'string',
      filterFieldName: 'customerUniqueId',
      meta: {
        justifyContent: 'center',
      },
      footer: () => <span>Cộng</span>,
    },
    {
      header: 'Tên khách hàng',
      accessorKey: 'customerName',
      filterComponent: 'compare',
      filterDataType: 'string',
      filterFieldName: 'customerName',
      cell: ({ row }) => {
        return (
          <Tooltip>
            <TooltipTrigger className="line-clamp-2" asChild>
              <div>{row.original?.customerName}</div>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              <p className="  w-full text-start">{row.original?.customerName}</p>
            </TooltipContent>
          </Tooltip>
        )
      },
      className: 'w-80',
      meta: {
        justifyContent: 'center',
      },
    },
    {
      header: 'Nhóm khách hàng',
      accessorKey: 'customerType',
      filterComponent: 'compare',
      filterDataType: 'string',
      filterFieldName: 'customerType',
      meta: {
        justifyContent: 'center',
      },
    },
    {
      header: 'Số điện thoại',
      accessorKey: 'customerPhone',
      filterComponent: 'compare',
      filterDataType: 'string',
      filterFieldName: 'customerPhone',
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
      header: 'Số lượng đơn hàng',
      accessorKey: 'totalBooking',
      cell: ({ row }) => row.original.totalBooking,
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalBooking',
      footer: () => <span>{summary?.totalBooking || 0}</span>,
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
    },
    {
      header: 'Ngày mua gần nhất',
      accessorKey: 'lastBookingDate',
      cell: ({ row }) => appDayJs(row.original.lastBookingDate).format('DD/MM/YYYY'),
      filterComponent: 'compare',
      filterDataType: 'date',
      filterFieldName: 'lastBookingDate',
      meta: {
        justifyContent: 'center',
      },
    },
    {
      header: 'Đơn hàng gần nhất',
      accessorKey: 'lastBookingCode',
      cell: ({ row }) => row.original.lastBookingCode,
      filterComponent: 'compare',
      filterDataType: 'string',
      filterFieldName: 'lastBookingCode',
      meta: {
        justifyContent: 'center',
      },
    },
  ]

  const handleRefresh = () => {
    if (!isGetData) setIsGetData(true)
    else ql.invalidateQueries({ queryKey: useGetRevenueByCustomer.getKey() })
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
          defaultOuterFilters={filter.advancedFilters}
          showFooter
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

export default RevenueByCustomer
