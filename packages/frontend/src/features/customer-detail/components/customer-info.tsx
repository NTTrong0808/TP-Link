import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useDialoger } from '@/components/widgets/dialoger'
import ClockIcon from '@/components/widgets/icons/clock-icon'
import EditIcon from '@/components/widgets/icons/edit-icon'
import ListDashesIcon from '@/components/widgets/icons/list-dashes-icon'
import MoneyIcon from '@/components/widgets/icons/money-icon'
import TicketIcon from '@/components/widgets/icons/ticket-icon'
import TrashIcon from '@/components/widgets/icons/trash-icon'
import { toastSuccess } from '@/components/widgets/toast'
import { URLS } from '@/constants/urls'
import useHeader from '@/layouts/panel/use-header'
import { useCustomer } from '@/lib/api/queries/customer/get-customer'
import { useCustomerStatistics } from '@/lib/api/queries/customer/get-customer-statistics'
import { CustomerType } from '@/lib/api/queries/customer/schema'
import { useUpdateCustomer } from '@/lib/api/queries/customer/update-customer'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { formatInternationalCurrency } from '@/utils/currency'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'
import ModalConfirmDeleteCustomer from './modal-confirm-delete-customer'
import ModalConfirmDisableCustomer from './modal-confirm-disable-customer'
import UpdateCustomerForm from './update-customer-form'

