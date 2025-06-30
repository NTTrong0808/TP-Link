import { Button } from '@/components/ui/button'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useDeletePos } from '@/lib/api/queries/pos-terminal/delete-pos'

export interface ConfirmDeletePosProps {
  onCompleted?: () => void
  onError?: (error: any) => void
  posId: string
}

const ConfirmDeletePos = ({ onCompleted, onError, posId }: ConfirmDeletePosProps) => {
  const { close } = useDialogContext()

  const { mutate: deletePos, isPending } = useDeletePos({
    onSuccess() {
      toastSuccess('Xóa POS thành công')
      close()
      onCompleted?.()
    },
    onError(error) {
      toastError('Xóa POS thất bại')
      onError?.(error)
    },
  })

  const handleSubmit = () => {
    deletePos({ posId })
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <p className="col-span-2 w-full">Bạn có chắc chắn muốn xóa POS này? Thao tác này không thể hoàn tác.</p>
      <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
        <Button type="button" variant="outline" className="col-span-1" size="lg" disabled={isPending} onClick={close}>
          Huỷ
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="col-span-1"
          size="lg"
          disabled={isPending}
          variant="destructive"
        >
          {isPending ? 'Đang xóa...' : 'Xóa'}
        </Button>
      </div>
    </div>
  )
}

export default ConfirmDeletePos
