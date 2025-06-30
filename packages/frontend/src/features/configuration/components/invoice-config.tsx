import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import Loader from '@/components/ui/loader'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useSystemConfig } from '@/lib/api/queries/system-config/get-system-config'
import { SystemConfig, systemConfigSchema } from '@/lib/api/queries/system-config/schema'
import { useUpdateSystemConfigMutation } from '@/lib/api/queries/system-config/update-system-config'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { useBoolean, useUpdateEffect } from 'react-use'
import { ConfigurationContent, ConfigurationItemGroup, ConfigurationSection } from './configuration'

const InvoiceConfig = () => {
  const [autoIssuedInvoice, setAutoIssuedInvoice] = useBoolean(false)
  const canAccess = useCanAccess()

  const isCanViewInvoiceConfig = canAccess(CASL_ACCESS_KEY.TICKET_ISSUE_INVOICE_CONFIG_VIEW)
  const isCanUpdateInvoiceConfig = canAccess(CASL_ACCESS_KEY.TICKET_ISSUE_INVOICE_CONFIG_UPDATE)

  const {
    data: systemConfig,
    isFetching: isFetchingSystemConfig,
    refetch,
  } = useSystemConfig({
    select: (data) => {
      return data.data
    },
    enabled: isCanViewInvoiceConfig,
  })

  const { mutate: updateSystemConfig, isPending: isUpdatingSystemConfig } = useUpdateSystemConfigMutation({
    onSuccess: () => {
      toastSuccess('Cập nhật thành công')
      refetch()
    },
    onError: () => {
      toastError('Cập nhật thất bại')
    },
  })

  const form = useForm<SystemConfig>({
    resolver: zodResolver(systemConfigSchema),
    defaultValues: {
      ...systemConfig,
      autoIssuedInvoiceTimeType: 'minute',
    },
  })

  useUpdateEffect(() => {
    if (systemConfig) {
      setAutoIssuedInvoice(systemConfig?.autoIssuedInvoice ?? false)
      form.setValue('autoIssuedInvoiceTime', systemConfig?.autoIssuedInvoiceTime)
      form.setValue('autoIssuedInvoice', systemConfig?.autoIssuedInvoice)
      form.setValue('autoIssuedInvoiceTimeType', systemConfig?.autoIssuedInvoiceTimeType)
    }
  }, [isFetchingSystemConfig])

  const onSubmit = form.handleSubmit((formData) => {
    const data: SystemConfig = {
      ...formData,
      autoIssuedInvoice,
      autoIssuedInvoiceTime: Number(formData.autoIssuedInvoiceTime) || 0,
      autoIssuedInvoiceTimeType: 'minute',
    }

    updateSystemConfig(data)
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <ConfigurationSection>
          {isFetchingSystemConfig ? (
            <Loader loading={isFetchingSystemConfig} />
          ) : (
            <>
              <ConfigurationContent>
                <div className="grid grid-cols-3 gap-5 items-center justify-between text-sm font-medium">
                  <div className="col-span-2">Thời gian xuất hóa đơn sau thanh toán</div>
                  <div>
                    <Field
                      component="text"
                      type="number"
                      name="autoIssuedInvoiceTime"
                      disabled={!isCanUpdateInvoiceConfig}
                      suffix={<span className="text-neutral-grey-400 pr-3">phút</span>}
                    />
                  </div>
                </div>

                <ConfigurationItemGroup
                  title={'Xuất hóa đơn tự động'}
                  description={
                    'Khi bật lại xuất hoá đơn tự động, các đơn hàng chưa có hoá đơn VAT sẽ tự động được xuất hoá đơn.'
                  }
                  className="border-none p-0"
                  defaultChecked={systemConfig?.autoIssuedInvoice}
                  toggleable={isCanUpdateInvoiceConfig}
                  onCheckedChange={(checked) => setAutoIssuedInvoice(checked)}
                />
              </ConfigurationContent>

              <Button
                className="w-full"
                type="submit"
                disabled={!isCanUpdateInvoiceConfig}
                loading={isUpdatingSystemConfig}
              >
                Lưu
              </Button>
            </>
          )}
        </ConfigurationSection>
      </form>
    </FormProvider>
  )
}

export default InvoiceConfig
