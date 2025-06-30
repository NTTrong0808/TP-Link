import { Button } from '@/components/ui/button'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useMergeUser } from '@/lib/api/queries/user/merge-user'

export interface ConfirmMergeUserFormProps {
  onCompleted?: () => void
  onError?: (error: any) => void
  userInfo: {
    email: string
    roleId: string
    phoneNumber: string
    fullName: string
  }
}

const ConfirmMergeUserForm = ({ onCompleted, onError, userInfo }: ConfirmMergeUserFormProps) => {
  const { close } = useDialogContext()

  const { mutate: mergeUser, isPending } = useMergeUser({
    onSuccess() {
      toastSuccess('Thêm người dùng thành công')
      close()
      onCompleted?.()
    },
    onError(error) {
      toastError('Thêm người dùng thất bại')
      onError?.(error)
    },
  })

  const handleSubmit = () => {
    const fullNameWords = userInfo.fullName.split(' ')

    mergeUser({
      data: {
        email: userInfo.email,
        firstName: fullNameWords[fullNameWords.length - 1],
        lastName: fullNameWords.slice(0, fullNameWords.length - 1).join(' '),
        roleId: userInfo.roleId,
        phoneNumber: userInfo.phoneNumber,
      },
    })
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <p className="col-span-2 w-full">
        Người dùng đã tồn tại trên hệ thống, bạn có muốn thêm vào danh sách này không?
      </p>
      <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
        <Button type="button" variant="outline" className="col-span-1" size="lg" disabled={isPending} onClick={close}>
          Huỷ
        </Button>
        <Button type="button" onClick={handleSubmit} className="col-span-1" size="lg" disabled={isPending}>
          {isPending ? 'Đang thêm...' : 'Thêm'}
        </Button>
      </div>
    </div>
  )
}

export default ConfirmMergeUserForm
