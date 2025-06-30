import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { useDialogContext } from '@/components/widgets/dialoger'
import CopyIcon from '@/components/widgets/icons/copy-icon'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useAdminResetPassword } from '@/lib/auth/hooks'
import { REGEX } from '@/utils/regexes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

export const resetPasswordSchema = z.object({
  password: z
    .string({
      required_error: 'Mật khẩu là bắt buộc',
    })
    .regex(REGEX.PASSWORD_LEVEL_4, {
      message: 'Mật khẩu phải có ít nhất 8 kí tự, bao gồm kí tự đặc biệt, viết thường và viết hoa',
    })
    .min(8, { message: 'Mật khẩu phải có ít nhất 8 kí tự' }),
})

export interface ResetPasswordProps {
  userId: string
  userName: string
  onCompleted?: () => void
}

const ResetPassword = ({ userId, userName, onCompleted }: ResetPasswordProps) => {
  const methods = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
    },
  })
  const password = methods.watch('password')
  const { close } = useDialogContext()

  const { mutate: resetPassword, isPending } = useAdminResetPassword({
    onSuccess() {
      close()
      onCompleted?.()
      toastSuccess('Đặt lại mật khẩu thành công')
    },
    onError() {
      const message = 'Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại thông tin và thử lại.'
      methods.setError('password', {
        message,
      })

      toastError(message)
    },
  })

  const handleSubmit = methods.handleSubmit((formValues) => {
    resetPassword({
      userId,
      newPassword: formValues.password,
    })
  })

  const handleCopy = useCallback(() => {
    if (password) {
      navigator.clipboard.writeText(password)
      toastSuccess('Đã sao chép mật khẩu!')
    }
  }, [password])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <p className="mb-4 text-base font-bold text-neutral-grey-600">{userName}</p>

        <Field
          component="text"
          label="Mật khẩu mới"
          name="password"
          placeholder="Nhập mật khẩu mới"
          className="mb-4"
          suffix={
            <div onClick={handleCopy} className=" cursor-pointer">
              <CopyIcon />
            </div>
          }
        />

        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-neutral-grey-400">Mật khẩu cần bao gồm:</p>
          <small className="text-sm font-normal">Ít nhất 8 kí tự</small>
          <small className="text-sm font-normal">Kí tự đặc biệt</small>
          <small className="text-sm font-normal">Kí tự viết thường và viết hoa</small>
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
          <Button type="button" variant="outline" className="col-span-1" size="lg" disabled={isPending} onClick={close}>
            Huỷ
          </Button>
          <Button type="submit" className="col-span-1" size="lg" disabled={isPending}>
            {isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default ResetPassword
