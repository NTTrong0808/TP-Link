import QRBankTranfer from '@/components/qr-bank-transfer'
import { Button } from '@/components/ui/button'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { formatInternationalCurrency } from '@/utils/currency'
import { transformFullServiceName } from '@/utils/tranform-full-service-name'
import { Label } from '@radix-ui/react-label'
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from '@radix-ui/react-radio-group'
import { FormControl, FormField } from 'hookform-field'
import { Circle } from 'lucide-react'
import { Fragment } from 'react'
import { useWatch } from 'react-hook-form'
import { formatCurrency } from '../../../helper/number'
import { useFormContext } from '../hooks/use-form-context'
import { useKiosContext } from './kios-context'
import KiosDialog from './kios-dialog'
import KiosDivider from './kios-divider'
import KiosNote from './kios-note'
import { KiosSection } from './kios-section'

export interface KiosSummaryProps {}

const KiosSummary = (props: KiosSummaryProps) => {
  const form = useFormContext()

  const canAccess = useCanAccess()

  const isCanAccessOfflineCreateBookingPayLater = canAccess(CASL_ACCESS_KEY.TICKET_OFFLINE_CREATE_BOOKING_PAY_LATER)

  const { services, isLoadingCreatingOrder, paymentMethods, postPaidPaymentMethods, refetchPaymentMethods } =
    useKiosContext()

  const [wNoteFormField, wPaymentMethod, wBankAccount, wQuantityFormField] = useWatch({
    control: form.control,
    name: ['note', 'paymentMethod', 'bankAccount', 'quantity'],
  })

  const servicesWithPrice = services.map((service) => {
    const quantity = wQuantityFormField?.[service.priceConfigId] || 0
    const price = quantity * Number(service?.price ?? 0)
    return { ...service, quantity, price }
  })

  const totals = servicesWithPrice.reduce(
    (group, item) => ({
      totalPrice: group.totalPrice + item.price,
      totalQuantity: group.totalQuantity + item.quantity,
    }),
    { totalPrice: 0, totalQuantity: 0 },
  )

  const handleUpdatePaymentMethod = (paymentMethodId?: string) => {
    if (paymentMethodId) {
      form.setValue('paymentMethod', paymentMethodId)
    }
  }

  return (
    <KiosSection
      title="Hoá đơn thanh toán"
      contentProps={{
        className: 'flex flex-col gap-4 h-full flex-1 justify-between overflow-hidden',
      }}
      className="h-full"
      extra={
        <KiosNote
          dialogTriggerLabel={wNoteFormField ? 'ghi chú ĐH' : 'Ghi chú đơn hàng'}
          dialogTitle="Ghi chú nội bộ"
          tooltip="Ghi chú nội bộ"
        />
      }
    >
      <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
        <div className="w-full flex flex-col gap-4 overflow-auto">
          {servicesWithPrice.filter((service) => service.quantity > 0).length === 0 && (
            <p className="text-center w-full font-medium text-neutral-grey-400">Chưa có dịch vụ nào</p>
          )}
          {servicesWithPrice
            .filter((service) => service.quantity > 0)
            .map((service) => {
              return (
                <KiosSummaryItem
                  key={service.priceConfigId}
                  name={transformFullServiceName(service)}
                  quantity={service.quantity}
                  price={service.price}
                />
              )
            })}
        </div>
        <KiosDivider />
        <KiosSummaryItem name="Vé tổng cộng" quantity={totals.totalQuantity} price={totals.totalPrice} />
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {wNoteFormField && (
          <div className="text-sm rounded-xl p-4 bg-neutral-grey-50 flex flex-col gap-2">
            <div className="text-base font-semibold text-neutral-grey-500">Ghi chú</div>
            <div className="text-neutral-grey-400">{wNoteFormField}</div>
          </div>
        )}

        <div className="flex gap-4">
          {isCanAccessOfflineCreateBookingPayLater && (
            <KiosDialog
              dialogTitle="Thông tin chuyển khoản"
              buttonLabel="Thanh toán sau"
              cancelButtonLabel="Đóng"
              buttonClassName="py-8 w-full h-full !text-base"
              saveButtonProps={{
                type: 'submit',
                form: 'kios-form',
                disabled: !wBankAccount,
                loading: isLoadingCreatingOrder,
              }}
              onCancel={() => {
                form.setValue('bankAccount', '')
              }}
              onOpenChange={(open) => {
                if (open) {
                  handleUpdatePaymentMethod(postPaidPaymentMethods?.at(0)?._id)
                  refetchPaymentMethods()
                }
              }}
              disabled={totals.totalQuantity === 0}
              saveButtonLabel="Chờ thanh toán"
            >
              <div className="flex gap-4">
                {postPaidPaymentMethods?.some((method) => method?.bankAccounts && method?.bankAccounts?.length > 0) ? (
                  <FormField
                    name="bankAccount"
                    render={({ field }) => {
                      const selectedPostPaidPaymentMethod =
                        postPaidPaymentMethods?.find((method) => method._id === wPaymentMethod) ||
                        postPaidPaymentMethods?.at(0)
                      const selectedBankAccount = selectedPostPaidPaymentMethod?.bankAccounts?.find(
                        (account) => account._id === field.value,
                      )
                      return (
                        <Fragment>
                          <div className="flex flex-col gap-2">
                            <div className="p-5 rounded-xl border border-neutral-grey-200">
                              <QRBankTranfer
                                accountNumber={selectedBankAccount?.accountNumber as string}
                                bankCode={selectedBankAccount?.bankCode as string}
                                amount={totals.totalPrice}
                              />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div>
                                Số tiền:{' '}
                                <b className={cn(totals?.totalPrice > 0 && "after:content-['đ']")}>
                                  {formatCurrency(totals.totalPrice)}
                                </b>
                              </div>
                              <div>{selectedBankAccount?.accountNumber}</div>
                              <div>{selectedBankAccount?.bankCode}</div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-6 flex-1 max-h-[60svh] overflow-y-auto">
                            {postPaidPaymentMethods?.map((method) => (
                              <RadioGroup
                                {...field}
                                onValueChange={(e) => {
                                  field.onChange(e)
                                  handleUpdatePaymentMethod(method._id)
                                }}
                                className="flex flex-col gap-6"
                                key={method?._id}
                              >
                                {method?.bankAccounts?.map((account) => (
                                  <Label
                                    key={account._id}
                                    htmlFor={account._id}
                                    className={cn(
                                      'flex flex-col gap-2 px-4 py-2 flex-1 font-normal rounded-lg',
                                      'border border-neutral-grey-200',
                                      'has-[input:checked]:bg-green-50',
                                      'has-[input:checked]:border-2',
                                      'has-[input:checked]:border-green-500',
                                      'has-[input:checked]:text-green-500',
                                      'has-[input:checked]:font-semibold',
                                    )}
                                  >
                                    <div className="flex gap-4 items-center">
                                      <FormControl>
                                        <RadioGroupItem
                                          id={account._id}
                                          value={account._id as string}
                                          className={cn(
                                            'size-4 shrink-0 rounded-full border bg-transparent',
                                            'items-center justify-center',
                                            'border-neutral-grey-200 data-[state=checked]:border-green-500',
                                          )}
                                        >
                                          <RadioGroupIndicator className="relative">
                                            <Circle className="size-3.5 text-green-500 fill-green-500 border-transparent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                          </RadioGroupIndicator>
                                        </RadioGroupItem>
                                      </FormControl>

                                      <div className="text-sm font-semibold text-neutral-grey-600">
                                        {account?.bankName}
                                      </div>
                                    </div>
                                    <div
                                      className={cn(
                                        'text-xs font-normal text-neutral-grey-400',
                                        '[&>*]:flex [&>*]:gap-2 [&>*>div:first-child]:font-semibold [&>*>div:first-child]:text-neutral-grey-600',
                                      )}
                                    >
                                      <div>
                                        <div>Tên tài khoản:</div>
                                        <div>{account?.accountName || ''}</div>
                                      </div>
                                      <div>
                                        <div>Chi nhánh:</div>
                                        <div>{account?.bankBranch || ''}</div>
                                      </div>
                                      <div>
                                        <div>Số tài khoản:</div>
                                        <div>{account?.accountNumber || ''}</div>
                                      </div>
                                      <div>
                                        <div>Ghi chú nội bộ:</div>
                                        <div>{account?.note || ''}</div>
                                      </div>
                                    </div>
                                  </Label>
                                ))}
                              </RadioGroup>
                            ))}
                          </div>
                        </Fragment>
                      )
                    }}
                  />
                ) : (
                  <div className="text-center flex-1">Không có tài khoản khả dụng</div>
                )}
              </div>
            </KiosDialog>
          )}
          <Button
            type="submit"
            variant="default"
            disabled={
              totals.totalQuantity === 0 || postPaidPaymentMethods?.some((method) => method._id === wPaymentMethod)
            }
            loading={isLoadingCreatingOrder}
            className="py-8 w-full h-full !text-base"
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </KiosSection>
  )
}

export interface KiosSummaryItemProps {
  name: string
  quantity: number
  price: number
}

export const KiosSummaryItem = ({ name, quantity, price }: KiosSummaryItemProps) => {
  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="font-semibold text-neutral-grey-600">x{quantity}</span>
      <p className="font-medium text-neutral-grey-400">{name}</p>

      <span className="font-semibold text-neutral-grey-600 ml-auto whitespace-nowrap">
        {formatInternationalCurrency(price)}
      </span>
    </div>
  )
}

export default KiosSummary
