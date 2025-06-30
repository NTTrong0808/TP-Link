'use client'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import DinosaurSuccessImage from '@/components/widgets/icons/dinosaur-success-image'
import { toastError } from '@/components/widgets/toast'
import { passwordRegex } from '@/constants/regex'
import { URLS } from '@/constants/urls'
import { useAuth } from '@/lib/auth/context'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { useToggle } from 'react-use'
import { z } from 'zod'

export const schema = z
  .object({
    password: z.string().min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' }).regex(passwordRegex, {
      message: 'Mật khẩu phải chứa ít nhất 1 chữ in hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt',
    }),
    confirmPassword: z.string().min(1, { message: 'Vui lòng xác nhận mật khẩu' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

export default function ResetPassword({ token }: { token: string }) {
  const { state, resetPassword } = useAuth()
  const router = useRouter()
  const [isSuccess, toggleIsSuccess] = useToggle(false)
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const handleSubmit = methods.handleSubmit((values) => {
    resetPassword({
      token: token as string,
      password: values.password,
    })
      .then(() => {
        toggleIsSuccess(true)
      })
      .catch((error) => {
        let message = error.response?.data?.message || 'Không thể tạo mật khẩu mới! Vui lòng thử lại sau.'
        if (error.status === 500) {
          message = 'Có lỗi xảy ra. Vui lòng thử lại sau.'
        }
        methods.setError('confirmPassword', {
          message,
        })

        toastError(message)
      })
  })

  const isPending = state === 'loading'

  return isSuccess ? (
    <div className="flex flex-col gap-6 text-center">
      <div className="mx-auto">
        <DinosaurSuccessImage className="w-20" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="title-sm">Tạo mật khẩu mới thành công</h2>
        <div className="text-sm text-neutral-grey-400">
          Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập lại để tiếp tục sử dụng dịch vụ
        </div>
      </div>
      <Button variant="default" size="xl" onClick={() => router.replace(URLS.AUTH.SIGN_IN)}>
        Về màn hình đăng nhập
      </Button>
    </div>
  ) : (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h2 className="mb-6 title-sm">Tạo mật khẩu mới</h2>

        <div className="flex flex-col gap-4 mb-10">
          <Field
            size="lg"
            label="Mật khẩu mới"
            component="password"
            type="password"
            name="password"
            placeholder="Nhập mật khẩu mới"
            disabled={isPending}
          />
          <Field
            size="lg"
            label="Nhập lại mật khẩu mới"
            component="password"
            type="password"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu mới"
            disabled={isPending}
          />
          <div className="flex flex-col gap-1 text-sm text-neutral-black">
            <div className="text-xs font-medium text-neutral-grey-400">Mật khẩu cần bao gồm:</div>
            <div>Ít nhất 8 kí tự</div>
            <div>Kí tự đặc biệt</div>
            <div>Kí tự viết thường và viết hoa</div>
          </div>
        </div>

        <Button type="submit" variant="default" size="xl" disabled={isPending}>
          {isPending ? 'Đang xử lý...' : 'Xác nhận'}
        </Button>
      </form>
    </FormProvider>
  )
}