type Props = {
  customerId: string
}
const CustomerInfo = ({ customerId }: Props) => {
  const isCanAccess = useCanAccess()
  const canUpdateCustomer = isCanAccess(CASL_ACCESS_KEY.TICKET_CUSTOMER_UPDATE)
  const canToggleCustomer = isCanAccess(CASL_ACCESS_KEY.TICKET_CUSTOMER_TOGGLE)
  const canDeleteCustomer = isCanAccess(CASL_ACCESS_KEY.TICKET_CUSTOMER_DELETE)

  const [modalDisableCustomerProps, setModalDisableCustomerProps] = useState<{
    open: boolean
    name?: string
  }>({
    open: false,
  })

  const [modalDeleteCustomerProps, setModalDeleteCustomerProps] = useState<{
    open: boolean
    name?: string
  }>({
    open: false,
  })

  const {
    data: customer,
    isLoading,
    error,
  } = useCustomer({
    variables: {
      id: customerId,
    },
  })

  useHeader({ isBack: true })

  const router = useRouter()

  if (error) redirect(redirect(URLS.ADMIN.CUSTOMER.INDEX))

  const queryClient = useQueryClient()
  const { addDialoger } = useDialoger()

  const { mutate: updateCustomer, isPending } = useUpdateCustomer({
    onError() {},
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: useCustomer.getKey() })
      toastSuccess('Kích hoạt khách hàng thành công')
      setOpenModalDisableCustomer(false)
    },
  })

  const { data: statistics, isLoading: isLoadingStatistics } = useCustomerStatistics({
    variables: {
      id: customerId,
    },
  })

  const mappedValues = [
    {
      label: 'Tên TA',
      field: 'name',
    },
    {
      label: 'Số điện thoại',
      field: 'phone',
    },
    {
      label: 'Email',
      field: 'email',
    },
    {
      label: 'Khách hàng',
      field: 'type',
      mapFunc: (value: string) => (value === CustomerType.TA ? 'TA' : 'Khách lẻ'),
    },
    {
      label: 'Mã số thuế',
      field: 'taxCode',
    },
    {
      label: 'Tên công ty/cá nhân',
      field: 'companyName',
    },
    {
      label: 'Địa chỉ',
      field: 'address',
    },
    {
      label: 'Tên ngân hàng',
      field: 'bankName',
    },
    {
      label: 'Số tài khoản NH',
      field: 'bankNumber',
    },
    {
      label: 'Chi nhánh',
      field: 'bankBranch',
    },
    {
      label: 'Hợp đồng',
      field: 'contract',
      isLink: true,
    },
  ]

  const statisticsMapper = [
    {
      label: 'Tổng đơn hàng',
      field: 'totalBookings',
      icon: ListDashesIcon,
    },
    {
      label: 'Tổng vé đã mua',
      field: 'totalTickets',
      icon: TicketIcon,
    },
    {
      label: 'Tổng tiền đã sử dụng',
      field: 'totalPaid',
      icon: MoneyIcon,
      isFormatCurrency: true,
    },
    // {
    //   label: "Công nợ",
    //   field: "totalOrders",
    //   icon: HandCoinsIcon,
    //   isFormatCurrency: true,
    // },
  ]

  const setOpenModalDisableCustomer = (open: boolean, name?: string) => {
    setModalDisableCustomerProps((state) => ({
      ...state,
      ...(name ? { name } : {}),
      open,
    }))
  }

  const setOpenModalDeleteCustomer = (open: boolean, name?: string) => {
    setModalDeleteCustomerProps((state) => ({
      ...state,
      ...(name ? { name } : {}),
      open,
    }))
  }

  const handleUpdateUserDialog = () => {
    if (!canUpdateCustomer) return
    addDialoger({
      title: 'Chỉnh sửa khách hàng',
      content: (
        <UpdateCustomerForm
          onCompleted={() => {
            queryClient.invalidateQueries({ queryKey: useCustomer.getKey() })
          }}
          customerId={customerId}
        />
      ),
      variant: 'dialog',
    })
  }

  return isLoading || isLoadingStatistics ? (
    <Skeleton className="w-full h-[375px] bg-white/10" />
  ) : (
    <section className="bg-white w-full flex flex-col rounded-md border-[1px] border-solid border-neutral-grey-10">
      <div className="px-6 py-4 flex items-center justify-between border-b-[1px] border-neutral-grey-100">
        <h2 className="font-bold text-base">Thông tin khách hàng</h2>
        <div className="flex items-center gap-8 font-medium">
          {canToggleCustomer && (
            <label htmlFor="isActive" className="flex items-center gap-2 text-base hover:cursor-pointer">
              <Switch
                id="isActive"
                checked={customer?.isActive ?? false}
                disabled={isPending}
                onClick={() => {
                  if (!canUpdateCustomer) return
                  if (customer?.isActive) {
                    setOpenModalDisableCustomer(true, customer.name)
                  } else {
                    updateCustomer({
                      id: customerId,
                      dto: {
                        isActive: true,
                      },
                    })
                  }
                }}
              />
              Hoạt động
            </label>
          )}
          <div
            className="flex items-center gap-2 hover:cursor-pointer"
            onClick={() => router.push(URLS.ADMIN.CUSTOMER.HISTORY.replace(':id', customerId))}
          >
            <ClockIcon className="[&_path]:stroke-[#A7A7A7]" />
            Lịch sử thay đổi
          </div>
          {canDeleteCustomer && (
            <div
              onClick={() => setOpenModalDeleteCustomer(true, customer?.name)}
              className="flex items-center gap-2 hover:cursor-pointer"
            >
              <TrashIcon className="[&_path]:stroke-[#A7A7A7]" />
              Xoá TA
            </div>
          )}
          {canUpdateCustomer && (
            <div onClick={handleUpdateUserDialog} className="flex items-center gap-2 hover:cursor-pointer">
              <EditIcon className="[&_path]:stroke-[#A7A7A7]" />
              Chỉnh sửa
            </div>
          )}
        </div>
      </div>

      <div className="p-6 grid grid-cols-4 gap-6 border-b-[1px] border-neutral-grey-100">
        {mappedValues.map((value) => (
          <div className="flex flex-col gap-1" key={value.field}>
            <span className="text-xs font-semibold text-secondary-foreground">{value.label}</span>
            <Tooltip>
              <TooltipTrigger className="">
                {value?.isLink && value && (customer as any)?.[value.field] ? (
                  <Link
                    href={(customer as any)?.[value.field] ?? '#'}
                    target="_blank"
                    className="text-sm line-clamp-1 w-full text-start text-semantic-info-400"
                  >
                    {(customer as any)?.[value.field] ?? '-'}
                  </Link>
                ) : (
                  <p className="text-sm line-clamp-1 w-full text-start">{(customer as any)?.[value.field] ?? '-'}</p>
                )}
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                <p className="text-sm  w-full text-start">{(customer as any)?.[value.field] ?? '-'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>

      <div className="p-6 grid grid-cols-4 gap-4">
        {statisticsMapper.map((statistic) => (
          <div className="flex items-center gap-3" key={statistic.label}>
            <div className="rounded-md bg-secondary-background w-12 h-12 flex items-center justify-center">
              <statistic.icon className="[&_path]:stroke-[#A7A7A7]" />
            </div>
            <div className="flex h-full items-start justify-between flex-col gap-1">
              <span className="text-secondary-foreground font-medium text-xs">{statistic.label}</span>
              <span className="text-lg font-medium text-[#1F1F1F]">
                {statistic.isFormatCurrency
                  ? formatInternationalCurrency((statistics as any)?.[statistic.field] as number)
                  : (statistics as any)?.[statistic.field]}
              </span>
            </div>
          </div>
        ))}
      </div>
      {modalDisableCustomerProps.name && canUpdateCustomer && (
        <ModalConfirmDisableCustomer
          customerId={customerId}
          name={modalDisableCustomerProps.name}
          open={modalDisableCustomerProps.open}
          setOpen={setOpenModalDisableCustomer}
        />
      )}

      {modalDeleteCustomerProps.name && canDeleteCustomer && (
        <ModalConfirmDeleteCustomer
          customerId={customerId}
          name={modalDeleteCustomerProps.name}
          open={modalDeleteCustomerProps.open}
          setOpen={setOpenModalDeleteCustomer}
        />
      )}
    </section>
  )
}

export default CustomerInfo
