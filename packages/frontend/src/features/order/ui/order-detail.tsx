/* eslint-disable react/display-name */
'use client'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { useDialoger } from '@/components/widgets/dialoger'
import { toastError } from '@/components/widgets/toast'
import KiosPaymentSuccessForm from '@/features/kios/components/kios-payment-success'
import { usePrintPortal } from '@/features/print/contexts/print-portal-context'
import { PrintType } from '@/features/print/types'
import PrintBillPortal from '@/features/print/ui/print-bill-portal'
import PrintTicketPortal from '@/features/print/ui/print-ticket-portal'
import { formatCurrency } from '@/helper'
import { TICKET_VALID_TIME_TO_SECOND } from '@/helper/ticket'
import { URLParamQueryResult } from '@/hooks/get-url-param-query'
import { PanelView, PanelViewContent } from '@/layouts/panel/panel-view'
import useHeader from '@/layouts/panel/use-header'
import { BookingStatus } from '@/lib/api/queries/booking/schema'
import { getAllOrderHistoriesKey } from '@/lib/api/queries/order/get-all-order-histories'
import { useOrderDetail } from '@/lib/api/queries/order/get-order-detail'
import { useGetVatInvoiceMutation } from '@/lib/api/queries/order/get-vat-invoice'
import { IOrder } from '@/lib/api/queries/order/schema'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { appDayJs } from '@/utils/dayjs'
import { isValidObjectId } from '@/utils/is-valid-object-id'
import { useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { HistoryIcon, ListOrderedIcon } from 'lucide-react'
import { ComponentProps, memo, ReactNode, useLayoutEffect, useState } from 'react'
import CancelCashOrderDialog from '../components/cancel-cash-order-dialog'
import CancelOrderDialog from '../components/cancel-order-dialog'
import CancelPaymentDialog from '../components/cancel-payment-dialog'
import ConfirmPaymentDialog from '../components/confirm-payment-dialog'
import BookingNote from '../components/kios-note'
import OrderHistoryDialog from '../components/order-history-dialog'
import OrderStatusBadge from '../components/order-status-badge'
import QRButton from '../components/qr-button'
import ResendTicketEmailDialog from '../components/resend-ticket-dialog'
import TicketListDialog from './ticket-list-dialog'

const OrderDetail = ({ params }: URLParamQueryResult) => {
  const { id } = params
  const bookingId = id as string
  const canAccess = useCanAccess()

  const isCanResendTicket = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_RESEND_TICKET)
  const isCanAccessOfflineCreateBookingPayLater = canAccess(CASL_ACCESS_KEY.TICKET_OFFLINE_CREATE_BOOKING_PAY_LATER)
  const isCanCancelCashOrderPendingPayment = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_CANCEL_CASH_ORDER_PENDING_PAYMENT)
  const isCanCancelCashOrderCompletedNoVat = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_CANCEL_CASH_ORDER_COMPLETED_NO_VAT)
  const isCanCancelOrderIssuedInvoice = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_CANCEL_ORDER_ISSUED_INVOICE)
  const isCanCancelOrderNotIssuedInvoice = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_CANCEL_ORDER_NOT_ISSUE_INVOICE)
  const isCanViewOrderHistory = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_HISTORY_VIEW)

  const [bookingIdToPrint, setBookingIdToPrint] = useState<string>()
  const { setTitle } = useHeader({
    isBack: true,
  })
  const { addDialoger } = useDialoger()

  const queryClient = useQueryClient()

  const {
    data,
    refetch,
    isLoading: isLoadingOrderDetail,
  } = useOrderDetail({
    variables: {
      id: bookingId,
    },
    enabled: !!bookingId,
    select: (data) => {
      setTitle(`Số booking: ${data.data?.bookingCode || ''}`)
      return data.data
    },
  })

  const isCompletedBooking = data?.status === BookingStatus.COMPLETED

  const isProcessingBooking = data?.status === BookingStatus.PROCESSING

  const isCancelledBooking = data?.status === BookingStatus.CANCELLED

  const isBankTransfer = data?.bankAccount && data?.bookingCode

  const isPayoo = data?.paymentMethodName?.toLowerCase()?.includes('payoo')

  const isCash = !(isBankTransfer || isPayoo)

  const isBeforeExpiredVat =
    !data?.bookingVatExpiredAt ||
    (data?.bookingVatExpiredAt &&
      appDayJs(data?.bookingVatExpiredAt).isValid() &&
      appDayJs().isBefore(appDayJs(data?.bookingVatExpiredAt)))

  const customerEmail = data?.customer?.email || data?.vatInfo?.receiverEmail

  const { handlePrint, isPrinting } = usePrintPortal({
    onAfterPrint: () => {
      refetch()
    },
  })

  const { mutate: getVatInvoice, isPending: isGetVatInvoicePending } = useGetVatInvoiceMutation({
    onSuccess: (data) => {
      const url = URL.createObjectURL(data)
      window.open(url, '_blank')
    },
    onError: (error) => {
      console.log(error)
      toastError('Lỗi khi xem hóa đơn VAT')
    },
  })

  const isCanCancelCashOrder =
    ((isCompletedBooking && isCanCancelCashOrderCompletedNoVat) ||
      (isProcessingBooking && isCanCancelCashOrderPendingPayment)) &&
    isCash &&
    isBeforeExpiredVat &&
    data?.bookingCode &&
    !isCancelledBooking

  const isCanCancelOrder =
    ((data?.metadata?.transId && isCanCancelOrderIssuedInvoice) ||
      (!data?.metadata?.transId && isCanCancelOrderNotIssuedInvoice)) &&
    data?.bookingCode &&
    isCompletedBooking &&
    !isCancelledBooking

  const isCanUpdatePostPaidOrder = isBankTransfer && isProcessingBooking && isCanAccessOfflineCreateBookingPayLater

  const handleConfirmPayment = () => {
    if (isCanUpdatePostPaidOrder) {
      addDialoger({
        title: 'Xác nhận đã thanh toán',
        content: (
          <ConfirmPaymentDialog
            bookingCode={data?.bookingCode}
            bookingId={bookingId}
            bankAccount={data?.bankAccount}
            totalPaid={data?.totalPaid}
            onSuccess={() => {
              setBookingIdToPrint(data?._id)
              refetch().then(() => {
                handlePaymentSuccess()
              })
            }}
          />
        ),
        variant: 'dialog',
        disableCloseOutside: true,
        hideXIcon: true,
      })
    }
  }

  const handlePaymentSuccess = () => {
    addDialoger({
      variant: 'dialog',
      content: (
        <KiosPaymentSuccessForm
          bookingId={bookingId}
          closeLabel="Đóng"
          handleClosePaymentSuccess={() => setBookingIdToPrint(undefined)}
        />
      ),
      disableCloseOutside: true,
      hideXIcon: true,
    })
  }

  const handleCancelPayment = () => {
    if (isCanUpdatePostPaidOrder) {
      addDialoger({
        title: 'Huỷ thanh toán',
        content: (
          <CancelPaymentDialog bookingCode={data?.bookingCode} bookingId={bookingId} onSuccess={() => refetch()} />
        ),
        variant: 'dialog',
        disableCloseOutside: true,
        hideXIcon: true,
      })
    }
  }

  const handleCancelOrder = () => {
    if (isCanCancelCashOrder) {
      addDialoger({
        title: 'Huỷ đơn hàng thanh toán bằng tiền mặt',
        content: (
          <CancelCashOrderDialog bookingCode={data?.bookingCode} bookingId={bookingId} onSuccess={() => refetch()} />
        ),
        variant: 'dialog',
        disableCloseOutside: true,
        hideXIcon: true,
      })
    } else if (isCanCancelOrder) {
      addDialoger({
        title: 'Huỷ đơn hàng',
        content: (
          <CancelOrderDialog bookingCode={data?.bookingCode} bookingId={bookingId} onSuccess={() => refetch()} />
        ),
        variant: 'dialog',
        disableCloseOutside: true,
        hideXIcon: true,
      })
    } else {
      toastError('Bạn không có quyền huỷ đơn hàng')
    }
  }

  const handleSendEmail = () => {
    if (isCanResendTicket) {
      addDialoger({
        title: 'Gửi lại vé',
        content: <ResendTicketEmailDialog email={customerEmail} bookingId={bookingId} />,
        variant: 'dialog',
        disableCloseOutside: true,
        hideXIcon: true,
      })
    }
  }

  const handleViewOrderHistory = () => {
    if (isCanViewOrderHistory) {
      queryClient.refetchQueries({ queryKey: [getAllOrderHistoriesKey] })
      addDialoger({
        title: `Lịch sử thay đổi đơn hàng ${data?.bookingCode}`,
        content: <OrderHistoryDialog bookingId={bookingId} />,
        variant: 'dialog',
        disableCloseOutside: true,
        hideXIcon: true,
      })
    }
  }

  const fields: Record<
    string,
    {
      label: string
      value?: any
      valueClassName?: ComponentProps<'div'>['className']
      hidden?: boolean
      action?: ReactNode
    }[]
  > = {
    customer: [
      {
        label: 'Tên khách hàng',
        value: data?.customer?.name,
      },
      {
        label: 'Email',
        value: data?.customer?.email,
      },
      {
        label: 'Số điện thoại',
        value: data?.customer?.phone,
      },
      // {
      //   label: 'Ghi chú',
      //   value: data?.customer?.note,
      // },
    ],
    order: [
      {
        label: 'Số booking',
        value: data?.bookingCode,
      },
      {
        label: 'Mã biên lai',
        value: data?.receiptNumber,
      },
      {
        label: 'Ngày đặt',
        value: data?.createdAt ? appDayJs(data?.createdAt).format('DD/MM/YYYY HH:mm:ss') : '-',
      },
      {
        label: 'Thu ngân',
        value: data?.createdByName,
      },
      {
        label: 'Máy POS',
        value: data?.posTerminalName,
      },
      {
        label: 'Trạng thái đơn hàng',
        value: <OrderStatusBadge status={data?.status} />,
      },

      {
        label: 'Số tiền đã thanh toán',
        value:
          data?.status === BookingStatus.COMPLETED && data?.totalPaid ? formatCurrency(data?.totalPaid) + ' đ' : '-',
      },
      {
        label: 'Ghi chú',
        value: data?.note || '-',
        action: <BookingNote bookingId={bookingId} defaultValue={data?.note} />,
      },

      {
        label: 'Thời gian hiệu lực',
        value: data?.ticketValidFrom ? appDayJs(data?.ticketValidFrom).format('DD/MM/YYYY HH:mm:ss') : '-',
      },
      {
        label: 'Thời gian hết hiệu lực',
        value: data?.ticketValidTo ? appDayJs(data?.ticketValidTo).format('DD/MM/YYYY HH:mm:ss') : '-',
      },
    ],

    payment: [
      {
        label: 'Phương thức thanh toán',
        value: !isValidObjectId(data?.paymentMethodId?.toString() ?? '') ? 'Payoo OL' : data?.paymentMethodName || '-',
      },
      {
        label: 'Số tiền thanh toán',
        value: data?.totalPaid ? formatCurrency(data?.totalPaid) + ' đ' : '-',
        show: !!data?.bankAccountId,
      },

      {
        label: 'Thông tin tài khoản ngân hàng',
        value: data?.bankAccount?.bankName,
        show: !!data?.bankAccount?.bankName,
      },
      {
        label: 'Số tài khoản',
        value: data?.bankAccount?.accountNumber,
        show: !!data?.bankAccount?.accountNumber,
      },
      {
        label: 'Mã thanh toán Payoo',
        value: data?.payooData?.PaymentNo ?? data?.payooData?.PYTransId,
        show: isPayoo,
      },
      // {
      //   label: 'Số HĐ Payoo',
      //   value: data?.payooData?.InvoiceNo,
      // },
      {
        label: 'Mã chuẩn chi',
        value: data?.payooData?.AuthorizationNo,
        show: isPayoo,
      },
      {
        label: 'Mã tham chiếu',
        value: data?.payooData?.ReferenceNo,
        show: isPayoo,
      },

      {
        label: 'Ngày giao dịch',
        value: data?.payooData?.PaymentDate
          ? appDayJs(data?.payooData?.PaymentDate, 'YYYYMMDDHHmmss').format('DD/MM/YYYY HH:mm:ss')
          : data?.payooData?.PurchaseDate
          ? appDayJs(data?.payooData?.PurchaseDate, 'YYYYMMDDHHmmss').format('DD/MM/YYYY HH:mm:ss')
          : data?.confirmedAt
          ? appDayJs(data?.confirmedAt * 1000).format('DD/MM/YYYY HH:mm:ss')
          : '-',
      },
      {
        label: 'Người huỷ đơn',
        value: data?.cancelledByName,
        show: !!data?.cancelledByName,
      },
      {
        label: 'Ngày huỷ đơn',
        value: data?.cancelledAt ? appDayJs(data?.cancelledAt).format('DD/MM/YYYY HH:mm:ss') : '-',
        show: !!data?.cancelledAt,
      },
      {
        label: 'Lý do huỷ đơn',
        value: data?.cancelledReason,
        show: !!data?.cancelledReason,
        valueClassName: 'text-secondary-strawberry-300',
      },
    ].filter((item) => item?.show ?? true),

    ticket: [
      {
        label: 'Ngày bán vé',
        value: data?.confirmedAt ? appDayJs(data?.confirmedAt).format('DD/MM/YYYY') : '-',
      },
      {
        label: 'Số hóa đơn',
        value: data?.bookingCode,
      },
      {
        label: 'Thời gian hiệu lực',
        value: data?.ticketValidFrom ? appDayJs(data?.ticketValidFrom).format('DD/MM/YYYY HH:mm:ss') : '-',
      },
      {
        label: 'Thời gian hết hiệu lực',
        value: data?.ticketValidTo ? appDayJs(data?.ticketValidTo).format('DD/MM/YYYY HH:mm:ss') : '-',
      },
    ],
    vat: [
      {
        label: 'Mã số thuế',
        value: data?.vatInfo?.taxCode,
      },
      {
        label: 'Email',
        value: data?.vatInfo?.receiverEmail,
      },
      {
        label: 'Tên công ty/cá nhân',
        value: data?.vatInfo?.legalName,
      },
      {
        label: 'Địa chỉ',
        value: data?.vatInfo?.address,
      },
      {
        label: 'Mã meInvoice',
        value: data?.metadata?.invNo,
      },
      {
        label: 'Ghi chú',
        value: data?.vatInfo?.note,
      },
    ],
  }

  useLayoutEffect(() => {
    setTitle(`Số hóa đơn: ${data?.bookingCode}`)
  }, [data?.bookingCode])

  const columns: ColumnDef<IOrder['items'][number]>[] = [
    {
      header: 'Dịch vụ',
      accessorKey: 'title',
    },
    {
      header: 'Đơn giá',
      accessorKey: 'price',
      meta: {
        textAlign: 'right',
        justifyContent: 'end',
        columnClassName: 'fit-content',
      },
      cell(props) {
        return props.row.original.price && props.row.original.price > 0
          ? formatCurrency(props.row.original.price, {
              style: 'currency',
              currency: 'VND',
            })
          : '-'
      },
      maxSize: 120,
    },
    {
      header: 'Số lượng',
      accessorKey: 'quantity',
      meta: {
        textAlign: 'right',
        justifyContent: 'end',
        columnClassName: 'fit-content',
      },
      maxSize: 120,
    },
    {
      header: 'Tổng tiền',
      accessorKey: 'total',
      meta: {
        textAlign: 'right',
        justifyContent: 'end',
        columnClassName: 'fit-content',
      },
      cell(props) {
        return props.row.original.price && props.row.original.price > 0 && props.row.original.quantity > 0
          ? formatCurrency(props.row.original.price * props.row.original.quantity, {
              style: 'currency',
              currency: 'VND',
            })
          : '-'
      },
      size: 60,
      maxSize: 120,
    },
  ]

  return (
    <PanelView loading={isLoadingOrderDetail}>
      <div className="flex justify-between items-center gap-2 flex-col md:flex-row">
        <div>
          {isCanViewOrderHistory && (
            <Button variant="outline" onClick={handleViewOrderHistory} className="bg-white">
              <HistoryIcon className="size-4 text-neutral-grey-300" />
              Lịch sử thay đổi
            </Button>
          )}
        </div>
        <div className="flex gap-2 items-center flex-col md:flex-row">
          {isBankTransfer && isProcessingBooking && (
            <QRButton
              accountNumber={data?.bankAccount?.accountNumber}
              bankCode={data?.bankAccount?.bankCode}
              amount={data?.totalPaid}
              note={data?.bookingCode}
              accountName={data?.bankAccount?.accountName}
            />
          )}
          {isCanUpdatePostPaidOrder ? (
            <>
              <Button variant="outline" className="bg-white" onClick={handleCancelPayment}>
                Hủy thanh toán
              </Button>
              <Button onClick={handleConfirmPayment}>Xác nhận đã thanh toán</Button>
            </>
          ) : (
            (isCanCancelCashOrder || isCanCancelOrder) && (
              <Button variant="destructive" onClick={handleCancelOrder}>
                Hủy đơn hàng
              </Button>
            )
          )}
        </div>
      </div>

      <PanelViewContent>
        <div className="flex flex-col md:flex-row gap-6 h-full">
          <InfoCard className="w-full md:max-w-[300px]" title="Thông tin đơn hàng">
            <div className="flex flex-col gap-4">
              {fields.order.map((item) => (
                <InfoItem key={item.label} {...item} />
              ))}

              {isCompletedBooking && (
                <Button
                  size="sm"
                  variant="outline"
                  className=""
                  onClick={() => handlePrint(PrintType.BILL, { bookingId })}
                  loading={isLoadingOrderDetail || isPrinting}
                >
                  <ListOrderedIcon className="size-4" />
                  In hóa đơn
                </Button>
              )}
            </div>
          </InfoCard>
          <div className="flex flex-col gap-6 flex-1">
            <InfoCard title="Thông tin khách hàng">
              <div className="grid md:grid-cols-4 gap-6 justify-between">
                {fields.customer.map((item) => (
                  <InfoItem key={item.label} {...item} />
                ))}
              </div>
            </InfoCard>
            <InfoCard
              title="Thông tin xuất hóa đơn GTGT"
              extra={[
                data?.metadata?.transId && (
                  <Button
                    size="lg"
                    variant="ghost"
                    key="view-vat"
                    className={'cursor-pointer text-semantic-info-300'}
                    disabled={!data?.metadata?.transId}
                    loading={isGetVatInvoicePending || isLoadingOrderDetail}
                    onClick={() => getVatInvoice({ bookingId: bookingId as string })}
                  >
                    Xem VAT
                  </Button>
                ),
              ]}
            >
              <div className="grid md:grid-cols-4 gap-6 justify-between">
                {fields.vat.map((item) => (
                  <InfoItem key={item.label} {...item} />
                ))}
              </div>
            </InfoCard>
            <InfoCard title="Thông tin thanh toán">
              <div className="grid md:grid-cols-4 gap-6 justify-between">
                {fields.payment.map((item) => (
                  <InfoItem key={item.label} {...item} />
                ))}
              </div>
            </InfoCard>
            <InfoCard
              className="h-full"
              title="Chi tiết đơn hàng"
              extra={
                isCompletedBooking && [
                  isCanResendTicket && (
                    <Button
                      key="resend-ticket"
                      size="lg"
                      variant="ghost"
                      className="cursor-pointer text-semantic-info-300"
                      loading={isLoadingOrderDetail}
                      disabled={
                        !(
                          (data?.customer?.email || data?.vatInfo?.receiverEmail) &&
                          data?.items?.length &&
                          data?.items?.length > 0 &&
                          appDayJs().isBefore(
                            appDayJs(data.checkInDate).startOf('day').add(TICKET_VALID_TIME_TO_SECOND, 'second'),
                          ) &&
                          data?.status === BookingStatus.COMPLETED
                        )
                      }
                      onClick={handleSendEmail}
                    >
                      Gửi lại vé
                    </Button>
                  ),
                  <TicketListDialog key="view-ticket" orderData={data} />,
                ]
              }
            >
              <div className="flex flex-col gap-4">
                <DataTable
                  tableClassName="table-auto"
                  data={data?.items?.filter((item) => item?.quantity > 0) || []}
                  columns={columns}
                  className="h-full"
                  pagination={{ hidden: true }}
                />
                <div className="text-base font-bold flex justify-between items-center">
                  <div>Tổng cộng</div>
                  <div>{data?.totalPaid && data?.totalPaid >= 0 ? formatCurrency(data?.totalPaid) + 'đ' : '-'}</div>
                </div>
              </div>
            </InfoCard>
          </div>
        </div>
        {data &&
          isCompletedBooking &&
          (bookingIdToPrint ? <PrintTicketPortal bookingId={bookingIdToPrint} /> : <PrintBillPortal booking={data} />)}
      </PanelViewContent>
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
          <p className="text-xs font-semibold text-zinc-600 mb-1">{label}</p>
          {action}
        </div>
        <p className={cn('text-sm font-normal', valueClassName)}>{value || '-'}</p>
      </div>
    )
  },
)

export default OrderDetail
