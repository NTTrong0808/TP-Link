import { Field } from '@/components/ui/form'
import { PlusIcon } from 'lucide-react'
import { useWatch } from 'react-hook-form'
import { useUpdateEffect } from 'react-use'
import { useFormContext } from '../hooks/use-form-context'
import KiosDialog from './kios-dialog'

export interface KiosAddCustomerProps {}

const fields = {
  CUSTOMER_NAME: 'newCustomer.name',
  CUSTOMER_IC_NUMBER: 'newCustomer.icNumber',
  CUSTOMER_ADDRESS: 'newCustomer.address',
  CUSTOMER_PHONE: 'newCustomer.phone',
  CUSTOMER_EMAIL: 'newCustomer.email',
  REQUIRE_CUSTOMER: 'requireCustomer',
} as const

const KiosAddCustomer = (props: KiosAddCustomerProps) => {
  const form = useFormContext()
  // const { customers } = useKiosContext()

  const [customerName, customerIcNumber] = useWatch({
    control: form.control,
    name: [fields.CUSTOMER_NAME, fields.CUSTOMER_IC_NUMBER],
  })

  useUpdateEffect(() => {
    if (customerName || customerIcNumber) {
      form.setValue(fields.REQUIRE_CUSTOMER, true)
    } else if (!customerName && !customerIcNumber) {
      form.setValue(fields.REQUIRE_CUSTOMER, false)
    }
  }, [customerName, customerIcNumber])

  return (
    <KiosDialog
      buttonLabel={<PlusIcon className="!size-3" />}
      dialogTitle="Thêm khách hàng"
      buttonVariant="outline"
      buttonClassName="border-dashed"
      fields={Object.values(fields)}
      cancelButtonLabel="Rời trang"
      saveButtonLabel="Tạo mới"
      saveButtonProps={{
        disabled: !(customerName && customerIcNumber),
      }}
    >
      <Field component="text" name={fields.CUSTOMER_NAME} placeholder="Nhập tên khách hàng" label="Tên khách hàng" />
      <Field component="text" name={fields.CUSTOMER_IC_NUMBER} placeholder="Nhập Số CCCD" label="Số CCCD" />
      <Field component="text" name={fields.CUSTOMER_ADDRESS} placeholder="Nhập địa chỉ" label="Địa chỉ (tuỳ chọn)" />
      <Field
        component="text"
        name={fields.CUSTOMER_PHONE}
        placeholder="Nhập số điện thoại"
        label="Điện thoại di động (tuỳ chọn)"
      />
      <Field
        component="text"
        name={fields.CUSTOMER_EMAIL}
        placeholder="Nhập email"
        type="email"
        label="Email liên hệ (tuỳ chọn)"
      />
    </KiosDialog>
  )
}

export default KiosAddCustomer
