'use client'

import { DataTable, useDataTablePagination } from '@/components/data-table'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useDialoger } from '@/components/widgets/dialoger'
import EditIcon from '@/components/widgets/icons/edit-icon'
import PasswordIcon from '@/components/widgets/icons/password-icon'
import TrashIcon from '@/components/widgets/icons/trash-icon'
import UserCircleDashedIcon from '@/components/widgets/icons/user-circle-dashed-icon'
import { PanelViewContent } from '@/layouts/panel/panel-view'
import { USER_STATUS, UserStatus } from '@/lib/api/queries/user/constant'
import { useUser } from '@/lib/api/queries/user/get-user'
import { useUsers } from '@/lib/api/queries/user/get-users'
import { User } from '@/lib/api/queries/user/schema'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { EllipsisIcon } from 'lucide-react'
import { ComponentProps } from 'react'
import { useUpdateEffect } from 'react-use'
import { useFilter } from '../../../hooks/use-filter'
import { useSearch } from '../../../hooks/use-search'
import { useTotalUsers } from '../hooks/use-total-users'
import DeleteUserForm from './delete-user-form'
import DisableUserForm from './disable-or-enable-user-form'
import ResetPassword from './reset-password'
import UpdateUserForm from './update-user-form'

export interface UserListTableProps extends ComponentProps<typeof PanelViewContent> {}

