import confirmPaymentImage from '@/assets/images/confirm-payment.png'
import { Button } from '@/components/ui/button'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError } from '@/components/widgets/toast'
import Image from 'next/image'
import { ComponentProps, useState } from 'react'

export interface KiosPaymentConfirmationFormProps extends ComponentProps<'article'> {
  onConfirm?: (bookingId: string, dialogId: string) => Promise<void>
  onCancel?: (bookingId: string, dialogId: string) => Promise<void>
  bookingId: string
  bookingCode?: string
}

const KiosPaymentConfirmationForm = ({
  onConfirm,
  onCancel,
  bookingId,
  bookingCode,
  ...props
}: KiosPaymentConfirmationFormProps) => {
  const { dialog, close } = useDialogContext()
  const [isLoadingConfirm, setIsLoadingConfirm] = useState<boolean>(false)
  const [isLoadingCancel, setIsLoadingCancel] = useState<boolean>(false)

  const handleCancel = async () => {
    try {
      setIsLoadingCancel(true)
      await onCancel?.(bookingId, dialog.id)
    } catch (error) {
    } finally {
      setIsLoadingCancel(false)
    }
  }
  const handleConfirm = async () => {
    try {
      setIsLoadingConfirm(true)
      await onConfirm?.(bookingId, dialog.id)
    } catch (error: any) {
      toastError(error)
      close()
    } finally {
      setIsLoadingConfirm(false)
    }
  }
  return (
    <article {...props} role="dialog" className="flex flex-col gap-6 p-2">
      <section className="text-center">
        <h2 className="font-semibold text-xl text-neutral-black leading-8">Xác nhận thanh toán</h2>
      </section>

      {bookingCode && <div className="text-center">Số hoá đơn: {bookingCode}</div>}
      <div className="w-full p-6 flex items-center justify-center rounded-md bg-[#F5F5F5]">
        <Image
          src={confirmPaymentImage}
          alt="Thanh toán"
          width={0}
          height={0}
          className="w-auto h-[120px] object-cover"
        />
      </div>

      <section className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={handleCancel}
          isLoading={isLoadingCancel}
          disabled={isLoadingCancel || isLoadingConfirm}
          type="button"
        >
          Huỷ thanh toán
        </Button>
        <Button
          size="lg"
          onClick={handleConfirm}
          isLoading={isLoadingConfirm}
          disabled={isLoadingCancel || isLoadingConfirm}
          type="submit"
          autoFocus
        >
          Hoàn tất
        </Button>
      </section>
    </article>
  )
}

export default KiosPaymentConfirmationForm
