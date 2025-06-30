'use client'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import ArrowLeftIcon from '@/components/widgets/icons/arrow-left-icon'
import DinosaurSuccessImage from '@/components/widgets/icons/dinosaur-success-image'
import { toastError } from '@/components/widgets/toast'
import { URLS } from '@/constants/urls'
import { phoneFromE164ToLocal } from '@/helper'
import { useAuth } from '@/lib/auth/context'
import { cn } from '@/lib/tw'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

export const schema = z.object({
  email: z.string().min(1, { message: 'Vui lòng nhập email' }).email({ message: 'Email không hợp lệ' }),
  phone: z.string().min(1, { message: 'Vui lòng nhập mã nhân viên' }),
})

export default function ForgotPassword() {
  const { state, forgotPassword } = useAuth()
  const router = useRouter()
  const [isSuccess, setIsSuccess] = useState(false)
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      phone: '',
    },
  })

  const handleSubmit = methods.handleSubmit((values) => {
    forgotPassword({
      email: values.email,
      phone: phoneFromE164ToLocal(values.phone),
    })
      .then(() => {
        setIsSuccess(true)
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'Gửi yêu cầu lấy lại mật khẩu thất bại! Vui lòng thử lại sau.'
        methods.setError('phone', {
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
        <h2 className="title-sm">Thông tin chính xác</h2>
        <div className="text-sm text-neutral-grey-400">
          Một email kèm hướng dẫn đã được gửi tới email <b className="text-black">{methods.getValues('email')}</b>. Vui
          lòng kiểm tra hộp thư
        </div>
      </div>
      <Button variant="default" size="xl" onClick={() => router.replace(URLS.AUTH.SIGN_IN)}>
        Về màn hình đăng nhập
      </Button>
    </div>
  ) : (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className={cn('flex flex-col gap-6 transition-all duration-300 ease-out')}>
        <Link
          href={URLS.AUTH.SIGN_IN}
          replace
          className="w-fit inline-flex items-center gap-2 text-sm font-medium cursor-pointer text-neutral-grey-400 h-8"
        >
          <ArrowLeftIcon className="!size-6" />
          <div className="text-sm text-black">Quay lại</div>
        </Link>

        <div>
          <h2 className="title-sm">Quên mật khẩu</h2>
          <p className="text-sm text-neutral-grey-400">Vui lòng nhập email và số điện thoại để tiếp tục</p>
        </div>

        <div className="flex flex-col gap-4">
          <Field
            size="lg"
            label="Email"
            component="text"
            type="email"
            name="email"
            placeholder="Nhập email"
            disabled={isPending}
          />
          <Field
            size="lg"
            label="Mã nhân viên"
            component="text"
            type="tel"
            name="phone"
            placeholder="Nhập mã nhân viên"
            disabled={isPending}
          />
        </div>

        <Button type="submit" variant="default" size="xl" className="mt-4" disabled={isPending}>
          {isPending ? 'Đang xử lý...' : 'Xác nhận'}
        </Button>
      </form>
    </FormProvider>
  )
}
