import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useCancelBookingOffline } from '@/lib/api/queries/booking/cancel-booking-offline'
import { zodResolver } from '@hookform/resolvers/zod'
import { memo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

export interface CancelPaymentDialogProps {
  bookingCode: string
  bookingId: string
  onSuccess: () => void
}

const CancelPaymentDialog = ({ bookingCode, bookingId, onSuccess }: CancelPaymentDialogProps) => {
  const { close } = useDialogContext()

  const form = useForm({
    resolver: zodResolver(
      z.object({
        note: z
          .string({
            required_error: 'Ghi chú không được để trống',
            message: 'Ghi chú không được để trống',
          })
          .min(1, { message: 'Ghi chú không được để trống' })
          .trim(),
      }),
    ),
    defaultValues: {
      note: '',
    },
  })

  const { mutateAsync: cancelBookingOffline, isPending: isLoadingCancel } = useCancelBookingOffline({
    onSuccess: () => {
      toastSuccess('Huỷ thanh toán đơn hàng thành công')
      onSuccess()
      close()
    },
    onError: () => {
      toastError('Huỷ thanh toán đơn hàng thất bại')
    },
  })

  const handleCancelBookingOffline = (data: { note: string }) => {
    if (bookingId) {
      cancelBookingOffline({
        bookingId: bookingId,
        note: data.note,
      })
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleCancelBookingOffline)}>
        <div className="flex flex-col gap-4">
          <div className="text-sm text-center">
            Hủy thanh toán đơn hàng <b>{bookingCode}</b>
          </div>
          <Field
            name="note"
            component="textarea"
            placeholder="Nhập ghi chú"
            label="Ghi chú"
            disabled={isLoadingCancel}
            // onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex justify-end items-center gap-3">
            <Button
              variant="outline"
              onClick={() => !isLoadingCancel && close()}
              className="w-full"
              disabled={isLoadingCancel}
            >
              Đóng
            </Button>
            <Button variant="destructive" type="submit" loading={isLoadingCancel} className="w-full">
              Huỷ thanh toán
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default memo(CancelPaymentDialog)
