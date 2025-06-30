'use client'

import { AdvancedTable, ColumnDefExtend, TableRefProps, useDataTablePagination } from '@/components/advanced-table'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAdvancedFilter } from '@/hooks/use-advanced-filter'
import { PanelView, PanelViewContent, PanelViewHeader } from '@/layouts/panel/panel-view'
import { useEffect, useRef, useState } from 'react'
import ImportExcelProductVariants from '../components/import-excel-product-variants'
import { useExportProductVariants, useGetProductVariants } from '@/lib/api/queries/product-variant/get-product-variants'
import ColsSetting from '@/components/ui/cols-setting'
import { ProductVariantStatus } from '@/lib/api/queries/product-variant/type'
import { cn } from '@/lib/tw'
import { formatInternationalWithoutCurrency } from '@/utils/currency'
import { useGetCategoryOptions } from '@/lib/api/queries/product-variant/get-category-options'
import { useGetCollectionOptions } from '@/lib/api/queries/product-variant/get-collection-options'
import { useGetBrandOptions } from '@/lib/api/queries/product-variant/get-brand-options'
import ExportProductVariantExcel from '../components/export-exel-orders'
import { toast } from 'sonner'

const mappingStatus = (status: ProductVariantStatus) => {
  if (status === ProductVariantStatus.NEW) {
    return 'Mới'
  }
  if (status === ProductVariantStatus.ACTIVE) {
    return 'Đang hoạt động'
  }
  if (status === ProductVariantStatus.DEACTIVATING) {
    return 'Sắp ngừng hoạt động'
  }
  return 'Ngừng hoạt động'
}

const mappingStatusStyle = (status: ProductVariantStatus) => {
  if (status === ProductVariantStatus.INACTIVE) {
    return 'bg-[#FFE6E5] text-[#E73C3E]'
  }
  if (status === ProductVariantStatus.ACTIVE) {
    return 'bg-[#D5FCEA] text-[#0D8F53]'
  }
  if (status === ProductVariantStatus.DEACTIVATING) {
    return 'bg-[#EAEAEA] text-[#1F1F1F]'
  }
  return 'bg-[#FAEFCA] text-[#F68342]'
}

