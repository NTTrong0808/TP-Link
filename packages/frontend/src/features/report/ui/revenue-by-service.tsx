'use client'

import { AdvancedTable, TableRefProps, useDataTablePagination } from '@/components/advanced-table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatCurrency } from '@/helper'
import { useAdvancedFilter } from '@/hooks/use-advanced-filter'
import { PanelView, PanelViewContent } from '@/layouts/panel/panel-view'
import {
  useExportRevenueByServiceMutation,
  useGetRevenueByService,
} from '@/lib/api/queries/report/get-revenue-by-service'
import { IRevenueByService } from '@/lib/api/queries/report/schema'
import { useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useBoolean } from 'react-use'
import { ColumnDefExtend } from '../../../components/advanced-table'
import ReportFilter from '../components/report-filter'
import { DEFAULT_REPORT_FILTER } from '../constants'

const RevenueByService = () => {
  const ql = useQueryClient()
  const [isGetData, setIsGetData] = useBoolean(false)
  const tableRef = useRef<TableRefProps>(null)

  const [filter, setFilter] = useAdvancedFilter({
    ...DEFAULT_REPORT_FILTER,
    sortBy: 'serviceName',
    sortOrder: 'asc',
  })

  const { pagination, setPagination } = useDataTablePagination()

  const { data, isFetching, refetch } = useGetRevenueByService({
    variables: {
      ...filter,
      page: pagination?.pageIndex + 1,
      size: pagination?.pageSize,
    },
    enabled: isGetData,
  })

  const { mutate: exportReport } = useExportRevenueByServiceMutation()
  const summary = data?.meta?.summary

  const columns: ColumnDefExtend<IRevenueByService>[] = [
    {
      header: 'Mã hàng',
      accessorKey: 'serviceCode',
      filterComponent: 'compare',
      filterDataType: 'string',
      filterFieldName: 'serviceCode',
      footer: () => <span>Cộng</span>,

      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
    },
    {
      header: 'Mã vạch',
      accessorKey: 'serviceBarcode',
      filterComponent: 'compare',
      filterDataType: 'string',
      filterFieldName: 'serviceBarcode',
      meta: {
        justifyContent: 'center',
      },
    },
    {
      header: 'Tên hàng hoá, dịch vụ',
      accessorKey: 'serviceName',
      filterComponent: 'compare',
      filterDataType: 'string',
      filterFieldName: 'serviceName',
      cell: ({ row }) => {
        return (
          <Tooltip>
            <TooltipTrigger className="line-clamp-1" asChild>
              <div>{row.original.serviceName}</div>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              <p className="  w-full text-start">{row.original.serviceName}</p>
            </TooltipContent>
          </Tooltip>
        )
      },
      className: 'w-[600px]',
      meta: {
        justifyContent: 'center',
      },
    },
    {
      header: 'Đơn vị tính',
      accessorKey: 'invoiceUnit',
      filterComponent: 'compare',
      filterDataType: 'string',
      filterFieldName: 'invoiceUnit',
      cell: ({ row }) => row.original?.invoiceUnit,
      meta: {
        justifyContent: 'center',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Số lượng bán</div>
          <div>(1)</div>
        </div>
      ),
      cell: ({ row }) => formatCurrency(row.original?.totalQuantity || 0),
      accessorKey: 'totalQuantity',
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalQuantity',
      footer: () => <span>{formatCurrency(summary?.totalQuantity || 0)}</span>,
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Đơn giá TB</div>
          <div>(2=3:1)</div>
        </div>
      ),
      accessorKey: 'totalAverage',
      filterComponent: 'compare',
      filterDataType: 'number',
      filterFieldName: 'totalAverage',
      cell: ({ row }) => formatCurrency((row.original.totalRevenue || 0) / (row.original.totalQuantity || 0)),
      footer: () => <span>{formatCurrency(summary?.totalAverage || 0)}</span>,
      meta: {
        justifyContent: 'center',
        textAlign: 'right',
      },
    },
    {
      header: () => (
        <div className="text-center">
          <div>Tiền hàng</div>
          <div>(3)</div>
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
          <div>Khuyến mại</div>
          <div>(4)</div>
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
          <div>Chiết khấu/giảm giá</div>
          <div>(5)</div>
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
          <div>Tiền trước thuế</div>
          <div>(6=3-4-5)</div>
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
          <div>Tiền thuế GTGT</div>
          <div>(7)</div>
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
          <div>Tổng doanh số</div>
          <div>(8=6+7)</div>
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
  ]

  const handleRefresh = () => {
    if (!isGetData) setIsGetData(true)
    else ql.invalidateQueries({ queryKey: useGetRevenueByService.getKey() })
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

export default RevenueByService
