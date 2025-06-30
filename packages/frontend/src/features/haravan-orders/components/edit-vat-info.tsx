import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { taxCodeRegex } from '@/constants/regex'
import { getHaravanOrderDetailKey } from '@/lib/api/queries/haravan-orders/get-order-detail'
import { useUpdateOrderVatInfo } from '@/lib/api/queries/haravan-orders/update-order-vat-info'
import { vietQRService } from '@/lib/api/queries/viet-qr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { ComponentProps, PropsWithChildren, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useDebounce, useUpdateEffect } from 'react-use'
import {
  CompanyVatInfo,
  CustomerVatInfo,
  VAT_INFO_FIELDS,
  VAT_TYPE,
  VAT_TYPE_LABEL,
  vatInfoSchema,
} from '../schemas/vat-info-schema'

const vatTypeOptions = Object.keys(VAT_TYPE_LABEL).map((key) => ({
  label: VAT_TYPE_LABEL[key as keyof typeof VAT_TYPE_LABEL],
  value: key,
}))

export interface EditVatInfoProps {
  orderId: string
  defaultValues?: (Partial<CompanyVatInfo> | Partial<CustomerVatInfo>) & { taxCode?: string }
}

const EditVatInfo = ({ defaultValues, orderId }: EditVatInfoProps) => {
  const { close } = useDialogContext()

  const ql = useQueryClient()

  const form = useForm({
    resolver: zodResolver(vatInfoSchema),
    defaultValues: {
      type: VAT_TYPE.COMPANY,
      ...defaultValues,
    },
  })

  const { mutate: updateOrderVatInfo, isPending: isUpdatingOrderVatInfo } = useUpdateOrderVatInfo({
    onSuccess: () => {
      ql.refetchQueries({ queryKey: [getHaravanOrderDetailKey] })
      close()
      toastSuccess('Cập nhật thông tin xuất VAT thành công')
    },
    onError: (error) => {
      toastError(error)
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    if (!orderId) return toastError('ID đơn hàng không hợp lệ')
    updateOrderVatInfo({
      id: orderId,
      vatData: {
        taxCode: data?.taxCode,
        ...(data?.type === VAT_TYPE.COMPANY
          ? {
              legalName: data?.vatInfo?.legalName,
              address: data?.vatInfo?.address,
              receiverEmail: data?.vatInfo?.receiverEmail,
              note: data?.vatInfo?.note,
            }
          : {}),
      },
    })
  })

  const vatRef = useRef<HTMLInputElement>(null)
  const [isLoadingVAT, setIsLoadingVAT] = useState<boolean>(false)
  const [isFetchedVAT, setIsFetchedVAT] = useState<boolean>(Boolean(defaultValues?.taxCode))

  const [type, taxCode] = useWatch({
    control: form.control,
    name: [
      VAT_INFO_FIELDS.TYPE,
      VAT_INFO_FIELDS.TAX_CODE,
      VAT_INFO_FIELDS.COMPANY.LEGAL_NAME,
      VAT_INFO_FIELDS.COMPANY.ADDRESS,
      VAT_INFO_FIELDS.CUSTOMER.NAME,
      VAT_INFO_FIELDS.CUSTOMER.IC_NUMBER,
    ],
  })

  const disabled = useMemo(
    () =>
      // !requireVat ||
      isLoadingVAT || !isFetchedVAT || !taxCodeRegex.test(taxCode),
    [isLoadingVAT, isFetchedVAT, taxCode],
  )

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
      form.setValue(VAT_INFO_FIELDS.COMPANY.LEGAL_NAME, dataRes?.data?.data?.name)
      form.setValue(VAT_INFO_FIELDS.COMPANY.ADDRESS, dataRes?.data?.data?.address)
      setIsFetchedVAT(true)
    } catch (error) {
      toastError('Có lỗi xảy ra, vui lòng kiểm tra lại mã số thuế')
    } finally {
      setIsLoadingVAT(false)
    }
  }

  const formFields = useMemo(() => {
    const field = {
      [VAT_TYPE.PERSONAL]: [
        {
          label: 'Tên khách hàng',
          component: 'text',
          name: VAT_INFO_FIELDS.CUSTOMER.NAME,
          placeholder: 'Nhập tên khách hàng',
        },
        {
          label: 'Số CCCD',
          component: 'text',
          name: VAT_INFO_FIELDS.CUSTOMER.IC_NUMBER,
          placeholder: 'Nhập số CCCD',
        },
        {
          label: 'Địa chỉ (Tùy chọn)',
          component: 'text',
          name: VAT_INFO_FIELDS.CUSTOMER.ADDRESS,
          placeholder: 'Nhập địa chỉ',
        },
        {
          label: 'Điện thoại di động (Tùy chọn)',
          component: 'text',
          name: VAT_INFO_FIELDS.CUSTOMER.PHONE,
          placeholder: 'Nhập số điện thoại di động',
        },
        {
          label: 'Email liên hệ (Tùy chọn)',
          component: 'text',
          name: VAT_INFO_FIELDS.CUSTOMER.EMAIL,
          placeholder: 'Nhập email liên hệ',
        },
        {
          label: 'Ghi chú',
          component: 'text',
          name: VAT_INFO_FIELDS.CUSTOMER.NOTE,
          placeholder: 'Nhập ghi chú',
        },
      ],
      [VAT_TYPE.COMPANY]: [
        {
          label: 'Tên công ty',
          component: 'text',
          name: VAT_INFO_FIELDS.COMPANY.LEGAL_NAME,
          placeholder: 'Nhập tên công ty',
          disabled: disabled,
        },
        {
          label: 'Địa chỉ',
          component: 'text',
          name: VAT_INFO_FIELDS.COMPANY.ADDRESS,
          placeholder: 'Nhập địa chỉ',
          disabled: disabled,
        },
        {
          label: 'Email liên hệ',
          component: 'text',
          name: VAT_INFO_FIELDS.COMPANY.RECEIVER_EMAIL,
          placeholder: 'Nhập email liên hệ',
          disabled: disabled,
        },
        {
          label: 'Ghi chú',
          component: 'textarea',
          name: VAT_INFO_FIELDS.COMPANY.NOTE,
          placeholder: 'Nhập ghi chú',
          rows: 2,
        },
      ],
    }
    return field[type as keyof typeof field] as ComponentProps<typeof Field>[]
  }, [type, disabled])

  useUpdateEffect(() => {
    Object.values(VAT_INFO_FIELDS)?.forEach((field) => {
      if (field === VAT_INFO_FIELDS.TYPE) return
      if (typeof field === 'object') {
        Object.values(field).forEach((value) => {
          form.resetField(value)
          form.setValue(value, '')
        })
      }
    })
  }, [type])

  useDebounce(
    () => {
      if (!taxCode || !taxCodeRegex.test(taxCode)) {
        form.setValue(VAT_INFO_FIELDS.COMPANY.LEGAL_NAME, '')
        form.setValue(VAT_INFO_FIELDS.COMPANY.ADDRESS, '')
        form.setValue(VAT_INFO_FIELDS.COMPANY.RECEIVER_EMAIL, '')
      }
    },
    300,
    [taxCode],
  )

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <VatInfoFormSection title="Thông tin xuất hóa đơn">
          <Field
            label="Đối tượng"
            name={VAT_INFO_FIELDS.TYPE}
            component="select"
            options={vatTypeOptions}
            placeholder="Chọn đối tượng"
            disabled
            value={VAT_TYPE.COMPANY}
            allowClear={false}
          />
          {type === VAT_TYPE.COMPANY && (
            <div className="flex items-end gap-4">
              <Field
                label="Mã số thuế"
                component="text"
                name={VAT_INFO_FIELDS.TAX_CODE}
                placeholder="Nhập mã số thuế"
                disabled={isLoadingVAT}
                ref={vatRef}
              />
              <Button type="button" variant="primary" onClick={handleGetVATInfo} isLoading={isLoadingVAT}>
                Lấy thông tin
              </Button>
            </div>
          )}
        </VatInfoFormSection>

        <VatInfoFormSection title="Thông tin chi tiết">
          {formFields?.map((field) => (
            <Field key={field.name} {...field} />
          ))}
        </VatInfoFormSection>

        <div className="flex justify-between gap-3">
          <Button variant="outline" onClick={close} className="flex-1" loading={isUpdatingOrderVatInfo}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" className="flex-1" loading={isUpdatingOrderVatInfo}>
            Lưu
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

interface VatInfoFormSectionProps extends PropsWithChildren {
  title?: string
}

const VatInfoFormSection = ({ children, title }: VatInfoFormSectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      {title && <div className="text-xs font-semibold text-neutral-grey-400 bg-neutral-grey-50 px-2 py-1">{title}</div>}
      {children}
    </div>
  )
}

export default EditVatInfo
