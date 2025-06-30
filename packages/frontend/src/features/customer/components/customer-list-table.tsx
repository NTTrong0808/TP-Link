'use client'

import { DataTable, useDataTablePagination } from '@/components/data-table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import ListDashesIcon from '@/components/widgets/icons/list-dashes-icon'
import TrashIcon from '@/components/widgets/icons/trash-icon'
import UserCircleDashedIcon from '@/components/widgets/icons/user-circle-dashed-icon'
import { toastSuccess } from '@/components/widgets/toast'
import { URLS } from '@/constants/urls'
import { PanelViewContent } from '@/layouts/panel/panel-view'
import { useCustomersPagination } from '@/lib/api/queries/customer/get-customers-pagination'
import { CustomerType, ILCCustomer } from '@/lib/api/queries/customer/schema'
import { useUpdateCustomer } from '@/lib/api/queries/customer/update-customer'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { EllipsisIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ComponentProps, useState } from 'react'
import { useUpdateEffect } from 'react-use'
import { useFilter } from '../hooks/use-filter'
import { useSearch } from '../hooks/use-search'
import { useTotalUsers } from '../hooks/use-total-users'
import CustomerStatusChip from './customer-status-chip'
import ModalConfirmDeleteCustomer from './modal-confirm-delete-customer'
import ModalConfirmDisableCustomer from './modal-confirm-disable-customer'

export interface CustomerListTableProps extends ComponentProps<typeof PanelViewContent> {}

