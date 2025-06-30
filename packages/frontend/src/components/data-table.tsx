'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/tw'
import { useIsFetching } from '@tanstack/react-query'
import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  Table as ReactTable,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { ComponentProps, HTMLAttributes, useId, useState } from 'react'
import Loader from './ui/loader'

export const PAGINATION_TYPE = {
  MANUAL: 'manual',
  AUTO: 'auto',
  HIDDEN: 'hidden',
} as const

export type DataTablePagination =
  | {
      pageIndex: number
      pageSize: number
      total: number
      type: typeof PAGINATION_TYPE.MANUAL
      setPagination: OnChangeFn<PaginationState>
      hidden?: boolean
    }
  | {
      pageIndex: number
      pageSize: number
      type: typeof PAGINATION_TYPE.AUTO
      hidden?: boolean
    }
  | {
      hidden: true
    }

export interface DataTableProps<T> extends ComponentProps<'div'> {
  data: T[]
  columns: ColumnDef<T>[]

  pagination?: DataTablePagination

  loading?: boolean

  onRowClick?: (row: T, e: React.MouseEvent<HTMLTableRowElement>) => void

  tableClassName?: HTMLAttributes<HTMLTableElement>['className']

  sortColumn?: string

  sortDirection?: 'asc' | 'desc'

  enableRowSelection?: boolean

  extraFooter?: React.ReactNode
}

const TEXT_ALIGN = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
  start: 'text-start',
  end: 'text-end',
}

const JUSTIFY_CONTENT = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  evenly: 'justify-evenly',
  between: 'justify-between',
  around: 'justify-around',
  normal: 'justify-normal',
}
export const DataTable = <T,>({
  className,
  data,
  columns,
  pagination,
  loading,
  onRowClick,
  tableClassName,
  sortColumn,
  sortDirection = 'desc',
  enableRowSelection,
  extraFooter,
  ...props
}: DataTableProps<T>) => {
  const id = useId()

  const { pagination: selfPagination, setPagination: setSelfPagination } = useDataTablePagination()

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: sortColumn || (columns[0] as any)?.accessorKey || '_id',
      desc: sortDirection === 'desc',
    },
  ])

  const isFetching = useIsFetching()

  const isLoading = isFetching || loading

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange:
      !pagination?.hidden && pagination?.type === PAGINATION_TYPE.MANUAL ? pagination.setPagination : setSelfPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableSortingRemoval: false,
    manualPagination: !pagination?.hidden && pagination?.type === PAGINATION_TYPE.MANUAL,
    pageCount:
      !pagination?.hidden && pagination?.type === PAGINATION_TYPE.MANUAL
        ? Math.ceil(pagination.total / Number(pagination.pageSize))
        : undefined,
    state: {
      sorting,
      pagination:
        !pagination?.hidden && pagination?.type === PAGINATION_TYPE.MANUAL
          ? { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize }
          : {
              pageIndex: selfPagination.pageIndex,
              pageSize: selfPagination.pageSize,
            },
      columnFilters,
      columnVisibility,
    },
    enableRowSelection,
  })

  return (
    <div {...props} className={cn('relative flex flex-col h-auto bg-neutral-white rounded-md border', className)}>
      <div className="overflow-hidden rounded-md h-full grow relative">
        <Loader loading={isLoading} />
        <Table className={cn('table-fixed', tableClassName)} containerClassName="h-full overflow-auto">
          <TableHeader className="sticky top-0 z-[5]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      // style={
                      //   (header.column.columnDef.meta as any)?.columnClassName
                      //     ? {
                      //         width: `${header.getSize()}px`,
                      //       }
                      //     : undefined
                      // }
                      className={cn('h-11', (header.column.columnDef.meta as any)?.columnClassName)}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              'flex w-full h-full cursor-pointer items-center gap-2 select-none',
                            TEXT_ALIGN[(header.column.columnDef.meta as any)?.textAlign as keyof typeof TEXT_ALIGN],
                            JUSTIFY_CONTENT[
                              (header.column.columnDef.meta as any)?.justifyContent as keyof typeof JUSTIFY_CONTENT
                            ],
                          )}
                          // onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (header.column.getCanSort() && (e.key === 'Enter' || e.key === ' ')) {
                              e.preventDefault()
                              // header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {/* {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null} */}
                        </div>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="overflow-auto h-full [&_td]:break-words [&_td]:whitespace-normal">
            {table?.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={(e) => onRowClick?.(row.original, e)}
                  className={cn(onRowClick && 'cursor-pointer')}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn('last:py-0', (cell.column.columnDef.meta as any)?.columnClassName)}
                      align={(cell.column.columnDef.meta as any)?.textAlign || 'left'}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!pagination?.hidden && <DataTablePagination loading={loading} table={table} pagination={pagination} />}
      {extraFooter}
    </div>
  )
}

