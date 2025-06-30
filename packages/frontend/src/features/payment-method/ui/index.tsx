'use client'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { useDialogContext, useDialoger } from '@/components/widgets/dialoger'
import PlusIcon from '@/components/widgets/icons/plus-icon'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import {
  ConfigurationContent,
  ConfigurationHeader,
  ConfigurationItemGroup,
  ConfigurationSection,
} from '@/features/configuration/components/configuration'
import { useAddBankAccount } from '@/lib/api/queries/payment-method/add-bank-account'
import { useDeleteBankAccount } from '@/lib/api/queries/payment-method/delete-bank-account'
import { usePaymentMethods } from '@/lib/api/queries/payment-method/get-payment-methods'
import { BankAccount, bankAccountSchema, PaymentMethodType } from '@/lib/api/queries/payment-method/schema'
import { useUpdateBankAccount } from '@/lib/api/queries/payment-method/update-bank-account'
import { useUpdatePaymentMethod } from '@/lib/api/queries/payment-method/update-payment-method'
import { useGetBankList } from '@/lib/api/queries/sepay/get-bank-list'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { zodResolver } from '@hookform/resolvers/zod'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { ComponentProps } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const PaymentMethod = () => {
  const canAccess = useCanAccess()
  const isCanViewPaymentMethod = canAccess(CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_VIEW)
  const isCanTogglePaymentMethod = canAccess(CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_TOGGLE)
  const isCanToggleBankAccount = canAccess(CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_BANK_ACCOUNT_TOGGLE)
  const isCanViewBankAccount = canAccess(CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_BANK_ACCOUNT_VIEW)
  const isCanCreateBankAccount = canAccess(CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_BANK_ACCOUNT_CREATE)
  const isCanUpdateBankAccount = canAccess(CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_BANK_ACCOUNT_UPDATE)
  const isCanDeleteBankAccount = canAccess(CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_BANK_ACCOUNT_DELETE)

  const { addDialoger, closeDialogerById } = useDialoger()
  const { data: paymentMethodData, refetch } = usePaymentMethods({
    select: (resp) => resp.data,
  })

  const paymentMethods = paymentMethodData?.filter((method) => method?.paymentType !== PaymentMethodType.POSTPAID)
  const postPaidPaymentMethods = paymentMethodData?.filter(
    (method) => method?.paymentType === PaymentMethodType.POSTPAID,
  )

  const { mutate: updatePaymentMethod, isPending: isUpdatingPaymentMethod } = useUpdatePaymentMethod({
    onSuccess: () => {
      toastSuccess('Cập nhật thành công')
      refetch()
    },
    onError: (error) => {
      toastError(error)
      refetch()
    },
  })

  const { mutateAsync: deletePaymentMethod, isPending: isDeletingPaymentMethod } = useDeleteBankAccount({
    onSuccess: () => {
      toastSuccess('Xoá thành công')
      refetch()
    },
    onError: (error) => {
      toastError(error)
      refetch()
    },
  })

  const { mutate: updateBankAccount, isPending: isUpdatingBankAccount } = useUpdateBankAccount({
    onSuccess: () => {
      toastSuccess('Cập nhật thành công')
      refetch()
    },
    onError: (error) => {
      toastError(error)
      refetch()
    },
  })

  const handleTogglePaymentMethod = (checked: boolean, id?: string) => {
    if (id) {
      updatePaymentMethod({
        id,
        available: checked,
      })
    }
  }

  const handleToggleBankAccount = (checked: boolean, paymentMethodId: string, bankAccountId?: string) => {
    if (bankAccountId) {
      updateBankAccount({
        bankAccountId,
        paymentMethodId,
        available: checked,
      })
    }
  }

  const handleAddBankAccount = (paymentMethodId: string) => {
    addDialoger({
      title: 'Thêm ngân hàng',
      content: <BankAccountForm paymentMethodId={paymentMethodId} onSuccess={() => refetch()} />,
      variant: 'dialog',
      disableCloseOutside: true,
      hideXIcon: true,
    })
  }

  const handleUpdateBankAccount = (paymentMethodId: string, bankAccountId?: string, defaultValues?: BankAccount) => {
    if (bankAccountId) {
      addDialoger({
        title: 'Cập nhật ngân hàng',
        content: (
          <BankAccountForm
            paymentMethodId={paymentMethodId}
            bankAccountId={bankAccountId}
            onSuccess={() => refetch()}
            defaultValues={defaultValues}
          />
        ),
        variant: 'dialog',
        disableCloseOutside: true,
        hideXIcon: true,
      })
    }
  }

  const handleDeleteBankAccount = ({
    paymentMethodId,
    bankAccountId,
    bankName,
  }: {
    paymentMethodId: string
    bankAccountId?: string
    bankName?: string
  }) => {
    if (bankAccountId) {
      addDialoger({
        title: 'Xoá ngân hàng',
        content: (
          <DeleteBankAccountDialog
            onAccept={(dialogId) =>
              deletePaymentMethod({ paymentMethodId, bankAccountId }).then(() => closeDialogerById(dialogId))
            }
            bankName={bankName}
            loading={isDeletingPaymentMethod}
          />
        ),
        variant: 'dialog',
        disableCloseOutside: true,
        hideXIcon: true,
      })
    }
  }

  return (
    <ConfigurationSection id="payment-method">
      <ConfigurationContent>
        <ConfigurationHeader>
          <h3>Phương thức thanh toán</h3>
        </ConfigurationHeader>
        {isCanViewPaymentMethod &&
          paymentMethods?.map((method) => (
            <ConfigurationItemGroup
              key={method._id}
              title={method.name}
              defaultChecked={method.available}
              toggleable={isCanTogglePaymentMethod}
              imageUrl={method.logoUrl}
              onCheckedChange={(checked) => handleTogglePaymentMethod(checked, method?._id)}
            />
          ))}
      </ConfigurationContent>

      {isCanViewBankAccount &&
        postPaidPaymentMethods?.map((method) => (
          <ConfigurationContent key={method._id}>
            <ConfigurationHeader>
              <h3>Phương thức {method.name}</h3>

              {isCanCreateBankAccount && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBankAccount(method._id)}
                  disabled={!isCanCreateBankAccount}
                >
                  <PlusIcon /> Thêm
                </Button>
              )}
            </ConfigurationHeader>
            {method?.bankAccounts?.map((bankAccount) => (
              <ConfigurationItemGroup
                key={bankAccount?._id}
                title={bankAccount?.bankName || bankAccount?.bankShortName || ''}
                defaultChecked={bankAccount?.available}
                toggleable={isCanToggleBankAccount}
                imageUrl={method.logoUrl}
                onCheckedChange={(checked) => handleToggleBankAccount(checked, method._id, bankAccount?._id)}
              >
                <div className="flex flex-col gap-3">
                  <div
                    className={cn(
                      'rounded-lg bg-neutral-50 p-4',
                      'text-xs font-normal text-neutral-grey-400',
                      '[&>*]:flex [&>*]:gap-2 [&>*>div:first-child]:font-semibold [&>*>div:first-child]:text-neutral-grey-600',
                    )}
                  >
                    <div>
                      <div>Tên tài khoản:</div>
                      <div>{bankAccount?.accountName || ''}</div>
                    </div>
                    <div>
                      <div>Chi nhánh:</div>
                      <div>{bankAccount?.bankBranch || ''}</div>
                    </div>
                    <div>
                      <div>Số tài khoản:</div>
                      <div>{bankAccount?.accountNumber || ''}</div>
                    </div>
                    <div>
                      <div>Ghi chú nội bộ:</div>
                      <div>{bankAccount?.note || ''}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {isCanDeleteBankAccount && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDeleteBankAccount({
                            paymentMethodId: method._id,
                            bankAccountId: bankAccount?._id,
                            bankName: bankAccount?.bankName,
                          })
                        }
                        disabled={!isCanDeleteBankAccount}
                      >
                        <Trash2Icon /> Xoá
                      </Button>
                    )}

                    {isCanUpdateBankAccount && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateBankAccount(method._id, bankAccount?._id, bankAccount)}
                        disabled={!isCanUpdateBankAccount}
                      >
                        <PencilIcon /> Chỉnh sửa
                      </Button>
                    )}
                  </div>
                </div>
              </ConfigurationItemGroup>
            ))}
          </ConfigurationContent>
        ))}
    </ConfigurationSection>
  )
}

