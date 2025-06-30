import paymentSuccessImage from '@/assets/images/payment-success.png'
import { Button } from '@/components/ui/button'
import { useDialogContext, useDialoger } from '@/components/widgets/dialoger'
import { usePrintPortal } from '@/features/print/contexts/print-portal-context'
import { PrintType } from '@/features/print/types'
import Image from 'next/image'
import { ComponentProps, useState } from 'react'
import { useUpdateEffect } from 'react-use'
import useCountDown from '../hooks/use-count-down'
import KiosPrintSuccessForm from './kios-print-success'
import { useOrderActionsLogsStore } from '../store/use-order-action-logs'
import { useCreateActionLogs } from '@/lib/api/queries/action-log/use-create-action-logs'

export interface KiosPaymentSuccessFormProps extends ComponentProps<'article'> {
  onConfirm?: (bookingId: string, dialogId: string) => void
  onCancel?: (bookingId: string, dialogId: string) => void
  bookingId: string
  handleClosePaymentSuccess?: () => void
  closeLabel?: string
}

const KiosPaymentSuccessForm = ({
  onConfirm,
  onCancel,
  bookingId,
  handleClosePaymentSuccess,
  closeLabel = 'Về trang bán vé',
  ...props
}: KiosPaymentSuccessFormProps) => {
  const { addDialoger, closeDialogerById } = useDialoger()
  const { dialog, close } = useDialogContext()
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

  const [hasPrinted, setHasPrinted] = useState(false)

  const { handlePrint, isPrinting } = usePrintPortal()

  const countDown = useCountDown({ from: 5 })

  const handlePrintTicket = async (bookingId: string, dialogId: string) => {
    if (hasPrinted) return
    setHasPrinted(true)
    await handlePrint(PrintType.ALL, { bookingId })
    closeDialogerById(dialogId)

    addDialoger({
      variant: 'dialog',
      content: (
        <KiosPrintSuccessForm
          bookingId={bookingId}
          onConfirm={(bookingId) => handlePrint(PrintType.TICKET, { bookingId })}
          onCancel={async (bookingId, dialogId) => {
            handleClosePaymentSuccess?.()
            closeDialogerById(dialogId)
          }}
        />
      ),
      disableCloseOutside: true,
      hideXIcon: true,
    })
  }

  useUpdateEffect(() => {
    if (countDown === 0 && !hasPrinted) {
      handlePrintTicket(bookingId, dialog.id)
    }
  }, [countDown])

  return (
    <article {...props} role="dialog" className="flex flex-col gap-6 p-2">
      <section className="text-center">
        <h2 className="font-semibold text-xl text-neutral-black leading-8">Thanh toán thành công</h2>
      </section>
      <div className="w-full p-6 flex items-center justify-center rounded-md bg-[#F5F5F5]">
        <Image
          src={paymentSuccessImage}
          alt="Thanh toán"
          width={0}
          height={0}
          className="w-[auto] h-[120px] object-cover"
        />
      </div>
      <section className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            handleClosePaymentSuccess?.()
            logAction('Nhấn nút đóng tự động in vé')
            handleFinishOrder()
            close()
          }}
          type="button"
        >
          {closeLabel}
        </Button>
        <Button
          size="lg"
          onClick={() => {
            handlePrintTicket(bookingId, dialog.id)
            logAction('Nhấn nút in vé tự động')
          }}
          disabled={hasPrinted}
          type="submit"
          autoFocus
          loading={isPrinting}
        >
          In vé ({countDown})
        </Button>
      </section>
    </article>
  )
}

export default KiosPaymentSuccessForm
