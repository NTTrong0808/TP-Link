import { Button } from '@/components/ui/button'
import { ComboboxOption } from '@/components/ui/combobox'
import { Field } from '@/components/ui/form'
import { useDialogContext, useDialoger } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useRoles } from '@/lib/api/queries/role/get-roles'
import { useCreateUser } from '@/lib/api/queries/user/create-user'
import { REGEX } from '@/utils/regexes'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import ConfirmMergeUserForm from './confirm-merge-user-form'

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

export interface CreateUserFormProps {
  onCompleted?: () => void
  onError?: (error: any) => void
}

const CreateUserForm = ({ onCompleted, onError }: CreateUserFormProps) => {
  const { close } = useDialogContext()
  const { addDialoger } = useDialoger()

  const { data: roles } = useRoles()

  const { mutateAsync: createUser, isPending } = useCreateUser({
    onSuccess() {},
    onError(error) {
      toastError(error.response?.data.message || 'Tạo tài khoản thất bại')
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

  const handleSubmit = form.handleSubmit(async (data) => {
    const fullNameWords = data.fullName.split(' ')

    const response = await createUser({
      data: {
        email: data.email,
        firstName: fullNameWords[fullNameWords.length - 1],
        lastName: fullNameWords.slice(0, fullNameWords.length - 1).join(' '),
        roleId: data.roleId,
        phoneNumber: data.phoneNumber,
      },
    })

    if (response?.data === 'USER_EXISTED_IN_SYSTEM') {
      handleMerUserDialog(data)
      return
    }
    if (response?.data) {
      toastSuccess('Tạo tài khoản thành công')
      close()
      onCompleted?.()
    }
  })

  const handleMerUserDialog = (userInfo: { email: string; roleId: string; phoneNumber: string; fullName: string }) => {
    addDialoger({
      title: 'Thêm người dùng',
      content: (
        <ConfirmMergeUserForm
          userInfo={userInfo}
          onCompleted={() => {
            close()
            onCompleted?.()
          }}
        />
      ),
      variant: 'dialog',
    })
  }

  const roleOptions: ComboboxOption[] =
    roles?.data?.map((role) => ({
      label: role.name,
      value: role._id,
    })) || []

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <Field
          className="col-span-2"
          component="text"
          name="fullName"
          label="Tên nhân viên"
          placeholder="Nhập tên nhân viên"
          disabled={isPending}
        />

        <Field
          className="col-span-2"
          component="select"
          name="roleId"
          label="Vai trò"
          placeholder="Chọn vai trò"
          options={roleOptions}
          disabled={isPending}
        />
        <Field
          className="col-span-2"
          component="text"
          name="phoneNumber"
          label="Điện thoại di động"
          placeholder="Nhập số điện thoại di động"
          disabled={isPending}
        />
        <Field
          className="col-span-2"
          component="text"
          name="email"
          label="Email liên hệ"
          placeholder="Nhập email liên hệ"
          disabled={isPending}
        />

        <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
          <Button type="button" variant="outline" className="col-span-1" size="lg" disabled={isPending} onClick={close}>
            Huỷ
          </Button>
          <Button type="submit" className="col-span-1" size="lg" disabled={isPending}>
            {isPending ? 'Đang tạo...' : 'Tạo tài khoản'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default CreateUserForm