export interface BankAccountFormProps extends ComponentProps<'form'> {
  paymentMethodId: string
  bankAccountId?: string
  defaultValues?: BankAccount
  onSuccess?: () => void
}

const BankAccountForm = ({
  paymentMethodId,
  bankAccountId,
  defaultValues,
  onSuccess,
  ...props
}: BankAccountFormProps) => {
  const canAccess = useCanAccess()
  const { close } = useDialogContext()

  const isCanUpdateBankAccount = canAccess(CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_BANK_ACCOUNT_UPDATE)
  const isCanCreateBankAccount = canAccess(CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_BANK_ACCOUNT_CREATE)

  const form = useForm<BankAccount>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: defaultValues,
  })

  const { data: bankList } = useGetBankList({
    select: (resp) => resp.data.data,
  })

  const bankOptions =
    bankList?.map((bank) => ({
      label: `${bank.name} (${bank.short_name})`,
      value: bank.code,
    })) || []

  const { mutateAsync: addBankAccount, isPending: isAddingBankAccount } = useAddBankAccount()
  const { mutateAsync: updateBankAccount, isPending: isUpdatingBankAccount } = useUpdateBankAccount()

  const handleSubmit = async (data: BankAccount) => {
    try {
      const bank = bankList?.find((bank) => bank.code === data.bankCode)
      const bankName = `${bank?.name} (${bank?.short_name})`
      const bankShortName = bank?.short_name
      if (bankAccountId) {
        await updateBankAccount({ paymentMethodId, bankAccountId, ...data, bankName, bankShortName })
        toastSuccess('Cập nhật thành công')
      } else {
        await addBankAccount({ paymentMethodId, ...data, bankName, bankShortName })
        toastSuccess('Thêm thành công')
      }
      form.reset()
      onSuccess?.()
      close()
    } catch (error) {
      toastError(error)
    }
  }

  const handleClose = () => {
    form.reset()
    close()
  }

  const isPending = isAddingBankAccount || isUpdatingBankAccount

  const isDisabled = bankAccountId ? !isCanUpdateBankAccount : !isCanCreateBankAccount

  return (
    <FormProvider {...form}>
      <form
        {...props}
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn('flex flex-col gap-8', props.className)}
      >
        <div className="flex flex-col gap-4">
          <div className="text-xs font-semibold text-neutral-grey-400 bg-neutral-grey-50 px-2 py-1">
            Thông tin ngân hàng
          </div>
          <Field
            label="Tên tài khoản"
            component="text"
            name="accountName"
            placeholder="Nhập tên tài khoản"
            disabled={isPending || isDisabled}
          />
          <Field
            label="Số tài khoản"
            component="text"
            name="accountNumber"
            placeholder="Nhập số tài khoản"
            disabled={isPending || isDisabled}
          />
          <Field
            label="Chi nhánh (tùy chọn)"
            component="text"
            name="bankBranch"
            placeholder="Nhập chi nhánh"
            disabled={isPending || isDisabled}
          />
          <Field
            label="Ngân hàng"
            component="select"
            name="bankCode"
            placeholder="Nhập tên ngân hàng"
            disabled={isPending || isDisabled}
            options={bankOptions}
          />
          <Field
            label="Ghi chú nội bộ"
            component="textarea"
            name="note"
            placeholder="Nhập ghi chú nội bộ"
            disabled={isDisabled}
          />
        </div>
        <div className="flex gap-3 items-center justify-between">
          <Button variant="outline" type="button" onClick={handleClose} className="w-full">
            Rời trang
          </Button>
          <Button type="submit" loading={isPending} className="w-full" disabled={isDisabled}>
            {bankAccountId ? 'Lưu' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

const DeleteBankAccountDialog = ({
  onAccept,
  bankName,
  loading,
}: {
  onAccept: (dialogId: string) => void
  bankName?: string
  loading: boolean
}) => {
  const canAccess = useCanAccess()
  const isCanDeleteBankAccount = canAccess(CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_BANK_ACCOUNT_DELETE)
  const { close, dialog } = useDialogContext()
  return (
    <div className="flex flex-col gap-4">
      <div className="text-neutral-grey-400">
        Bạn có chắc rằng muốn xoá thông tin <b>{bankName}</b> không? Hành động này sẽ xoá hoàn toàn các dữ liệu liên
        quan
      </div>
      <div className="flex gap-3 items-center justify-between">
        <Button variant="outline" onClick={() => close()} className="w-full" loading={loading}>
          Rời trang
        </Button>
        <Button
          loading={loading}
          className="w-full"
          variant="destructive"
          onClick={() => onAccept(dialog.id)}
          disabled={!isCanDeleteBankAccount}
        >
          Xoá
        </Button>
      </div>
    </div>
  )
}

export default PaymentMethod
