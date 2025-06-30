/* eslint-disable react/display-name */
'use client'

import { Button } from '@/components/ui/button'
import { useDialoger } from '@/components/widgets/dialoger'
import OrderStatusBadge from '@/features/order/components/order-status-badge'
import { usePrintPortal } from '@/features/print/contexts/print-portal-context'
import { PrintType } from '@/features/print/types'
import PrintTicketPortal from '@/features/print/ui/print-ticket-portal'
import { formatCurrency } from '@/helper'
import { PanelView, PanelViewContent } from '@/layouts/panel/panel-view'
import useHeader from '@/layouts/panel/use-header'
import { useGetIssuedTicketById } from '@/lib/api/queries/ticket/get-issued-ticket-by-id'
import { ISSUED_TICKET_STATUS } from '@/lib/api/queries/ticket/schema'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { appDayJs } from '@/utils/dayjs'
import { isValidObjectId } from '@/utils/is-valid-object-id'
import { CheckCheckIcon, PrinterIcon, Trash2Icon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ComponentProps, ReactNode, memo } from 'react'
import IssuedTicketDeleteConfirm from '../components/issued-ticket-delete-confirm-dialog'
import IssuedTicketMarkAsUsedConfirm from '../components/issued-ticket-mark-as-used-confirm-dialog'
import TicketHistoryTimeline from '../components/ticket-history-timeline'

