import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Field } from '@/components/ui/form'
import EditIcon from '@/components/widgets/icons/edit-icon'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useGetOrders } from '@/lib/api/queries/haravan-orders/get-orders'
import { useUpdateOrder } from '@/lib/api/queries/haravan-orders/update-order'
import { vietQRService } from '@/lib/api/queries/viet-qr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useRef, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useDebounce } from 'react-use'
import { z } from 'zod'

export interface VatFormProps {
  orderId: string
}

const fields = {
  VAT_TAX_CODE: 'taxCode',
  VAT_COMPANY_NAME: 'legalName',
  VAT_ADDRESS: 'address',
  VAT_EMAIL: 'receiverEmail',
  VAT_NOTE: 'note',
} as const
export const schema = z.object({
  taxCode: z.string().min(1, { message: 'Vui lòng nhập MST, nếu không có MST vui lòng nhập 0' }),
  legalName: z.string().min(1, { message: 'Vui lòng nhập tên công ty' }),
  receiverEmail: z.string().min(1, { message: 'Vui lòng nhập email' }).email('Vui lòng nhập đúng định dạng email'),
  address: z.string().min(1, { message: 'Vui lòng nhập địa chỉ' }),
  note: z.string().optional(),
})

const VATForm = ({ orderId }: VatFormProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })
  const queryClient = useQueryClient()
  const { mutate: updateOrder } = useUpdateOrder({
    onSuccess() {
      toastSuccess('Cập nhật VAT thành công')
      queryClient.invalidateQueries({ queryKey: useGetOrders.getKey() })
      setOpen(false)
      form.reset()
    },
    onError() {
      toastError('Cập nhật VAT thất bại')
    },
  })
  const vatRef = useRef<HTMLInputElement>(null)
  const [isLoadingVAT, setIsLoadingVAT] = useState<boolean>(false)

  const [taxCode] = useWatch({
    control: form.control,
    name: [fields.VAT_TAX_CODE],
  })

  const handleGetVATInfo = async () => {
    try {
      setIsLoadingVAT(true)
      if (!taxCode) {
        toastError('Vui lòng nhập mã số thuế')
        return
      }
      const dataRes = await vietQRService.getCompanyInfo({ taxCode: taxCode })
      vatRef?.current?.focus()
      if (!dataRes?.data?.data) return
      form.setValue(fields.VAT_COMPANY_NAME, dataRes?.data?.data?.name)
      form.setValue(fields.VAT_ADDRESS, dataRes?.data?.data?.address)
      console.log('🚀 ~ handleGetVATInfo ~ dataRes:', dataRes)
    } catch (error) {
      toastError('Có lỗi xảy ra, vui lòng kiểm tra lại mã số thuế')
    } finally {
      setIsLoadingVAT(false)
    }
  }

  const formFields = useMemo(() => {
    return [
      {
        label: 'Tên công ty',
        component: 'text',
        name: fields.VAT_COMPANY_NAME,
        placeholder: 'Nhập tên công ty',
      },
      {
        label: 'Địa chỉ',
        component: 'text',
        name: fields.VAT_ADDRESS,
        placeholder: 'Nhập địa chỉ',
      },
      {
        label: 'Email liên hệ',
        component: 'text',
        name: fields.VAT_EMAIL,
        placeholder: 'Nhập email liên hệ',
      },
      {
        label: 'Ghi chú',
        component: 'text',
        name: fields.VAT_NOTE,
        placeholder: 'Nhập ghi chú',
      },
    ]
  }, [])

  useDebounce(
    () => {
      if (!taxCode || taxCode.length === 0) {
        form.setValue(fields.VAT_COMPANY_NAME, '')
        form.setValue(fields.VAT_ADDRESS, '')
        form.setValue(fields.VAT_EMAIL, '')
        form.setValue(fields.VAT_TAX_CODE, '')
      }
    },
    300,
    [taxCode],
  )

  const handleSubmit = form.handleSubmit((values) => {
    updateOrder({
      id: orderId,
      vatData: { ...values, taxCode: values?.taxCode === '0' ? '' : values.taxCode },
    })
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <EditIcon />
      </DialogTrigger>
      <DialogContent>
        <FormProvider {...form}>
          <h2 className="text-lg font-medium">Chỉnh sửa thông tin xuất hóa đơn</h2>
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <div className="flex items-end gap-4">
              <Field
                label="Mã số thuế"
                component="text"
                name={fields.VAT_TAX_CODE}
                placeholder="Nhập mã số thuế"
                ref={vatRef}
              />
              <Button type="button" onClick={handleGetVATInfo} isLoading={isLoadingVAT}>
                Lấy thông tin
              </Button>
            </div>
            {formFields?.map((field) => (
              <Field key={field.name} {...field} component={field.component as any} />
            ))}
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => setOpen(false)} variant="outline" type="button">
                Hủy
              </Button>
              <Button type="submit">Lưu</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default VATForm