export interface DataTablePaginationProps extends ComponentProps<'div'> {
  table: ReactTable<any>
  loading?: boolean
  pagination?: DataTablePagination
}

export const DataTablePagination = ({ table, loading, pagination, ...props }: DataTablePaginationProps) => {
  const id = useId()

  const t = table.getState().pagination

  const totalRows =
    (!pagination?.hidden && pagination?.type === PAGINATION_TYPE.MANUAL && pagination.total) || table.getRowCount()

  const currentPage = table.getState().pagination.pageIndex
  const totalPages = table.getPageCount()
  const pageRange = 1 // Số trang hiển thị trước và sau current page

  const getVisiblePages = () => {
    const pages: (number | string)[] = []

    // Always include the first page
    pages.push(0)

    // Add ... if currentPage > 2
    if (currentPage - pageRange > 1) {
      pages.push('...')
    }

    // Add pages around current
    for (let i = currentPage - pageRange; i <= currentPage + pageRange; i++) {
      if (i > 0 && i < totalPages - 1) {
        pages.push(i)
      }
    }

    // Add ... if currentPage is far from the end
    if (currentPage + pageRange < totalPages - 2) {
      pages.push('...')
    }

    // Always include the last page if more than one page
    if (totalPages > 1) {
      pages.push(totalPages - 1)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-between gap-8 py-2 px-3 border-t" {...props}>
      {/* Results per page */}

      <div className="flex items-center gap-3">
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger
            id={id}
            className="w-fit h-6 text-xs whitespace-nowrap [&>span]:before:content-['Hiển_thị'] [&>span]:before:mr-1"
          >
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
            {[25, 50, 100, 200].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Label htmlFor={id} className="max-sm:sr-only">
          <b>{t.pageIndex * t.pageSize + 1}</b>-
          <b>{Math.min(Math.max(t.pageIndex * t.pageSize + t.pageSize, 0), totalRows)}</b> trên tổng <b>{totalRows}</b>
        </Label>
      </div>

      {/* Page number information */}
      {/* <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
        <p
          className="text-muted-foreground text-sm whitespace-nowrap"
          aria-live="polite"
        >
          <span className="text-foreground">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            -
            {Math.min(
              Math.max(
                table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  table.getState().pagination.pageSize,
                0
              ),
              table.getRowCount()
            )}
          </span>{" "}
          of{" "}
          <span className="text-foreground">
            {table.getRowCount().toString()}
          </span>
        </p>
      </div> */}

      {/* Pagination buttons */}
      <div className="flex items-center gap-4">
        {loading ? <Loader className="size-6 animate-spin" /> : null}

        <Pagination>
          <PaginationContent>
            {/* First page button */}
            <PaginationItem>
              <Button
                size="tiny-icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Go to first page"
              >
                <ChevronFirstIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>
            {/* Previous page button */}
            <PaginationItem>
              <Button
                size="tiny-icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Go to previous page"
              >
                <ChevronLeftIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>

            {/* Page numbers */}
            {getVisiblePages().map((page, index) => (
              <PaginationItem key={index}>
                {page === '...' ? (
                  <span className="px-2 text-muted">...</span>
                ) : (
                  <Button
                    size="tiny-icon"
                    variant={page === currentPage ? 'default' : 'outline'}
                    onClick={() => table.setPageIndex(Number(page))}
                  >
                    {Number(page) + 1}
                  </Button>
                )}
              </PaginationItem>
            ))}

            {/* Next page button */}
            <PaginationItem>
              <Button
                size="tiny-icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Go to next page"
              >
                <ChevronRightIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>
            {/* Last page button */}
            <PaginationItem>
              <Button
                size="tiny-icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Go to last page"
              >
                <ChevronLastIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

function getVisiblePages(current: number, total: number): (number | '...')[] {
  const delta = 2
  const range: (number | '...')[] = []

  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)

  range.push(1)

  if (left > 2) {
    range.push('...')
  }

  for (let i = left; i <= right; i++) {
    range.push(i)
  }

  if (right < total - 1) {
    range.push('...')
  }

  if (total > 1) {
    range.push(total)
  }

  return range
}

export interface UseDataTablePaginationProps {
  defaultPageSize?: number
  defaultPageIndex?: number
}

export const useDataTablePagination = (options?: UseDataTablePaginationProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: options?.defaultPageIndex || 0,
    pageSize: options?.defaultPageSize || 25,
  })

  return { pagination, setPagination }
}
