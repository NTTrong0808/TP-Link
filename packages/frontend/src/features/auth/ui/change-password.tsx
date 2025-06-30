'use client'

import { Field } from '@/components/ui/form'
import FormContainer from '@/components/ui/form-container'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { passwordRegex } from '@/constants/regex'
import { useAuth } from '@/lib/auth/context'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

export const schema = z
  .object({
    oldPassword: z.string().min(1, { message: 'Vui lòng nhập mật khẩu cũ' }),
    newPassword: z.string().min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' }).regex(passwordRegex, {
      message: 'Mật khẩu phải chứa ít nhất 1 chữ in hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt',
    }),
    confirmPassword: z.string().min(1, { message: 'Vui lòng xác nhận mật khẩu' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'Mật khẩu mới không được trùng với mật khẩu cũ',
    path: ['newPassword'],
  })

export default function ChangePassword() {
  const { state, changePassword, signOut } = useAuth()

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const handleSubmit = methods.handleSubmit((values) => {
    changePassword({
      oldPassword: values.oldPassword,
      newPassword: values.confirmPassword,
    })
      .then(() => {
        toastSuccess('Mật khẩu đã được đặt lại, vui lòng đăng nhập lại để tiếp tục sử dụng dịch vụ')
        signOut()
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'Không thể thay đổi mật khẩu! Vui lòng thử lại sau.'
        methods.setError('confirmPassword', {
          message,
        })
        toastError(message)
      })
  })

  const isPending = state === 'loading'

  return (
    <FormProvider {...methods}>
      <section className="w-full flex justify-center p-6">
        <FormContainer
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          submitText="Xác nhận đổi mật khẩu"
          title="Đổi mật khẩu"
        >
          <div className="flex flex-col gap-4 [&>*>label]:text-xs [&>*>label]:font-medium">
            <Field
              size="lg"
              label="Mật khẩu cũ"
              component="password"
              type="password"
              name="oldPassword"
              placeholder="Nhập mật khẩu cũ"
              disabled={isPending}
            />
            <Field
              size="lg"
              label="Mật khẩu mới"
              component="password"
              name="newPassword"
              placeholder="Nhập mật khẩu mới"
              disabled={isPending}
            />
            <Field
              size="lg"
              label="Xác nhận mật khẩu"
              component="password"
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu mới"
              disabled={isPending}
            />
          </div>
        </FormContainer>
      </section>
    </FormProvider>
  )
}
