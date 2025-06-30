import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { toastError } from '@/components/widgets/toast'
import { taxCodeRegex } from '@/constants/regex'
import { vietQRService } from '@/lib/api/queries/viet-qr'
import { ComponentProps, useEffect, useMemo, useRef } from 'react'
import { useWatch } from 'react-hook-form'
import { useDebounce, useToggle, useUpdateEffect } from 'react-use'
import { useFormContext } from '../hooks/use-form-context'
import { KIOS_TYPE, KIOS_TYPE_LABEL } from '../schemas/kios-form-schema'
import { useKiosContext } from './kios-context'
import KiosDialog from './kios-dialog'
import KiosInputFormSection from './kios-input-form-section'

export interface KiosVatFormProps {}

const formTypeOptions = Object.keys(KIOS_TYPE_LABEL).map((key) => ({
  label: KIOS_TYPE_LABEL[key as keyof typeof KIOS_TYPE_LABEL],
  value: key,
}))

const fields = {
  TYPE: 'type',
  VAT_TAX_CODE: 'vat.taxCode',
  VAT_COMPANY_NAME: 'vat.companyName',
  VAT_ADDRESS: 'vat.address',
  VAT_EMAIL: 'vat.email',
  VAT_NOTE: 'vat.note',
  CUSTOMER_NAME: 'customer.name',
  CUSTOMER_IC_NUMBER: 'customer.icNumber',
  CUSTOMER_ADDRESS: 'customer.address',
  CUSTOMER_PHONE: 'customer.phone',
  CUSTOMER_EMAIL: 'customer.email',
  TA: 'ta',
  REQUIRE_VAT: 'requireVat',
} as const

