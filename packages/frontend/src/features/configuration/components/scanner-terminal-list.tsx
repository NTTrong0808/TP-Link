'use client'

import { DataTable, useDataTablePagination } from '@/components/data-table'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useDialoger } from '@/components/widgets/dialoger'
import EditIcon from '@/components/widgets/icons/edit-icon'
import TrashIcon from '@/components/widgets/icons/trash-icon'
import { useGetScannerTerminals } from '@/lib/api/queries/scanner-terminal/get-scanner-terminals'
import { ILCScannerTerminal, ScannerTerminalStatus } from '@/lib/api/queries/scanner-terminal/schema'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { EllipsisIcon } from 'lucide-react'
import { useFilter } from '../hooks/use-filter'
import ConfirmDeleteScanner from './confirm-delete-scanner'
import UpdateScannerTerminal from './update-scanner-terminal'

const ScannerTerminalList = () => {
  const ql = useQueryClient()
  const { addDialoger } = useDialoger()
  const [filter] = useFilter()

  const isCanAccess = useCanAccess()

  const isHavePermissionUpdateScanner = isCanAccess(CASL_ACCESS_KEY.TICKET_SCANNER_TERMINAL_UPDATE)
  const isHavePermissionDeleteScanner = isCanAccess(CASL_ACCESS_KEY.TICKET_SCANNER_TERMINAL_DELETE)

  const { pagination, setPagination } = useDataTablePagination({
    defaultPageSize: 50,
    defaultPageIndex: 0,
  })

  const { data, isLoading, isFetching, isSuccess } = useGetScannerTerminals({
    variables: {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search: filter?.search ?? undefined,
      status: filter?.status ?? undefined,
    },
  })

  const handleConfirmDeleteScannerTerminal = (scannerId: string) => {
    addDialoger({
      title: 'Xóa Scanner',
      content: (
        <ConfirmDeleteScanner
          onCompleted={async () => {
            await Promise.all([ql.invalidateQueries({ queryKey: useGetScannerTerminals.getKey() })])
          }}
          scannerId={scannerId}
        />
      ),
      variant: 'dialog',
    })
  }

  const handleUpdateScannerTerminal = (scannerData: ILCScannerTerminal) => {
    addDialoger({
      title: 'Chỉnh sửa Scanner',
      content: (
        <UpdateScannerTerminal
          onCompleted={async () => {
            await Promise.all([ql.invalidateQueries({ queryKey: useGetScannerTerminals.getKey() })])
          }}
          scannerData={scannerData}
        />
      ),
      variant: 'dialog',
    })
  }

  const columns: ColumnDef<ILCScannerTerminal>[] = [
    {
      header: 'ID',
      accessorKey: 'ID',
    },
    {
      header: 'Tên máy Scanner',
      accessorKey: 'name',
    },
    {
      header: 'Dịch vụ',
      accessorKey: 'services',
      cell(props) {
        return (
          <p className="flex flex-col gap-1">
            {props.row.original?.services?.map((e) => (
              <span key={`${props.row.original._id}-${e.serviceId}`}>- {e.serviceName}</span>
            ))}
          </p>
        )
      },
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status',
      cell(props) {
        const text = {
          [ScannerTerminalStatus.ACTIVED]: 'Đang hoạt động',
          [ScannerTerminalStatus.INACTIVED]: 'Ngừng hoạt động',
          [ScannerTerminalStatus.MAINTENANCE]: 'Bảo trì',
        } as Record<string, string>

        const variant = {
          [ScannerTerminalStatus.ACTIVED]: 'default',
          [ScannerTerminalStatus.INACTIVED]: 'secondary',
          [ScannerTerminalStatus.MAINTENANCE]: 'warning',
        } as Record<string, BadgeProps['variant']>

        return (
          <Badge variant={props.row.original.status ? variant?.[props.row.original.status] : 'secondary'} corner="full">
            {props.row.original.status ? text[props.row.original.status] : 'Không rõ'}
          </Badge>
        )
      },
    },
    {
      header: () => <span className="sr-only">Hành động</span>,
      accessorKey: 'actions',
      cell(props) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="shadow-none flex justify-end w-full"
                aria-label="Edit item"
              >
                <EllipsisIcon size={16} aria-hidden="true" className="transform rotate-90" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={cn(
                'border border-low [&>*]:border-b',
                '[&>*]:border-low [&>*]:rounded-none p-0 [&>*]:px-4 [&>*]:py-3',
                '[&>*]:cursor-pointer',
              )}
            >
              {isHavePermissionUpdateScanner && (
                <DropdownMenuItem onClick={() => handleUpdateScannerTerminal(props?.row?.original)}>
                  <EditIcon className="size-5" />
                  Chỉnh sửa
                </DropdownMenuItem>
              )}
              {isHavePermissionDeleteScanner && (
                <DropdownMenuItem
                  onClick={() => handleConfirmDeleteScannerTerminal(props?.row?.original?._id)}
                  className="text-semantic-danger-300 hover:!text-semantic-danger-300"
                >
                  <TrashIcon className="size-5 text-semantic-danger-300" />
                  Xoá Scanner
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <DataTable
      data={data?.data || []}
      columns={columns}
      pagination={{
        type: 'manual',
        total: data?.meta?.total || 0,
        ...pagination,
        setPagination,
      }}
      className="h-full"
      loading={isLoading || isFetching}
    />
  )
}

export default ScannerTerminalList
