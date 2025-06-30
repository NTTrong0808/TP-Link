import { CASH_PAYOO_TYPE, PaymentMethodType } from '@/lib/api/queries/payment-method/schema'
import { cn } from '@/lib/tw'
import { Label } from '@radix-ui/react-label'
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from '@radix-ui/react-radio-group'
import { FormControl, FormField } from 'hookform-field'
import { Circle } from 'lucide-react'
import Image from 'next/image'
import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import { useUpdateEffect } from 'react-use'
import { useFormContext } from '../hooks/use-form-context'
import { useKiosContext } from './kios-context'
import KiosNote from './kios-note'
import { KiosSection } from './kios-section'
import { useOrderActionsLogsStore } from '../store/use-order-action-logs'

export interface KiosPaymentProps {}

const KiosPayment = (props: KiosPaymentProps) => {
  const { paymentMethods } = useKiosContext()
  const logAction = useOrderActionsLogsStore((s) => s.logAction)

  const form = useFormContext()

  const [wPaymentMethod, wPaymentNote] = useWatch({
    control: form.control,
    name: ['paymentMethod', 'paymentNote'],
  })

  const isDisabled = useMemo(() => {
    return paymentMethods?.find((method) => method._id === wPaymentMethod)?.payooType === CASH_PAYOO_TYPE
  }, [wPaymentMethod, paymentMethods])

  useUpdateEffect(() => {
    if (isDisabled) {
      form.setValue('paymentNote', '')
    }
  }, [isDisabled])

  return (
    <KiosSection
      title="Phương thức thanh toán"
      extra={
        <KiosNote
          name="paymentNote"
          dialogTriggerLabel={wPaymentNote ? 'nội dung TT' : 'Nội dung thanh toán'}
          dialogTitle="Nội dung thanh toán"
          placeholder="Nhập nội dung thanh toán"
          maxLength={39}
          disabled={isDisabled}
          rows={2}
          extra={
            <div className="text-sm font-normal text-neutral-grey-400">
              {/* <p>{'Vui lòng nhập tối đa 39 ký tự'}</p> */}
              <p>
                {
                  'Vui lòng nhập chữ không dấu và không chứa ký tự đặc biệt như: = ! " $ % & : * < > ; , # { } [ ] \\ ^ | ~ @)'
                }
              </p>
            </div>
          }
        />
      }
    >
      <div className="flex flex-col gap-4">
        <FormField
          name="paymentMethod"
          render={({ field }) => (
            <RadioGroup
              {...field}
              onValueChange={(e) => {
                field.onChange(e)
                logAction('Chọn phương thức thanh toán', {
                  paymentMethodId: e,
                  name: paymentMethods.find((_) => _._id === e)?.name,
                })
              }}
              className="flex flex-row gap-4"
            >
              {paymentMethods?.map((method) => (
                <Label
                  key={method._id}
                  htmlFor={method._id}
                  className={cn(
                    'flex items-center gap-4 px-4 py-6 flex-1 font-normal rounded-lg',
                    'border border-neutral-grey-200',
                    'has-[input:checked]:bg-green-50',
                    'has-[input:checked]:border-2',
                    'has-[input:checked]:border-green-500',
                    'has-[input:checked]:text-green-500',
                    'has-[input:checked]:font-semibold',
                    method.paymentType === PaymentMethodType.POSTPAID && 'hidden',
                  )}
                >
                  <FormControl>
                    <RadioGroupItem
                      id={method._id}
                      value={method._id}
                      className="hidden size-5 data-[state=checked]:border-green-500 border-neutral-grey-200 items-center justify-center bg-transparent border rounded-full shrink-0"
                    >
                      <RadioGroupIndicator className="relative">
                        <Circle className="size-3.5 text-green-500 fill-green-500 border-transparent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </RadioGroupIndicator>
                    </RadioGroupItem>
                  </FormControl>

                  <div className="flex flex-col gap-2 items-center justify-center flex-1 text-center">
                    <div className="items-center gap-2 size-10 rounded-md border border-neutral-grey-200 grid place-items-center bg-white">
                      <Image src={method.logoUrl} alt={method.name} className="size-6" width={100} height={100} />
                    </div>

                    <p>{method.name}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          )}
        />
      </div>
    </KiosSection>
  )
}

export default KiosPayment