const CustomerListTable = (props: CustomerListTableProps) => {
  const [modalDisableCustomerProps, setModalDisableCustomerProps] = useState<{
    open: boolean
    name?: string
    customerId?: string
  }>({
    open: false,
  })

  const [modalDeleteCustomerProps, setModalDeleteCustomerProps] = useState<{
    open: boolean
    name?: string
    customerId?: string
  }>({
    open: false,
  })

  const isCanAccess = useCanAccess()

  const canViewCustomer = isCanAccess(CASL_ACCESS_KEY.TICKET_CUSTOMER_VIEW)
  const canViewDetailCustomer = isCanAccess(CASL_ACCESS_KEY.TICKET_CUSTOMER_VIEW_DETAIL)
  const canUpdateCustomer = isCanAccess(CASL_ACCESS_KEY.TICKET_CUSTOMER_UPDATE)
  const canToggleCustomer = isCanAccess(CASL_ACCESS_KEY.TICKET_CUSTOMER_TOGGLE)
  const canDeleteCustomer = isCanAccess(CASL_ACCESS_KEY.TICKET_CUSTOMER_DELETE)

  const router = useRouter()

  const [search] = useSearch()

  const [filter] = useFilter()

  const { setTotal } = useTotalUsers()

  const { pagination, setPagination } = useDataTablePagination({
    defaultPageSize: 50,
    defaultPageIndex: 0,
  })

  const { data, isLoading, isFetching, isSuccess } = useCustomersPagination({
    variables: {
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      search: search ?? undefined,
      type: (filter.type ?? undefined) as unknown as CustomerType[],
      status: (filter.status ?? undefined) as unknown as boolean[],
    },
    enabled: canViewCustomer,
  })

  const queryClient = useQueryClient()

  const { mutate: updateCustomer, isPending } = useUpdateCustomer({
    onError() {},
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: useCustomersPagination.getKey(),
      })
      toastSuccess('Kích hoạt khách hàng thành công')
    },
  })

  useUpdateEffect(() => {
    if (isSuccess) {
      setTotal(data?.meta?.total || 0)
    }
  }, [data, isSuccess])

  const columns: ColumnDef<ILCCustomer>[] = [
    {
      header: 'Tên khách hàng',
      accessorKey: 'name',
      cell(props) {
        let trigger = <div className="line-clamp-2">{props.row.original.phone ?? '-'}</div>
        if (canViewDetailCustomer) {
          trigger = (
            <Link
              href={`${URLS.ADMIN.CUSTOMER.INDEX}/${props?.row?.original?._id}`}
              className="text-sm font-semibold text-[#2970FF] line-clamp-2"
            >
              {props.row.original.name ?? '-'}
            </Link>
          )
        }
        return (
          <Tooltip>
            <TooltipTrigger className="line-clamp-2 text-left max-w-[500px]">{trigger}</TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              <p className="  w-full text-start">{props?.row?.original?.name}</p>
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      header: 'Mã số thuế',
      accessorKey: 'taxCode',
      cell(props) {
        return <div className="text-nowrap">{props.row.original.taxCode ?? '-'}</div>
      },
    },
    {
      header: 'Số điện thoại',
      accessorKey: 'phone',
      cell(props) {
        return <div className="text-nowrap">{props.row.original.phone ?? '-'}</div>
      },
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell(props) {
        return <div className="text-nowrap">{props.row.original.email ?? '-'}</div>
      },
    },
    {
      header: () => <div className="text-nowrap">Phân loại</div>,
      accessorKey: 'type',
      cell(props) {
        return props.row.original.type === CustomerType.TA ? 'Đại lý' : 'Bán lẻ'
      },
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status',
      cell(props) {
        return (
          <div className="text-nowrap">
            <CustomerStatusChip isActive={props.row.original.isActive ?? false} />
          </div>
        )
      },
    },
    {
      header: () => <span className="sr-only">Hành động</span>,
      accessorKey: 'actions',

      cell(props) {
        return (
          <Popover>
            <PopoverTrigger asChild>
              <EllipsisIcon size={16} aria-hidden="true" role="button" className="transform rotate-90" />
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0 flex flex-col w-auto">
              {canToggleCustomer && props?.row?.original?.type === CustomerType.TA && (
                <div
                  onClick={() => {
                    if (!canToggleCustomer) return

                    if (props?.row?.original?.isActive === true) {
                      setOpenModalDisableCustomer(true, props?.row?.original?.name, props?.row?.original?._id)
                    } else {
                      updateCustomer({
                        id: props?.row?.original?._id,
                        dto: {
                          isActive: true,
                        },
                      })
                    }
                  }}
                  className="px-4 py-3 border-b-[1px] border-[#EAEAEA] flex items-center gap-1 text-sm"
                >
                  <UserCircleDashedIcon />
                  {props?.row?.original?.isActive === true ? 'Huỷ kích hoạt TA' : 'Kích hoạt TA'}
                </div>
              )}
              {canViewDetailCustomer && (
                <div
                  onClick={() => {
                    if (!canViewDetailCustomer) return
                    router.push(URLS.ADMIN.CUSTOMER.DETAIL.replace(':id', props?.row?.original?._id))
                  }}
                  className="px-4 py-3 border-b-[1px] border-[#EAEAEA] flex items-center gap-1 text-sm"
                >
                  <ListDashesIcon className="[&_path]:stroke-[#A7A7A7]" />
                  Xem chi tiết
                </div>
              )}
              {canDeleteCustomer && (
                <div
                  onClick={() => {
                    if (!canDeleteCustomer) return
                    setOpenModalDeleteCustomer(true, props?.row?.original?.name, props?.row?.original?._id)
                  }}
                  className="px-4 py-3 flex items-center gap-1 text-sm text-[#E73C3E]"
                >
                  <TrashIcon className="[&_path]:stroke-[#F87171]" />
                  Xoá TA
                </div>
              )}
            </PopoverContent>
          </Popover>
        )
      },
    },
  ]

  const setOpenModalDisableCustomer = (open: boolean, name?: string, customerId?: string) => {
    setModalDisableCustomerProps((state) => ({
      ...state,
      ...(name ? { name } : {}),
      ...(customerId ? { customerId } : {}),
      open,
    }))
  }

  const setOpenModalDeleteCustomer = (open: boolean, name?: string, customerId?: string) => {
    setModalDeleteCustomerProps((state) => ({
      ...state,
      ...(name ? { name } : {}),
      ...(customerId ? { customerId } : {}),
      open,
    }))
  }

  return (
    <PanelViewContent>
      <DataTable
        data={data?.data ?? []}
        columns={columns}
        pagination={{
          type: 'manual',
          total: data?.meta?.total || 0,
          ...pagination,
          setPagination,
        }}
        sortColumn="createdAt"
        className="h-full"
        tableClassName="table-auto"
        loading={isLoading || isFetching}
      />

      {modalDisableCustomerProps.name && modalDisableCustomerProps.customerId && (
        <ModalConfirmDisableCustomer
          customerId={modalDisableCustomerProps.customerId}
          name={modalDisableCustomerProps.name}
          open={modalDisableCustomerProps.open}
          setOpen={setOpenModalDisableCustomer}
        />
      )}

      {modalDeleteCustomerProps.name && modalDeleteCustomerProps.customerId && (
        <ModalConfirmDeleteCustomer
          customerId={modalDeleteCustomerProps.customerId}
          name={modalDeleteCustomerProps.name}
          open={modalDeleteCustomerProps.open}
          setOpen={setOpenModalDeleteCustomer}
        />
      )}
    </PanelViewContent>
  )
}

export default CustomerListTable
