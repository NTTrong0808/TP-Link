import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useCustomer } from '@/lib/api/queries/customer/get-customer'
import { useUpdateCustomer } from '@/lib/api/queries/customer/update-customer'
import { vietQRService } from '@/lib/api/queries/viet-qr'
import { REGEX } from '@/utils/regexes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

export const schema = z.object({
  name: z.string({ message: 'Vui lòng điền tên' }).min(1, { message: 'Họ khách hàng không hợp lệ' }),
  taxCode: z.string({ message: 'Vui lòng điền mã số thuế' }).min(1, { message: 'Mã số thuế không hợp lệ' }),
  companyName: z.string({ message: 'Vui lòng điền tên công ty' }).min(1, { message: 'Vui lòng điền tên công ty' }),
  address: z.string({ message: 'Vui lòng điền địa chỉ' }),
  email: z.string({ message: 'Vui lòng điền email' }).email({ message: 'Email không hợp lệ' }),
  phone: z
    .string({ message: 'Vui lòng điền số điện thoại' })
    .min(1, { message: 'Số điện thoại không hợp lệ' })
    .regex(new RegExp(`(${REGEX.PHONE_NUMBER_VN.source}|${REGEX.LANDLINE_PHONE_NUMBER_VN.source})`), {
      message: 'Số điện thoại không hợp lệ',
    }),
  bankNumber: z.string().optional(),
  bankName: z.string().optional(),
  bankBranch: z.string().optional(),
  contract: z.string().optional(),
})

export interface CreateCustomerFormProps {
  onCompleted?: () => void
  onError?: (error: any) => void
  customerId: string
}

const UpdateCustomerForm = ({ onCompleted, onError, customerId }: CreateCustomerFormProps) => {
  const { dialog, close } = useDialogContext()
  const { data: customer, isLoading: isLoadingCustomer } = useCustomer({
    variables: {
      id: customerId,
    },
  })

  const { mutate: updateCustomer, isPending } = useUpdateCustomer({
    onSuccess() {
      toastSuccess('Cập nhật tài khoản thành công')
      close()
      onCompleted?.()
    },
    onError(error) {
      toastError(error.response?.data.message || 'Cập nhật tài khoản thất bại')
      onError?.(error)
    },
  })

  const isLoading = isLoadingCustomer || isPending

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: customer?.name,
      taxCode: customer?.taxCode,
      companyName: customer?.companyName,
      address: customer?.address,
      email: customer?.email,
      phone: customer?.phone,
      bankBranch: customer?.bankBranch,
      bankName: customer?.bankName,
      bankNumber: customer?.bankNumber,
      contract: customer?.contract,
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    updateCustomer({
      id: customerId,
      dto: data,
    })
  })

  const taxCode = form.watch('taxCode')
  const fetchCompanyInfo = async (taxCode: string) => {
    const company = await vietQRService.getCompanyInfo({
      taxCode,
    })
    if (company?.data?.data) {
      form.setValue('companyName', company?.data?.data?.name)
      form.setValue('address', company?.data?.data?.address)
    }
  }
  useEffect(() => {
    if (!taxCode) return
    fetchCompanyInfo(taxCode)
  }, [taxCode])

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="col-span-2 text-xs font-semibold text-neutral-grey-400 bg-neutral-grey-50 rounded-sm px-2 py-1">
          Thông tin cá nhân
        </div>

        <Field
          className="col-span-1"
          component="text"
          name="name"
          label="Tên TA"
          placeholder="Nhập tên TA"
          disabled={isLoading}
        />

        <Field
          className="col-span-1"
          component="text"
          name="taxCode"
          label="Mã số thuế"
          placeholder="Nhập mã số thuế"
          disabled={isLoading}
        />

        <Field
          className="col-span-2"
          component="text"
          name="companyName"
          label="Tên công ty/tổ chức"
          placeholder="Nhập tên công ty/tổ chức"
          disabled={isLoading}
        />

        <Field
          className="col-span-2"
          component="textarea"
          name="address"
          label="Địa chỉ"
          placeholder="Nhập địa chỉ"
          disabled={isLoading}
        />

        <Field
          className="col-span-1"
          component="text"
          name="phone"
          label="Điện thoại di động"
          placeholder="Nhập số điện thoại di động"
          disabled={isLoading}
        />

        <Field
          className="col-span-1"
          component="text"
          name="email"
          label="Email liên hệ"
          placeholder="Nhập email liên hệ"
          disabled={isLoading}
        />

        <Field
          className="col-span-2"
          component="text"
          name="contract"
          label="Đường dẫn hợp đồng"
          placeholder="Nhập đường dẫn hợp đồng"
          disabled={isLoading}
        />

        <div className="col-span-2 text-xs font-semibold text-neutral-grey-400 bg-neutral-grey-50 rounded-sm px-2 py-1">
          Thông tin thanh toán
        </div>
        <Field
          className="col-span-2"
          component="text"
          name="bankNumber"
          label="Số tài khoản ngân hàng"
          placeholder="Nhập số tài khoản ngân hàng"
          disabled={isLoading}
        />

        <Field
          className="col-span-1"
          component="text"
          name="bankName"
          label="Tên ngân hàng"
          placeholder="Nhập tên ngân hàng"
          disabled={isLoading}
        />
        <Field
          className="col-span-1"
          component="text"
          name="bankBranch"
          label="Chi nhánh"
          placeholder="Nhập chi nhánh ngân hàng"
          disabled={isLoading}
        />

        <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
          <Button type="button" variant="outline" className="col-span-1" size="lg" disabled={isPending} onClick={close}>
            Rời trang
          </Button>
          <Button type="submit" className="col-span-1" size="lg" disabled={isPending} isLoading={isPending}>
            Lưu
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default UpdateCustomerForm
