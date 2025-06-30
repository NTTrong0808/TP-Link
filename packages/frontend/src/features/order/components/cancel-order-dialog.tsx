import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useCancelOrder } from '@/lib/api/queries/order/cancel-order'
import { zodResolver } from '@hookform/resolvers/zod'
import { memo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

export interface CancelOrderDialogProps {
  bookingCode: string
  bookingId: string
  onSuccess: () => void
}

const CancelOrderDialog = ({ bookingCode, bookingId, onSuccess }: CancelOrderDialogProps) => {
  const { close } = useDialogContext()

  const form = useForm({
    resolver: zodResolver(
      z.object({
        cancelledReason: z
          .string({
            required_error: 'Lý do huỷ đơn hàng không được để trống',
            message: 'Lý do huỷ đơn hàng không được để trống',
          })
          .min(1, { message: 'Lý do huỷ đơn hàng không được để trống' })
          .trim(),
      }),
    ),
    defaultValues: {
      cancelledReason: '',
    },
  })

  const { mutateAsync: cancelOrder, isPending: isLoadingCancel } = useCancelOrder({
    onSuccess: () => {
      toastSuccess('Huỷ đơn hàng thành công')
      onSuccess()
      close()
    },
    onError: (error) => {
      toastError(error)
    },
  })

  const handleCancelBooking = (data: { cancelledReason: string }) => {
    if (bookingId) {
      cancelOrder({
        bookingId: bookingId,
        cancelledReason: data.cancelledReason,
      })
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleCancelBooking)}>
        <div className="flex flex-col gap-4">
          <div className="text-sm text-center">
            Hủy đơn hàng <b>{bookingCode}</b>
          </div>
          <Field
            name="cancelledReason"
            component="textarea"
            placeholder="Nhập lý do huỷ đơn hàng"
            label="Lý do huỷ đơn hàng"
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
              Huỷ đơn hàng
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default memo(CancelOrderDialog)
