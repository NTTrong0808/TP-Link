'use client'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { URLS } from '@/constants/urls'
import { formatPhoneToE164 } from '@/helper/phone-number'
import { useAuth } from '@/lib/auth/context'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

export const schema = z.object({
  phoneNumber: z.string().min(1, { message: 'Username không được để trống' }).or(z.literal('admin')),
  password: z.string().min(1, { message: 'Mật khẩu không được để trống' }),
})

export default function SignIn() {
  const { state, signIn } = useAuth()

  const router = useRouter()

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      phoneNumber: '',
      password: '',
    },
  })

  const handleSubmit = methods.handleSubmit((values) => {
    signIn({
      username: isNaN(Number(values.phoneNumber)) ? values.phoneNumber : formatPhoneToE164(values.phoneNumber),
      password: values.password,
    })
      .then(() => {
        router.replace(URLS.HOME)
      })
      .catch((err) => {
        console.log(err)
        methods.setError('phoneNumber', {
          message: 'Mã nhân viên không hợp lệ hoặc mật khẩu không chính xác',
        })
      })
  })
  const isPending = state === 'loading'

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h2 className="mb-2 text-center title-sm">Đăng nhập</h2>

        <p className="text-sm font-normal text-neutral-grey-400 mb-6 text-center">
          Vui lòng nhập thông tin đăng nhập để sử dụng hệ thống
        </p>

        <div className="flex flex-col gap-4">
          <Field
            size="lg"
            label="Username"
            component="text"
            name="phoneNumber"
            placeholder="Nhập Username"
            disabled={isPending}
          />

          <Field
            size="lg"
            label="Mật khẩu"
            component="password"
            type="password"
            name="password"
            placeholder="Nhập mật khẩu"
            disabled={isPending}
          />

          <div>
            <Link href={URLS.AUTH.FORGOT_PASSWORD} className="text-sm font-medium text-green-700 inline-block">
              Quên mật khẩu
            </Link>
          </div>
        </div>

        <Button type="submit" variant="default" size="xl" className="mt-6" disabled={isPending}>
          {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>
    </FormProvider>
  )
}
