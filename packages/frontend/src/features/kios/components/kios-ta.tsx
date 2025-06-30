import { Field } from '@/components/ui/form'
import KiosAddCustomer from './kios-add-customer'
import { useKiosContext } from './kios-context'
import { KiosSection } from './kios-section'
import KiosVatCollapsible from './kios-vat-collapsible'
import KiosVatForm from './kios-vat-form'
import { useOrderActionsLogsStore } from '../store/use-order-action-logs'
import { useFormContext } from '../hooks/use-form-context'
import { useEffect } from 'react'

export interface KiosTAProps {}

const KiosTA = (props: KiosTAProps) => {
  const { customers } = useKiosContext()
  const logAction = useOrderActionsLogsStore((s) => s.logAction)
  const form = useFormContext()
  const ta = form.watch('ta')
  useEffect(() => {
    if (ta) {
      logAction('Chọn khách hàng', {
        taId: ta,
        name: customers.find((_) => _._id === ta)?.name,
      })
    }
  }, [ta])
  return (
    <KiosSection title="Thông tin Khách hàng" extra={<KiosVatForm />}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Field
            options={customers.map((ta) => ({
              label: ta.name,
              value: ta._id,
            }))}
            placeholder="Chọn Khách hàng"
            component="select"
            name="ta"
            className="w-full"
          />
          <KiosAddCustomer />
        </div>

        <KiosVatCollapsible />
      </div>
    </KiosSection>
  )
}

export default KiosTA
