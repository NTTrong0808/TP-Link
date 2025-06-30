import { Button } from '@/components/ui/button'
import { useDialogContext, useDialoger } from '@/components/widgets/dialoger'
import { ComponentProps } from 'react'

export interface KiosDeleteOrderProps extends ComponentProps<'article'> {
  onConfirm?: (dialogId: string) => void
  onCancel?: (dialogId: string) => void
  handleCloseCurrentOrder?: () => void
}

const KiosDeleteOrder = ({ onConfirm, onCancel, ...props }: KiosDeleteOrderProps) => {
  const { addDialoger, closeDialogerById } = useDialoger()
  const { dialog, close } = useDialogContext()

  return (
    <article {...props} role="dialog" className="flex flex-col gap-6 p-2">
      <section className="text-center">
        <h2 className="font-semibold text-xl text-neutral-black leading-8 text-pretty">
          Bạn có chắc chắn muốn đóng phiên giao dịch này?
        </h2>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            onCancel?.(dialog.id)
            close()
          }}
        >
          Quay lại
        </Button>
        <Button
          size="lg"
          onClick={() => {
            onConfirm?.(dialog.id)

            close()
          }}
        >
          Xác nhận
        </Button>
      </section>
    </article>
  )
}

export default KiosDeleteOrder
