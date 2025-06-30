import { Button } from '@/components/ui/button'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useDeleteUser } from '@/lib/api/queries/user/delete-user'

export interface DeleteUserFormProps {
  onCompleted?: () => void
  onError?: (error: any) => void
  userId: string
  userName: string
}

const DeleteUserForm = ({ onCompleted, onError, userId, userName }: DeleteUserFormProps) => {
  const { close } = useDialogContext()

  const { mutate: deleteUser, isPending } = useDeleteUser({
    onSuccess() {
      toastSuccess('Xóa người dùng thành công')
      close()
      onCompleted?.()
    },
    onError(error) {
      toastError(error.response?.data.message || 'Xóa người dùng thất bại')
      onError?.(error)
    },
  })

  const handleSubmit = () => {
    deleteUser({
      userId,
    })
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <p className="col-span-2 w-full">
        Bạn có chắc rằng muốn xóa người dùng <b>{userName}</b> không?
      </p>
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
          {isPending ? 'Đang lưu...' : 'Xóa người dùng'}
        </Button>
      </div>
    </div>
  )
}

export default DeleteUserForm