const ProductVariantsPage = () => {
  const [filters] = useAdvancedFilter({})

  const ref = useRef<TableRefProps>(null)

  const [sorting, setSorting] = useState<{
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const [columns, setColumns] = useState<ColumnDefExtend<any>[]>([
    {
      header: 'Số thứ tự',
      accessorKey: 'index',
      meta: {
        columnClassName: '!w-[80px]',
        textAlign: 'center',
      },
      isActive: true,
    },
    {
      header: 'Mã sản phẩm',
      accessorKey: 'variantCode',
      haveFilter: true,
      filterFieldName: 'variantCode',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[140px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'variantCode'),
    },
    {
      header: 'Tên sản phẩm',
      accessorKey: 'name',
      haveFilter: true,
      filterFieldName: 'name',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[300px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'name'),
      cell(props) {
        return (
          <Tooltip>
            <TooltipTrigger className="">
              <p className="line-clamp-1 w-full text-start">{props.row.original?.name || '-'}</p>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              <p className="w-full text-start">{props.row.original?.name || '-'}</p>
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      header: 'Tình trạng',
      accessorKey: 'status',
      haveFilter: true,
      filterFieldName: 'status',
      filterComponent: 'select',
      filterDataType: 'string',
      filterOptions: [
        {
          value: ProductVariantStatus.NEW,
          label: 'Mới',
        },
        {
          value: ProductVariantStatus.ACTIVE,
          label: 'Đang hoạt động',
        },
        {
          value: ProductVariantStatus.DEACTIVATING,
          label: 'Sắp ngừng hoạt động',
        },
        {
          value: ProductVariantStatus.INACTIVE,
          label: 'Ngừng hoạt động',
        },
      ],
      meta: {
        columnClassName: '!w-[200px]',
        textAlign: 'center',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'status'),
      cell(props) {
        return (
          <span
            className={cn(
              mappingStatusStyle(props.row.original?.status as ProductVariantStatus),
              'rounded-lg px-2 py-[2px] mx-auto text-sm font-medium',
            )}
          >
            {mappingStatus(props.row.original?.status as ProductVariantStatus)}
          </span>
        )
      },
    },
    {
      header: 'Mã vạch',
      accessorKey: 'barcode',
      haveFilter: true,
      filterFieldName: 'barcode',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[180px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'barcode'),
    },
    {
      header: 'Đơn vị tính',
      accessorKey: 'unitName',
      haveFilter: true,
      filterFieldName: 'unitName',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[140px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'unitName'),
    },
    {
      header: 'Giá bán Đà Lạt',
      accessorKey: 'localPrice',
      haveFilter: true,
      filterFieldName: 'localPrice',
      filterComponent: 'compare',
      filterDataType: 'number',
      meta: {
        columnClassName: '!w-[180px]',
        textAlign: 'right',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'localPrice'),
      cell(props) {
        return formatInternationalWithoutCurrency(props.row.original?.localPrice)
      },
    },
    {
      header: 'Giá bán toàn quốc',
      accessorKey: 'nationalPrice',
      haveFilter: true,
      filterFieldName: 'nationalPrice',
      filterComponent: 'compare',
      filterDataType: 'number',
      meta: {
        columnClassName: '!w-[180px]',
        textAlign: 'right',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'nationalPrice'),
      cell(props) {
        return formatInternationalWithoutCurrency(props.row.original?.nationalPrice)
      },
    },
    {
      header: 'VAT đầu vào',
      accessorKey: 'vatIn',
      haveFilter: true,
      filterFieldName: 'vatIn',
      filterComponent: 'compare',
      filterDataType: 'number',
      meta: {
        columnClassName: '!w-[140px]',
        textAlign: 'right',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'vatIn'),
    },
    {
      header: 'VAT đầu ra',
      accessorKey: 'vatOut',
      haveFilter: true,
      filterFieldName: 'vatOut',
      filterComponent: 'compare',
      filterDataType: 'number',
      meta: {
        columnClassName: '!w-[140px]',
        textAlign: 'right',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'vatOut'),
    },
    {
      header: 'Quy cách thùng',
      accessorKey: 'boxSpecification',
      haveFilter: true,
      filterFieldName: 'boxSpecification',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[140px]',
        textAlign: 'right',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'boxSpecification'),
    },
    {
      header: 'Hạn sử dụng',
      accessorKey: 'expirationDate',
      haveFilter: true,
      filterFieldName: 'expirationDate',
      filterComponent: 'compare',
      filterDataType: 'number',
      meta: {
        columnClassName: '!w-[140px]',
        textAlign: 'right',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'expirationDate'),
    },
    {
      header: 'Đơn vị hạn sử dụng',
      accessorKey: 'expirationUnit',
      haveFilter: true,
      filterFieldName: 'expirationUnit',
      filterComponent: 'compare',
      filterDataType: 'string',
      meta: {
        columnClassName: '!w-[160px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'expirationUnit'),
    },
    {
      header: 'Nhóm sản phẩm',
      accessorKey: 'collectionId',
      haveFilter: true,
      filterFieldName: 'collectionId',
      filterComponent: 'select',
      meta: {
        columnClassName: '!w-[180px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'collectionId'),
      cell(props) {
        return props.row.original?.collectionName
      },
    },
    {
      header: 'Loại sản phẩm',
      accessorKey: 'categoryId',
      haveFilter: true,
      filterFieldName: 'categoryId',
      filterComponent: 'select',
      meta: {
        columnClassName: '!w-[180px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'categoryId'),
      cell(props) {
        return props.row.original?.categoryName
      },
    },
    {
      header: 'Thương hiệu',
      accessorKey: 'brandId',
      haveFilter: true,
      filterFieldName: 'brandId',
      filterComponent: 'select',
      meta: {
        columnClassName: '!w-[180px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'brandId'),
      cell(props) {
        return props.row.original?.brandName
      },
    },
    {
      header: 'Nhóm doanh số',
      accessorKey: 'saleGroup',
      haveFilter: true,
      filterFieldName: 'saleGroup',
      filterComponent: 'compare',
      filterDataType: 'number',
      meta: {
        columnClassName: '!w-[180px]',
      },
      isActive: true,
      defaultFilterValue: filters?.advancedFilters?.find((e) => e?.field === 'saleGroup'),
    },
  ])

  const { pagination, setPagination } = useDataTablePagination()

  const { data, isLoading, isFetching } = useGetProductVariants({
    select: (resp) => resp,
    variables: {
      ...filters,
      sortBy: sorting.sortBy,
      sortOrder: sorting.sortOrder,
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
    },
  })

  const { data: brandOptions } = useGetBrandOptions()
  const { data: collectionOptions } = useGetCollectionOptions()
  const { data: categoryOptions } = useGetCategoryOptions()
  const { mutateAsync: exportProductVariants, isPending } = useExportProductVariants()

  const handleExportProductVariants = async (receiverEmail: string) => {
    try {
      await exportProductVariants({
        page: 1,
        size: 50,
        isExportExcel: true,
        receiverEmail,
        ...filters,
      })
      toast.success('Yêu cầu xuất báo cáo đang được xử lý và gửi về email. Vui lòng chờ trong giây lát', {
        position: 'top-right',
      })
    } catch (error) {
      toast.error('Lỗi khi xuất báo cáo', { position: 'top-right' })
      console.error(error)
    }
  }

  useEffect(() => {
    setColumns((state) => {
      const temp = [...state]
      const brandIndex = temp.findIndex((e) => e?.filterFieldName === 'brandId')
      if (brandIndex !== -1) {
        temp[brandIndex] = {
          ...temp[brandIndex],
          filterOptions: brandOptions?.data ?? [],
        }
      }

      const categoryIndex = temp.findIndex((e) => e?.filterFieldName === 'categoryId')
      if (categoryIndex !== -1) {
        temp[categoryIndex] = {
          ...temp[categoryIndex],
          filterOptions: categoryOptions?.data ?? [],
        }
      }

      const collectionIndex = temp.findIndex((e) => e?.filterFieldName === 'collectionId')
      if (collectionIndex !== -1) {
        temp[collectionIndex] = {
          ...temp[collectionIndex],
          filterOptions: collectionOptions?.data ?? [],
        }
      }
      return temp
    })
  }, [brandOptions, collectionOptions, categoryOptions])

  useEffect(() => {
    setPagination((value) => ({ ...value, pageIndex: 0 }))
  }, [filters])

  return (
    <TooltipProvider delayDuration={0}>
      <PanelView>
        <PanelViewHeader
          action={
            <div className="flex items-center gap-4">
              <ColsSetting columns={columns} onSaveColsSetting={(columns) => setColumns(columns as any)} />
              <ImportExcelProductVariants />
              <ExportProductVariantExcel handleSubmit={handleExportProductVariants} isLoading={isPending} />
            </div>
          }
        >
          <div className="flex shrink-0 gap-3">
            <Button
              // isLoading={isPending || isFetching}
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
              Sản phẩm
            </div>
          </div>
        </PanelViewHeader>
        <PanelViewContent>
          <AdvancedTable
            ref={ref}
            data={data?.data ?? []}
            columns={columns?.filter((column) => column.isActive)}
            pagination={{
              type: 'manual',
              total: data?.meta?.total || 0,
              ...pagination,
              setPagination,
            }}
            sortColumn="variantCode"
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

export default ProductVariantsPage
