import { Button } from '@/components/ui/button'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useSendTicketEmailMutation } from '@/lib/api/queries/order/resend-ticket-email'
import { memo } from 'react'

export interface ResendTicketEmailDialogProps {
  email: string
  bookingId: string
}
const ResendTicketEmailDialog = ({ email, bookingId }: ResendTicketEmailDialogProps) => {
  const { close } = useDialogContext()
  const { mutateAsync: resendTicketEmail, isPending: isResendTicketEmailPending } = useSendTicketEmailMutation({
    onSuccess: () => {
      toastSuccess('Gửi lại vé thành công')
      close()
    },
    onError: (error) => {
      toastError('Có lỗi xảy ra, vui lòng thử lại sau!')
    },
  })

  const handleResendTicketEmail = () => {
    if (!email) {
      toastError('Đơn hàng không có email nhận vé')
      return
    }
    resendTicketEmail({
      bookingId,
      // ticketIds
    })
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="text-base font-normal">
        Một email chứa thông tin vé sẽ được tự động gửi đến email{' '}
        <span className="font-medium text-black">{email}</span>
      </div>
      <div className="flex gap-2 justify-between">
        <Button variant="outline" onClick={() => close()} className="w-full" disabled={isResendTicketEmailPending}>
          Rời trang
        </Button>
        <Button
          onClick={() => handleResendTicketEmail()}
          loading={isResendTicketEmailPending}
          disabled={!email}
          className="w-full"
        >
          Gửi lại vé
        </Button>
      </div>
    </div>
  )
}

export default memo(ResendTicketEmailDialog)
