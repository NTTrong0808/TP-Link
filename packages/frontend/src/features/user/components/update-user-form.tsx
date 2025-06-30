/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button } from '@/components/ui/button'
import { ComboboxOption } from '@/components/ui/combobox'
import { Field } from '@/components/ui/form'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useRoles } from '@/lib/api/queries/role/get-roles'
import { useUser } from '@/lib/api/queries/user/get-user'
import { useUpdateUser } from '@/lib/api/queries/user/update-user'
import { REGEX } from '@/utils/regexes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

export const schema = z.object({
  fullName: z
    .string()
    .min(1, { message: 'Tên nhân viên không hợp lệ' })
    .refine((value) => value.trim().split(/\s+/).length >= 2, {
      message: 'Tên nhân viên phải có ít nhất 2 từ',
    }),
  roleId: z.string().min(1, { message: 'Vai trò không hợp lệ' }),
  phoneNumber: z
    .string()
    .min(1, { message: 'Số điện thoại không hợp lệ' })
    .regex(new RegExp(`(${REGEX.PHONE_NUMBER_VN.source}|${REGEX.LANDLINE_PHONE_NUMBER_VN.source})`), {
      message: 'Số điện thoại không hợp lệ',
    }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
})

export interface UpdateUserFormProps {
  onCompleted?: () => void
  onError?: (error: any) => void
  userId: string
}

const UpdateUserForm = ({ onCompleted, onError, userId }: UpdateUserFormProps) => {
  const { close } = useDialogContext()
  const { data: user, isLoading: isLoadingUser } = useUser({
    variables: {
      userId,
    },
  })

  const { data: roles } = useRoles()

  const { mutate: updateUser, isPending } = useUpdateUser({
    onSuccess() {
      toastSuccess('Chỉnh sửa tài khoản thành công')
      close()
      onCompleted?.()
    },
    onError(error) {
      toastError(error.response?.data.message || 'Chỉnh sửa tài khoản thất bại')
      onError?.(error)
    },
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      fullName: '',
      roleId: '',
      phoneNumber: '',
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    const fullNameWords = data.fullName.split(' ')

    updateUser({
      userId,
      data: {
        firstName: fullNameWords[fullNameWords.length - 1],
        lastName: fullNameWords.slice(0, fullNameWords.length - 1).join(' '),
        roleId: data.roleId,
      },
    })
  })

  const roleOptions: ComboboxOption[] =
    roles?.data?.map((role) => ({
      label: role.name,
      value: role._id,
    })) || []

  useEffect(() => {
    if (!user?.data) return
    form.setValue('email', user?.data?.email)
    form.setValue('fullName', `${user?.data?.lastName} ${user?.data?.firstName}`)
    form.setValue('roleId', user?.data?.roleId!)
    form.setValue('phoneNumber', user?.data?.phoneNumber ?? user?.data?.username)
  }, [user])
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <Field
          className="col-span-2"
          component="text"
          name="fullName"
          label="Tên nhân viên"
          placeholder="Nhập tên nhân viên"
          disabled={isPending || isLoadingUser}
        />

        <Field
          className="col-span-2"
          component="select"
          name="roleId"
          label="Vai trò"
          placeholder="Chọn vai trò"
          options={roleOptions}
          disabled={isPending || isLoadingUser}
        />
        <Field
          className="col-span-2"
          component="text"
          name="phoneNumber"
          label="Điện thoại di động"
          placeholder="Nhập số điện thoại di động"
          disabled={true}
        />
        <Field
          className="col-span-2"
          component="text"
          name="email"
          label="Email liên hệ"
          placeholder="Nhập email liên hệ"
          disabled={true}
        />

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

export default UpdateUserForm
