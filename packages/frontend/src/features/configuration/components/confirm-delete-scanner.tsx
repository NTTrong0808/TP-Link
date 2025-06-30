import { Button } from '@/components/ui/button'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useDeleteScanner } from '@/lib/api/queries/scanner-terminal/delete-scanner'

export interface ConfirmDeleteScannerProps {
  onCompleted?: () => void
  onError?: (error: any) => void
  scannerId: string
}

const ConfirmDeleteScanner = ({ onCompleted, onError, scannerId }: ConfirmDeleteScannerProps) => {
  const { close } = useDialogContext()

  const { mutate: deleteScanner, isPending } = useDeleteScanner({
    onSuccess() {
      toastSuccess('Xóa Scanner thành công')
      close()
      onCompleted?.()
    },
    onError(error) {
      toastError('Xóa Scanner thất bại')
      onError?.(error)
    },
  })

  const handleSubmit = () => {
    deleteScanner({ scannerId })
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <p className="col-span-2 w-full">Bạn có chắc chắn muốn xóa Scanner này? Thao tác này không thể hoàn tác.</p>
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

export default ConfirmDeleteScanner
