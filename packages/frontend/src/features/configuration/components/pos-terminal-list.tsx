'use client'

import { DataTable, useDataTablePagination } from '@/components/data-table'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useDialoger } from '@/components/widgets/dialoger'
import EditIcon from '@/components/widgets/icons/edit-icon'
import TrashIcon from '@/components/widgets/icons/trash-icon'
import { PanelViewContent } from '@/layouts/panel/panel-view'
import { useGetTerminals } from '@/lib/api/queries/pos-terminal/get-pos-terminals'
import { ILCPosTerminal, PosTerminalStatus } from '@/lib/api/queries/pos-terminal/schema'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { EllipsisIcon } from 'lucide-react'
import { ComponentProps } from 'react'
import { useFilter } from '../hooks/use-filter'
import ConfirmDeletePos from './confirm-delete-pos'
import UpdatePosTerminal from './update-pos-terminal'

export interface PosTerminalListProps extends ComponentProps<typeof PanelViewContent> {}

const PosTerminalList = (props: PosTerminalListProps) => {
  const ql = useQueryClient()
  const { addDialoger } = useDialoger()
  const [filter] = useFilter()

  const isCanAccess = useCanAccess()

  const isHavePermissionUpdatePos = isCanAccess(CASL_ACCESS_KEY.TICKET_POS_TERMINAL_UPDATE)
  const isHavePermissionDeletePos = isCanAccess(CASL_ACCESS_KEY.TICKET_POS_TERMINAL_DELETE)

  const { pagination, setPagination } = useDataTablePagination({
    defaultPageSize: 50,
    defaultPageIndex: 0,
  })

  const { data, isLoading, isFetching, isSuccess } = useGetTerminals({
    variables: {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search: filter?.search ?? undefined,
      status: filter?.status ?? undefined,
    },
  })

  const handleConfirmDeletePosTerminal = (posId: string) => {
    addDialoger({
      title: 'Xóa POS',
      content: (
        <ConfirmDeletePos
          onCompleted={async () => {
            await Promise.all([ql.invalidateQueries({ queryKey: useGetTerminals.getKey() })])
          }}
          posId={posId}
        />
      ),
      variant: 'dialog',
    })
  }

  const handleUpdatePosTerminal = (posData: ILCPosTerminal) => {
    addDialoger({
      title: 'Chỉnh sửa POS',
      content: (
        <UpdatePosTerminal
          onCompleted={async () => {
            await Promise.all([ql.invalidateQueries({ queryKey: useGetTerminals.getKey() })])
          }}
          posData={posData}
        />
      ),
      variant: 'dialog',
    })
  }

  const columns: ColumnDef<ILCPosTerminal>[] = [
    {
      header: 'ID',
      accessorKey: 'ID',
    },
    {
      header: 'Tên máy POS',
      accessorKey: 'name',
    },
    {
      header: ' Địa điểm hoạt động',
      accessorKey: 'location',
    },
    {
      header: 'Thiết bị thanh toán',
      accessorKey: 'posCode',
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status',
      cell(props) {
        const text = {
          [PosTerminalStatus.ACTIVED]: 'Đang hoạt động',
          [PosTerminalStatus.INACTIVED]: 'Ngừng hoạt động',
          [PosTerminalStatus.MAINTENANCE]: 'Bảo trì',
        } as Record<string, string>

        const variant = {
          [PosTerminalStatus.ACTIVED]: 'default',
          [PosTerminalStatus.INACTIVED]: 'secondary',
          [PosTerminalStatus.MAINTENANCE]: 'warning',
        } as Record<string, BadgeProps['variant']>

        return (
          <Badge variant={props.row.original.status ? variant?.[props.row.original.status] : 'secondary'} corner="full">
            {props.row.original.status ? text[props.row.original.status] : 'Không rõ'}
          </Badge>
        )
      },
    },
    {
      header: 'Thiết bị ngoại vi',
      accessorKey: 'devices',
      cell(props) {
        return <span className="line-clamp-2">{props?.row?.original?.otherDevices?.join(', ') ?? ''}</span>
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
              {isHavePermissionUpdatePos && (
                <DropdownMenuItem onClick={() => handleUpdatePosTerminal(props?.row?.original)}>
                  <EditIcon className="size-5" />
                  Chỉnh sửa
                </DropdownMenuItem>
              )}
              {isHavePermissionDeletePos && (
                <DropdownMenuItem
                  onClick={() => handleConfirmDeletePosTerminal(props?.row?.original?._id)}
                  className="text-semantic-danger-300 hover:!text-semantic-danger-300"
                >
                  <TrashIcon className="size-5 text-semantic-danger-300" />
                  Xoá POS
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

export default PosTerminalList
