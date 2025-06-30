import waitingPaymentImage from '@/assets/images/waiting-payment.png'
import { Button } from '@/components/ui/button'
import { useDialogContext, useDialoger } from '@/components/widgets/dialoger'
import { toastError } from '@/components/widgets/toast'
import { PayooOrderStatus } from '@/lib/api/queries/booking/schema'
import { useVerifyBookingOffline } from '@/lib/api/queries/booking/verify-booking-offline'
import Image from 'next/image'
import { ComponentProps, useState } from 'react'
import { useUpdateEffect } from 'react-use'
import useCountDown from '../hooks/use-count-down'

export interface KiosWaitingPaymentFormProps extends ComponentProps<'article'> {
  onConfirm?: (bookingId: string, dialogId: string) => void
  onCancel?: (bookingId: string, dialogId: string) => Promise<void>
  bookingId: string
  bookingCode?: string
  handleCloseCurrentOrder?: () => void
}

const KiosWaitingPaymentForm = ({
  onConfirm,
  onCancel,
  bookingId,
  bookingCode,

  handleCloseCurrentOrder,
  ...props
}: KiosWaitingPaymentFormProps) => {
  const { dialog, close } = useDialogContext()
  const { addDialoger, dialogs } = useDialoger()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const count = useCountDown({ from: 5 })
  const { data: verifyData, isLoading: isLoadingVerify } = useVerifyBookingOffline({
    variables: {
      bookingId,
    },
    refetchInterval: 5000,
  })

  const handleVerifyBooking = ({
    status,
    message,
    bookingId,
  }: {
    status: number
    message: string
    bookingId: string
  }) => {
    // 0: 'Chưa thanh toán',
    // 1: 'Đã thanh toán',
    // 2: 'Hủy thanh toán',
    // 3: 'Hủy đơn hàng',
    if (status === 0) return
    if (status === 1) {
      close()
      onConfirm?.(bookingId, dialog.id)

      // Bỏ vì ở đây show 2 dialog
      // addDialoger({
      //   variant: 'dialog',
      //   content: <KiosPaymentSuccessForm bookingId={bookingId} handleCloseCurrentOrder={handleCloseCurrentOrder} />,
      //   disableCloseOutside: true,
      //   hideXIcon: true,
      // })
      return
    }
    if (status === 2) {
      onCancel?.(bookingId, dialog.id)
      toastError(PayooOrderStatus[2])
      return
    }
    if (status === 3) {
      onCancel?.(bookingId, dialog.id)
      toastError(PayooOrderStatus[3])
      return
    }
  }

  const handleCancel = async () => {
    try {
      setIsLoading(true)
      await onCancel?.(bookingId, dialog.id)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  useUpdateEffect(() => {
    if (!verifyData?.data) return
    handleVerifyBooking({ ...verifyData.data, bookingId })
  }, [verifyData])

  return (
    <article {...props} role="dialog" className="flex flex-col gap-6 p-2">
      <section className="text-center">
        <h2 className="font-semibold text-xl text-neutral-black leading-8">Đang chờ thanh toán</h2>
      </section>
      {bookingCode && <div className="text-center">Số hoá đơn: {bookingCode}</div>}
      <div className="w-full p-6 flex items-center justify-center rounded-md bg-[#F5F5F5]">
        <Image
          src={waitingPaymentImage}
          alt="Thanh toán"
          width={0}
          height={0}
          className="w-auto h-[120px] object-cover"
        />
      </div>
      <Button
        variant="outline"
        size="lg"
        onClick={handleCancel}
        isLoading={isLoading || isLoadingVerify}
        disabled={count !== 0}
      >
        Huỷ thanh toán ({count})
      </Button>
    </article>
  )
}

export default KiosWaitingPaymentForm