const UserListTable = (props: UserListTableProps) => {
  const isCanAccess = useCanAccess()

  const isCurrentUserAsAdmin = isCanAccess(CASL_ACCESS_KEY.MANAGE_ALL_ACCESS)
  const canViewUsers = isCanAccess(CASL_ACCESS_KEY.TICKET_VIEW_USERS)
  const canUpdateUser = isCanAccess(CASL_ACCESS_KEY.TICKET_EDIT_USER)
  const canDisableOrEnableUser = isCanAccess(CASL_ACCESS_KEY.TICKET_DISABLE_ENABLE_USER)
  const canDeleteUser = isCanAccess(CASL_ACCESS_KEY.TICKET_DELETE_USER)
  const canChangePasswordUser = isCanAccess(CASL_ACCESS_KEY.TICKET_CHANGE_PASSWORD_USER)
  const canHandleUser = canUpdateUser || canDisableOrEnableUser || canChangePasswordUser || canDeleteUser

  const [search] = useSearch()
  const ql = useQueryClient()
  const { addDialoger } = useDialoger()

  const [filter] = useFilter()

  const { setTotal } = useTotalUsers()

  const { pagination, setPagination } = useDataTablePagination({
    defaultPageSize: 50,
    defaultPageIndex: 0,
  })
  const { data, isLoading, isFetching, isSuccess } = useUsers({
    select: (resp) => ({ users: resp.data, meta: resp.meta }),
    variables: {
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      search: search ?? undefined,
      status: (filter.status ?? undefined) as unknown as UserStatus[],
      roles: (filter.role ?? undefined) as unknown as string[],
    },
    enabled: canViewUsers,
  })

  const handleUpdateUserDialog = (userId: string) => {
    if (!canUpdateUser) return
    addDialoger({
      title: 'Chỉnh sửa người dùng',
      content: (
        <UpdateUserForm
          userId={userId}
          onCompleted={async () => {
            await Promise.all([
              ql.invalidateQueries({ queryKey: useUsers.getKey() }),
              ql.invalidateQueries({ queryKey: useUser.getKey() }),
            ])
          }}
        />
      ),
      variant: 'dialog',
    })
  }

  const handleDisableOrEnableUserDialog = ({
    userId,
    userName,
    oldStatus,
  }: {
    userId: string
    oldStatus: UserStatus
    userName: string
  }) => {
    if (!canDisableOrEnableUser) return
    addDialoger({
      title: oldStatus === USER_STATUS.activated ? 'Huỷ kích hoạt người dùng' : 'Kích hoạt người dùng',
      content: (
        <DisableUserForm
          userId={userId}
          oldStatus={oldStatus}
          userName={userName}
          onCompleted={async () => {
            await Promise.all([ql.invalidateQueries({ queryKey: useUsers.getKey() })])
          }}
        />
      ),
      variant: 'dialog',
    })
  }

  const handleResetPasswordDialog = (userId: string, userName: string) => {
    if (!canChangePasswordUser) return
    addDialoger({
      title: 'Reset mật khẩu',
      content: (
        <ResetPassword
          userId={userId}
          userName={userName}
          onCompleted={async () => {
            await Promise.all([
              ql.invalidateQueries({ queryKey: useUsers.getKey() }),
              ql.invalidateQueries({ queryKey: useUser.getKey() }),
            ])
          }}
        />
      ),
      variant: 'dialog',
    })
  }

  const handleDeleteDialog = (userId: string, userName: string) => {
    if (!canDeleteUser) return
    addDialoger({
      title: 'Xóa người dùng',
      content: (
        <DeleteUserForm
          userId={userId}
          userName={userName}
          onCompleted={async () => {
            await Promise.all([
              ql.invalidateQueries({ queryKey: useUsers.getKey() }),
              ql.invalidateQueries({ queryKey: useUser.getKey() }),
            ])
          }}
        />
      ),
      variant: 'dialog',
    })
  }

  useUpdateEffect(() => {
    if (isSuccess) {
      setTotal(data?.meta?.total || 0)
    }
  }, [data, isSuccess])

  const columns: ColumnDef<User>[] = [
    {
      header: 'Mã nhân viên',
      accessorKey: 'codeEmp',
      cell(props) {
        return props.row.original.username
      },
    },
    {
      header: 'Tên nhân viên',
      accessorKey: 'firstName',
      cell(props) {
        return `${props.row.original.lastName} ${props.row.original.firstName}`.trim()
      },
    },
    {
      header: 'Số điện thoại',
      accessorKey: 'username',
      cell(props) {
        return props.row.original.phoneNumber ?? (props.row.original as any)?.amisData?.Mobile?.replace('+84', 0) ?? '-'
      },
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell(props) {
        return props.row.original.email ?? (props.row.original as any)?.amisData?.Email ?? '-'
      },
    },
    {
      header: 'Vai trò',
      accessorKey: 'role.name',
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status',
      cell(props) {
        const text = {
          ACTIVATED: 'Hoạt động',
          UN_ACTIVATED: 'Chưa kích hoạt',
          DEACTIVATED: 'Tạm ngưng',
          NO_ACCOUNT: 'Chưa có tài khoản',
        } as Record<string, string>

        const variant = {
          ACTIVATED: 'default',
          UN_ACTIVATED: 'secondary',
          DEACTIVATED: 'secondary',
          NO_ACCOUNT: 'secondary',
        } as Record<string, BadgeProps['variant']>

        return (
          <Badge variant={variant?.[props.row.original.status] || 'secondary'} corner="full">
            {text[props.row.original.status] || 'Không rõ'}
          </Badge>
        )
      },
    },
    {
      header: () => <span className="sr-only">Hành động</span>,
      accessorKey: 'actions',
      cell(props) {
        if (!canHandleUser) return

        const isAdminAccount = props.row.original.role.permissionKeys?.includes(CASL_ACCESS_KEY.MANAGE_ALL_ACCESS)

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisIcon size={16} aria-hidden="true" role="button" className="transform rotate-90" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={cn(
                'border border-low [&>*]:border-b',
                '[&>*]:border-low [&>*]:rounded-none p-0 [&>*]:px-4 [&>*]:py-3',
                '[&>*]:cursor-pointer',
              )}
            >
              {canUpdateUser && (
                <DropdownMenuItem onClick={() => handleUpdateUserDialog(props.row.original._id)}>
                  <EditIcon className="size-5" />
                  Chỉnh sửa
                </DropdownMenuItem>
              )}
              {canChangePasswordUser && !isAdminAccount && (
                <DropdownMenuItem
                  onClick={() =>
                    handleResetPasswordDialog(
                      props.row.original._id,
                      `${props.row.original.lastName} ${props.row.original.firstName}`,
                    )
                  }
                >
                  <PasswordIcon className="size-5" />
                  Reset mật khẩu
                </DropdownMenuItem>
              )}
              {canDisableOrEnableUser && !isAdminAccount && (
                <DropdownMenuItem
                  onClick={() =>
                    handleDisableOrEnableUserDialog({
                      userId: props.row.original._id,
                      oldStatus: props.row.original.status,
                      userName: `${props.row.original.lastName} ${props.row.original.firstName}`,
                    })
                  }
                >
                  <UserCircleDashedIcon className="size-5" />
                  {props.row.original.status === USER_STATUS.activated
                    ? 'Huỷ kích hoạt người dùng'
                    : 'Kích hoạt người dùng'}
                </DropdownMenuItem>
              )}
              {canDeleteUser && !isAdminAccount && (
                <DropdownMenuItem
                  onClick={() =>
                    handleDeleteDialog(
                      props.row.original._id,
                      `${props.row.original.lastName} ${props.row.original.firstName}`,
                    )
                  }
                  className="text-semantic-danger-300 hover:!text-semantic-danger-300"
                >
                  <TrashIcon className="size-5 text-semantic-danger-300" />
                  Xoá người dùng
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <PanelViewContent>
      <DataTable
        data={data?.users || []}
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
    </PanelViewContent>
  )
}

export default UserListTable