const IssuedTicketDetail = () => {
  const { addDialoger } = useDialoger()
  const { setTitle } = useHeader({
    isBack: true,
  })
  const { id } = useParams()

  const canAccess = useCanAccess()

  const isCanViewIssuedTicketDetail = canAccess(CASL_ACCESS_KEY.TICKET_ISSUED_TICKET_VIEW_DETAIL)
  const isCanDeleteIssuedTicket = canAccess(CASL_ACCESS_KEY.TICKET_ISSUED_TICKET_DELETE)
  const isCanMarkAsUsedIssuedTicket = canAccess(CASL_ACCESS_KEY.TICKET_ISSUED_TICKET_MARK_AS_USED)
  const isCanPrintIssuedTicket = canAccess(CASL_ACCESS_KEY.TICKET_ISSUED_TICKET_PRINT)
  const isCanViewIssuedTicketHistory = canAccess(CASL_ACCESS_KEY.TICKET_ISSUED_TICKET_HISTORY_VIEW)

  const { isPrinting, handlePrint } = usePrintPortal()

  const { data, refetch, isFetching } = useGetIssuedTicketById({
    variables: {
      id: id as string,
    },
    enabled: isCanViewIssuedTicketDetail && !!id,
    select: (data) => {
      setTitle(`Mã vé: ${data.data?.issuedCode || ''}`)
      return data.data
    },
  })

  const handleDeleteIssuedTickets = (ticketIds?: string[], ticketCodes?: string[]) => {
    if (ticketIds && ticketIds?.length > 0) {
      addDialoger({
        title: 'Xoá vé',
        content: (
          <IssuedTicketDeleteConfirm issuedTicketIds={ticketIds} issuedCodes={ticketCodes} handleRefetch={refetch} />
        ),
        variant: 'dialog',
        disableCloseOutside: true,
        hideXIcon: true,
      })
    }
  }
  const handleMarkAsUsedIssuedTickets = (ticketIds?: string[], ticketCodes?: string[]) => {
    if (ticketIds && ticketIds?.length > 0) {
      addDialoger({
        title: 'Đánh dấu đã sử dụng vé',
        content: (
          <IssuedTicketMarkAsUsedConfirm
            issuedTicketIds={ticketIds}
            issuedCodes={ticketCodes}
            handleRefetch={refetch}
          />
        ),
        variant: 'dialog',
        disableCloseOutside: true,
        hideXIcon: true,
      })
    }
  }

  const isPayoo = data?.booking?.paymentMethodName?.toLowerCase()?.includes('payoo')

  const fields: Record<
    string,
    {
      label: string
      value: any
      show?: boolean
    }[]
  > = {
    booking: [
      {
        label: 'Mã biên lai',
        value: data?.booking?.receiptNumber,
      },
      {
        label: 'Số booking',
        value: data?.booking?.bookingCode,
      },
      {
        label: 'Ngày đặt',
        value:
          data?.booking?.createdAt && appDayJs(data?.booking?.createdAt).isValid()
            ? appDayJs(data?.booking?.createdAt).format('DD/MM/YYYY HH:mm:ss')
            : '-',
      },
      {
        label: 'Trạng thái đơn hàng',
        value: <OrderStatusBadge status={data?.booking?.status} />,
      },
      {
        label: 'Ghi chú',
        value: data?.booking?.note || '-',
      },
      {
        label: 'Thời gian tạo',
        value:
          data?.createdAt && appDayJs(data?.createdAt).isValid()
            ? appDayJs(data?.createdAt).format('DD/MM/YYYY HH:mm:ss')
            : '-',
      },

      {
        label: 'Lần in cuối',
        value: data?.lastPrintTime,
      },

      {
        label: 'Thời gian hiệu lực',
        value:
          data?.validFrom && appDayJs(data?.validFrom).isValid()
            ? appDayJs(data?.validFrom).format('DD/MM/YYYY HH:mm:ss')
            : '-',
      },
      {
        label: 'Thời gian hết hiệu lực',
        value:
          data?.validTo && appDayJs(data?.validTo).isValid()
            ? appDayJs(data?.validTo).format('DD/MM/YYYY HH:mm:ss')
            : '-',
      },
    ],

    customer: [
      {
        label: 'Tên khách hàng',
        value: data?.booking?.customer?.name || '-',
      },
      {
        label: 'Email',
        value: data?.booking?.customer?.email || '-',
      },
      {
        label: 'Số điện thoại',
        value: data?.booking?.customer?.phone || '-',
      },
    ],
    payment: [
      {
        label: 'Phương thức thanh toán',
        value: !isValidObjectId(data?.booking?.paymentMethodId?.toString() ?? '')
          ? 'Payoo OL'
          : data?.booking?.paymentMethodName || '-',
      },
      {
        label: 'Số tiền thanh toán',
        value: data?.booking?.totalPaid
          ? formatCurrency(data?.booking?.totalPaid, {
              currency: 'VND',
              style: 'currency',
            })
          : '-',
        show: !!data?.booking?.paymentMethodId,
      },

      {
        label: 'Thông tin tài khoản ngân hàng',
        value: data?.booking?.bankAccount?.bankName,
        show: !!data?.booking?.bankAccount?.bankName,
      },
      {
        label: 'Số tài khoản',
        value: data?.booking?.bankAccount?.accountNumber,
        show: !!data?.booking?.bankAccount?.accountNumber,
      },
      {
        label: 'Mã thanh toán Payoo',
        value: data?.booking?.payooData?.PaymentNo ?? data?.booking?.payooData?.PYTransId,
        show: isPayoo,
      },
      // {
      //   label: 'Số HĐ Payoo',
      //   value: data?.payooData?.InvoiceNo,
      // },
      {
        label: 'Mã chuẩn chi',
        value: data?.booking?.payooData?.AuthorizationNo,
        show: isPayoo,
      },
      {
        label: 'Mã tham chiếu',
        value: data?.booking?.payooData?.ReferenceNo,
        show: isPayoo,
      },

      {
        label: 'Ngày giao dịch',
        value: data?.booking?.payooData?.PaymentDate
          ? appDayJs(data?.booking?.payooData?.PaymentDate, 'YYYYMMDDHHmmss').format('DD/MM/YYYY HH:mm:ss')
          : data?.booking?.payooData?.PurchaseDate
          ? appDayJs(data?.booking?.payooData?.PurchaseDate, 'YYYYMMDDHHmmss').format('DD/MM/YYYY HH:mm:ss')
          : data?.booking?.confirmedAt
          ? appDayJs(data?.booking?.confirmedAt * 1000).format('DD/MM/YYYY HH:mm:ss')
          : '-',
      },
      {
        label: 'Người huỷ đơn',
        value: data?.booking?.cancelledByName,
        show: !!data?.booking?.cancelledByName,
      },
      {
        label: 'Ngày huỷ đơn',
        value: data?.booking?.cancelledAt ? appDayJs(data?.booking?.cancelledAt).format('DD/MM/YYYY HH:mm:ss') : '-',
        show: !!data?.booking?.cancelledAt,
      },
      {
        label: 'Lý do huỷ đơn',
        value: data?.booking?.cancelledReason,
        show: !!data?.booking?.cancelledReason,
        valueClassName: 'text-secondary-strawberry-300',
      },
    ].filter((item) => item?.show ?? true),
  }

  const isUnUsed = data?.issuedCode && data?.status === ISSUED_TICKET_STATUS.UN_USED
  const isDeleted = data?.issuedCode && data?.status === ISSUED_TICKET_STATUS.DELETED
  const isExpired = data?.issuedCode && data?.status === ISSUED_TICKET_STATUS.EXPIRED

  return (
    <PanelView loading={isFetching}>
      <div className="flex justify-end items-center gap-2 flex-col md:flex-row">
        {isUnUsed && isCanPrintIssuedTicket && (
          <Button
            variant="outline"
            className="bg-white"
            loading={isPrinting}
            disabled={!(isUnUsed || isCanPrintIssuedTicket)}
            onClick={() => data?.issuedCode && handlePrint(PrintType.TICKET, { issuedCodes: [data?.issuedCode] })}
          >
            <PrinterIcon className="size-4 text-neutral-grey-300" />
            In vé
          </Button>
        )}
        {isUnUsed && isCanMarkAsUsedIssuedTicket && (
          <Button
            variant="outline"
            className="bg-white"
            disabled={!(isUnUsed || isCanMarkAsUsedIssuedTicket)}
            onClick={() => {
              const ticketIds = data?._id ? [data?._id] : []
              const ticketCodes = data?.issuedCode ? [data?.issuedCode] : []
              handleMarkAsUsedIssuedTickets(ticketIds, ticketCodes)
            }}
          >
            <CheckCheckIcon className="size-4 text-neutral-grey-300" />
            Đánh dấu đã sử dụng
          </Button>
        )}
        {!(isDeleted || isExpired) && isCanDeleteIssuedTicket && (
          <Button
            variant="destructive"
            disabled={isDeleted || isExpired || !isCanDeleteIssuedTicket}
            onClick={() => {
              const ticketIds = data?._id ? [data?._id] : []
              const ticketCodes = data?.issuedCode ? [data?.issuedCode] : []
              handleDeleteIssuedTickets(ticketIds, ticketCodes)
            }}
          >
            <Trash2Icon />
            Xoá vé
          </Button>
        )}
      </div>

      <PanelViewContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="grid gap-6 flex-1">
            <InfoCard title="Thông tin vé">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {fields.booking.map((item) => (
                  <InfoItem key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
            </InfoCard>
            <InfoCard title="Thông tin khách hàng">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {fields.customer.map((item) => (
                  <InfoItem key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
            </InfoCard>
            <InfoCard title="Thông tin thanh toán">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {fields.payment.map((item) => (
                  <InfoItem key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
            </InfoCard>
          </div>

          {isCanViewIssuedTicketHistory && (
            <div className="max-w-[300px] flex-1">
              <InfoCard title="Lịch sử vé">
                <TicketHistoryTimeline
                  data={data?.histories}
                  ticketStatus={data?.status}
                  ticketExpiryDate={data?.expiryDate}
                />
              </InfoCard>
            </div>
          )}
        </div>
      </PanelViewContent>
      {data && <PrintTicketPortal tickets={[data]} />}
    </PanelView>
  )
}

const InfoCard = memo(
  ({
    children,
    title,
    extra,
    ...props
  }: ComponentProps<'div'> & {
    title?: string | ReactNode
    extra?: ReactNode | string
  }) => {
    return (
      <div {...props} className={cn('grid h-fit gap-6 p-4 bg-white rounded-md border border-low', props.className)}>
        <div className="inline-flex justify-between items-center text-base">
          <div className="font-bold">{title}</div>
          <div className="flex gap-6 font-medium">{extra}</div>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    )
  },
)

const InfoItem = memo(
  ({
    label,
    value,
    valueClassName,
    action,
    ...props
  }: {
    label: string | ReactNode
    value?: any
    action?: ReactNode
    valueClassName?: ComponentProps<'div'>['className']
  } & ComponentProps<'div'>) => {
    return (
      <div {...props} className={cn('break-words', props.className)}>
        <div className="flex items-center w-full justify-between">
          <div className="text-xs font-semibold text-zinc-600 mb-1">{label}</div>
          {action}
        </div>
        <div className={cn('text-sm font-normal', valueClassName)}>{value || '-'}</div>
      </div>
    )
  },
)

export default IssuedTicketDetail
