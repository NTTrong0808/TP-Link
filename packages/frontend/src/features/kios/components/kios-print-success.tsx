import confirmPaymentImage from '@/assets/images/confirm-payment.png'
import { Button } from '@/components/ui/button'
import { useDialogContext } from '@/components/widgets/dialoger'
import Image from 'next/image'
import { ComponentProps, useState } from 'react'
import { useOrderActionsLogsStore } from '../store/use-order-action-logs'
import { useCreateActionLogs } from '@/lib/api/queries/action-log/use-create-action-logs'

export interface KiosPrintSuccessFormProps extends ComponentProps<'article'> {
  onConfirm?: (bookingId: string, dialogId: string) => Promise<void>
  onCancel?: (bookingId: string, dialogId: string) => Promise<void>
  bookingId: string
}

const KiosPrintSuccessForm = ({ onConfirm, onCancel, bookingId, ...props }: KiosPrintSuccessFormProps) => {
  const { dialog, close } = useDialogContext()
  const [isLoadingConfirm, setIsLoadingConfirm] = useState<boolean>(false)
  const [isLoadingCancel, setIsLoadingCancel] = useState<boolean>(false)
  const logAction = useOrderActionsLogsStore((s) => s.logAction)
  const { mutate: sendLogs } = useCreateActionLogs()
  const getPayload = useOrderActionsLogsStore((s) => s.getPayload)
  const resetSession = useOrderActionsLogsStore((s) => s.resetSession)

  const handleFinishOrder = () => {
    try {
      const dto = getPayload()
      sendLogs({ dto }) // gửi log
      resetSession() // reset session mới
    } catch (err) {
      console.error('Lỗi gửi order action logs:', err)
    }
  }

  const handleCancel = async () => {
    try {
      setIsLoadingCancel(true)
      logAction('Nhấn nút hủy in lại vé')

      await onCancel?.(bookingId, dialog.id)
      close()
    } catch (error) {
    } finally {
      setIsLoadingCancel(false)
      handleFinishOrder()
    }
  }
  const handleConfirm = async () => {
    try {
      setIsLoadingConfirm(true)
      logAction('Nhấn nút in lại vé')
      await onConfirm?.(bookingId, dialog.id)
    } catch (error) {
    } finally {
      setIsLoadingConfirm(false)
      handleFinishOrder()
    }
  }

  return (
    <article {...props} role="dialog" className="flex flex-col gap-6 p-2">
      <section className="text-center">
        <h2 className="font-semibold text-xl text-neutral-black leading-8">In vé thành công</h2>
      </section>

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
        >
          Huỷ
        </Button>
        <Button
          size="lg"
          onClick={handleConfirm}
          isLoading={isLoadingConfirm}
          disabled={isLoadingCancel || isLoadingConfirm}
        >
          In lại vé
        </Button>
      </section>
    </article>
  )
}

export default KiosPrintSuccessForm