const KiosVatForm = (props: KiosVatFormProps) => {
  const form = useFormContext()

  const { customers } = useKiosContext()
  const vatRef = useRef<HTMLInputElement>(null)
  const [isLoadingVAT, setIsLoadingVAT] = useToggle(false)
  const [isSearchSuccess, toggleSearchSuccess] = useToggle(false)

  const [wType, wTaxCode, wCompanyName, wVatAddress, wCustomerName, wCustomerIcNumber, wTa, wRequireVat] = useWatch({
    control: form.control,
    name: [
      fields.TYPE,
      fields.VAT_TAX_CODE,
      fields.VAT_COMPANY_NAME,
      fields.VAT_ADDRESS,
      fields.CUSTOMER_NAME,
      fields.CUSTOMER_IC_NUMBER,
      fields.TA,
      fields.REQUIRE_VAT,
    ],
  })

  const isInputTaxCode = wTaxCode && wTaxCode?.length > 0 && taxCodeRegex.test(wTaxCode)

  const isZeroTaxCode = wTaxCode === '0'

  const isDisableInput = !(isInputTaxCode && (isZeroTaxCode || isSearchSuccess))

  const isEnableSearch = isInputTaxCode && !isZeroTaxCode

  const handleGetVATInfo = async () => {
    if (!isEnableSearch) return

    try {
      setIsLoadingVAT(true)
      if (!wTaxCode) {
        toastError('Vui lòng nhập mã số thuế')
        return
      }
      const dataRes = await vietQRService.getCompanyInfo({ taxCode: wTaxCode })
      vatRef?.current?.focus()
      if (!dataRes?.data?.data) {
        toastError('Mã số thuế không hợp lệ, vui lòng kiểm tra lại')
        toggleSearchSuccess(false)
        return
      }
      form.setValue(fields.VAT_COMPANY_NAME, dataRes?.data?.data?.name)
      form.setValue(fields.VAT_ADDRESS, dataRes?.data?.data?.address)
      toggleSearchSuccess(true)
    } catch (error) {
      toastError('Có lỗi xảy ra, vui lòng kiểm tra lại mã số thuế')
    } finally {
      setIsLoadingVAT(false)
    }
  }

  useEffect(() => {
    const customer = customers?.find((customer) => customer?._id === wTa)
    if (!wTa || !customer) {
      // form.setValue('requireVat', false)
      form.setValue(fields.VAT_COMPANY_NAME, '')
      form.setValue(fields.VAT_ADDRESS, '')
      form.setValue(fields.VAT_EMAIL, '')
      form.setValue(fields.VAT_TAX_CODE, '')
      return
    }
    toggleSearchSuccess(true)

    form.setValue(fields.VAT_COMPANY_NAME, customer?.companyName || '')
    form.setValue(fields.VAT_ADDRESS, customer?.address || '')
    form.setValue(fields.VAT_EMAIL, customer?.email || '')
    form.setValue(fields.VAT_TAX_CODE, customer?.taxCode || '')
  }, [wTa])

  const formFields = useMemo(() => {
    const field = {
      [KIOS_TYPE.PERSONAL]: [
        {
          label: 'Tên khách hàng',
          component: 'text',
          name: fields.CUSTOMER_NAME,
          placeholder: 'Nhập tên khách hàng',
        },
        {
          label: 'Số CCCD',
          component: 'text',
          name: fields.CUSTOMER_IC_NUMBER,
          placeholder: 'Nhập số CCCD',
        },
        {
          label: 'Địa chỉ (Tùy chọn)',
          component: 'text',
          name: fields.CUSTOMER_ADDRESS,
          placeholder: 'Nhập địa chỉ',
        },
        {
          label: 'Điện thoại di động (Tùy chọn)',
          component: 'text',
          name: fields.CUSTOMER_PHONE,
          placeholder: 'Nhập số điện thoại di động',
        },
        {
          label: 'Email liên hệ (Tùy chọn)',
          component: 'text',
          name: fields.CUSTOMER_EMAIL,
          placeholder: 'Nhập email liên hệ',
        },
        {
          label: 'Ghi chú',
          component: 'text',
          name: fields.VAT_NOTE,
          placeholder: 'Nhập ghi chú',
        },
      ],
      [KIOS_TYPE.COMPANY]: [
        {
          label: 'Tên công ty',
          component: 'text',
          name: fields.VAT_COMPANY_NAME,
          placeholder: 'Nhập tên công ty',
          disabled: isDisableInput || (wTa !== undefined && wTa !== ''),
        },
        {
          label: 'Địa chỉ',
          component: 'text',
          name: fields.VAT_ADDRESS,
          placeholder: 'Nhập địa chỉ',
          disabled: isDisableInput || (wTa !== undefined && wTa !== ''),
        },
        {
          label: 'Email liên hệ',
          component: 'text',
          name: fields.VAT_EMAIL,
          placeholder: 'Nhập email liên hệ',
          disabled: isDisableInput || (wTa !== undefined && wTa !== ''),
        },
        {
          label: 'Ghi chú',
          component: 'text',
          name: fields.VAT_NOTE,
          placeholder: 'Nhập ghi chú',
        },
      ],
    }
    return field[wType as keyof typeof field] as ComponentProps<typeof Field>[]
  }, [wType, isDisableInput, wTa])

  useUpdateEffect(() => {
    Object.values(fields)?.forEach((field) => {
      if (field === fields.TYPE || field === fields.REQUIRE_VAT) return

      form.resetField(field)
      form.setValue(field, '')
    })
  }, [wType])

  useUpdateEffect(() => {
    if (wCustomerName || wCustomerIcNumber || wTaxCode || isZeroTaxCode || wCompanyName || wVatAddress) {
      form.setValue('requireVat', true)
    } else if ((!wCustomerName && !wCustomerIcNumber) || (!wTaxCode && !wCompanyName && !wVatAddress)) {
      form.setValue('requireVat', false)
    }
  }, [wCustomerName, wCustomerIcNumber, wTaxCode, wCompanyName, wVatAddress])

  useDebounce(
    () => {
      if (isSearchSuccess) {
        toggleSearchSuccess(false)
      }

      if (!wTaxCode || wTaxCode.length === 0) {
        form.setValue(fields.VAT_TAX_CODE, '')
        form.setValue(fields.VAT_EMAIL, '')
        form.setValue(fields.VAT_COMPANY_NAME, '')
        form.setValue(fields.VAT_ADDRESS, '')
      }

      if (!wTa) {
        form.setValue(fields.VAT_EMAIL, '')
        form.setValue(fields.VAT_COMPANY_NAME, '')
        form.setValue(fields.VAT_ADDRESS, '')
      }
    },
    300,
    [wTaxCode],
  )

  return (
    <KiosDialog
      dialogTriggerLabel="Xuất hóa đơn GTGT"
      buttonLabel="Thông tin hoá đơn GTGT"
      dialogTitle="Thông tin hoá đơn"
      buttonVariant="outline"
      buttonClassName="flex-1"
      // disableSaveButton={!((customerName && customerIcNumber) || (taxCode && companyName && vatAddress))}
      fields={Object.values(fields)}
    >
      <KiosInputFormSection title="Thông tin xuất hóa đơn">
        <Field
          label="Đối tượng"
          component="select"
          name={fields.TYPE}
          placeholder="Lựa chọn đối tượng"
          options={formTypeOptions}
          value={wType}
          allowClear={false}
          disabled
        />
        {wType === KIOS_TYPE.COMPANY && (
          <div className="flex items-end gap-4">
            <Field
              label="Mã số thuế"
              component="text"
              name={fields.VAT_TAX_CODE}
              placeholder="Nhập mã số thuế"
              disabled={isLoadingVAT || (wTa !== undefined && wTa !== '')}
              ref={vatRef}
              addonAfter={
                <Button
                  type="button"
                  onClick={handleGetVATInfo}
                  isLoading={isLoadingVAT}
                  disabled={Boolean(wTa) || !isEnableSearch}
                >
                  Lấy thông tin
                </Button>
              }
            />
          </div>
        )}
      </KiosInputFormSection>
      <KiosInputFormSection title="Thông tin chi tiết">
        {formFields?.map((field) => (
          <Field key={field.name} {...field} />
        ))}
      </KiosInputFormSection>
    </KiosDialog>
  )
}

export default KiosVatForm
