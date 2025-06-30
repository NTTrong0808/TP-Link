import { Button } from '@/components/ui/button'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { USER_STATUS, UserStatus } from '@/lib/api/queries/user/constant'
import { useUpdateUser } from '@/lib/api/queries/user/update-user'

export interface DisableOrEnableUserFormProps {
  onCompleted?: () => void
  onError?: (error: any) => void
  userId: string
  oldStatus: UserStatus
  userName: string
}

const DisableOrEnableUserForm = ({
  onCompleted,
  onError,
  userId,
  oldStatus,
  userName,
}: DisableOrEnableUserFormProps) => {
  const { close } = useDialogContext()

  const { mutate: updateUser, isPending } = useUpdateUser({
    onSuccess() {
      toastSuccess(
        oldStatus === USER_STATUS.activated ? 'Hủy kích hoạt tài khoản thành công' : 'Kích hoạt tài khoản thành công',
      )
      close()
      onCompleted?.()
    },
    onError(error) {
      toastError(
        error.response?.data.message || oldStatus === USER_STATUS.activated
          ? 'Hủy kích hoạt tài khoản thất bại'
          : 'Kích hoạt tài khoản thất bại',
      )
      onError?.(error)
    },
  })

  const handleSubmit = () => {
    updateUser({
      userId,
      data: {
        status: oldStatus === USER_STATUS.activated ? USER_STATUS.deactivated : USER_STATUS.activated,
      },
    })
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <p className="col-span-2 w-full">
        Bạn có chắc rằng muốn {oldStatus === USER_STATUS.activated ? 'hủy' : ''} kích hoạt người dùng <b>{userName}</b>{' '}
        không?
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
          variant={oldStatus === USER_STATUS.activated ? 'destructive' : 'default'}
          disabled={isPending}
        >
          {isPending ? 'Đang lưu...' : oldStatus === USER_STATUS.activated ? 'Huỷ kích hoạt' : 'Kích hoạt'}
        </Button>
      </div>
    </div>
  )
}

export default DisableOrEnableUserForm
