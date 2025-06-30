import { Button } from '@/components/ui/button'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useDeleteIssuedTicketsMutation } from '@/lib/api/queries/ticket/delete-issued-tickets'

export interface IssuedTicketDeleteConfirmProps {
  handleRefetch?: () => void
  issuedTicketIds?: string[]
  issuedCodes?: string[]
}

const IssuedTicketDeleteConfirm = ({ handleRefetch, issuedTicketIds, issuedCodes }: IssuedTicketDeleteConfirmProps) => {
  const { close } = useDialogContext()
  const { mutate: deleteIssuedTickets, isPending: isDeleting } = useDeleteIssuedTicketsMutation({
    onSuccess: () => {
      toastSuccess('Xoá vé thành công')
      handleRefetch?.()
    },
    onError: (error) => {
      toastError(error)
      handleRefetch?.()
    },
  })

  const isHaveIssuedTicket = issuedTicketIds && issuedTicketIds?.length > 0

  const isMoreThanOneIssuedTicket = issuedTicketIds && issuedTicketIds?.length > 1

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-center text-pretty">
        Bạn có chắc chắn muốn xoá{' '}
        {isMoreThanOneIssuedTicket ? (
          'các vé đã chọn'
        ) : (
          <>
            vé <span className="font-semibold">#{issuedCodes?.[0]}</span>
          </>
        )}{' '}
        không?
      </div>
      <div className="flex justify-end items-center gap-3">
        <Button variant="outline" onClick={() => !isDeleting && close()} className="w-full" disabled={isDeleting}>
          Đóng
        </Button>
        <Button
          loading={isDeleting}
          className="w-full"
          onClick={() => isHaveIssuedTicket && deleteIssuedTickets({ ids: issuedTicketIds })}
          disabled={!isHaveIssuedTicket}
        >
          Xác nhận
        </Button>
      </div>
    </div>
  )
}

export default IssuedTicketDeleteConfirm
