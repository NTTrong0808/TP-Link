import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { formatCurrency } from '@/helper'
import { useConfirmBookingOffline } from '@/lib/api/queries/booking/confirm-booking-offline'
import { BankAccount } from '@/lib/api/queries/payment-method/schema'
import { cn } from '@/lib/tw'
import { zodResolver } from '@hookform/resolvers/zod'
import { memo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

export interface ConfirmPaymentDialogProps {
  bookingCode: string
  bookingId: string
  bankAccount: BankAccount
  totalPaid: number
  onSuccess: () => void
}

const ConfirmPaymentDialog = ({
  bookingCode,
  bookingId,
  bankAccount,
  totalPaid,
  onSuccess,
}: ConfirmPaymentDialogProps) => {
  const { close } = useDialogContext()

  const form = useForm({
    resolver: zodResolver(
      z.object({
        note: z.string().trim().optional(),
      }),
    ),
    defaultValues: {
      note: '',
    },
  })
  const { mutateAsync: confirmBookingOffline, isPending: isLoadingConfirm } = useConfirmBookingOffline({
    onSuccess: () => {
      toastSuccess('Xác nhận thanh toán đơn hàng thành công')
      onSuccess()
      close()
    },
    onError: () => {
      toastError('Xác nhận thanh toán đơn hàng thất bại')
    },
  })

  const handleConfirmBookingOffline = (data: { note?: string }) => {
    if (bookingId) {
      confirmBookingOffline({
        bookingId: bookingId,
        note: data?.note,
      })
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleConfirmBookingOffline)}>
        <div className="flex flex-col gap-4">
          <div className="text-sm text-center text-pretty">
            Xác nhận khách hàng đã thanh toán số tiền <b>{formatCurrency(totalPaid)}đ</b> cho đơn hàng{' '}
            <b>{bookingCode}</b>
          </div>

          <div
            className={cn(
              'rounded-md bg-neutral-grey-50 text-xs text-neutral-grey-400 p-3',
              '[&_p]:font-semibold [&_p]:text-neutral-grey-600',
            )}
          >
            <div>
              <p>Ngân hàng:</p>
              <div>{bankAccount.bankName}</div>
            </div>
            <div>
              <p>Tên tài khoản:</p>
              <div>{bankAccount.accountName}</div>
            </div>
            <div>
              <p>Số tài khoản:</p>
              <div>{bankAccount.accountNumber}</div>
            </div>
            <div>
              <p>Chi nhánh:</p>
              <div>{bankAccount.bankBranch}</div>
            </div>
            <div>
              <p>Ghi chú nội bộ:</p>
              <div>{bankAccount.note}</div>
            </div>
          </div>

          <Field
            name="note"
            component="textarea"
            placeholder="Nhập ghi chú"
            label="Ghi chú"
            disabled={isLoadingConfirm}
            // onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex justify-end items-center gap-3">
            <Button
              variant="outline"
              onClick={() => !isLoadingConfirm && close()}
              className="w-full"
              disabled={isLoadingConfirm}
            >
              Đóng
            </Button>
            <Button type="submit" loading={isLoadingConfirm} className="w-full">
              Xác nhận
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default memo(ConfirmPaymentDialog)
