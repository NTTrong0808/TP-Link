import { Button } from '@/components/ui/button'
import { useDialogContext } from '@/components/widgets/dialoger'
import { toastError, toastSuccess } from '@/components/widgets/toast'
import { useMarkAsUsedIssuedTicketsMutation } from '@/lib/api/queries/ticket/mark-as-used-issued-tickets'

export interface IssuedTicketMarkAsUsedConfirmProps {
  handleRefetch?: () => void
  issuedTicketIds?: string[]
  issuedCodes?: string[]
}

const IssuedTicketMarkAsUsedConfirm = ({
  handleRefetch,
  issuedTicketIds,
  issuedCodes,
}: IssuedTicketMarkAsUsedConfirmProps) => {
  const { close } = useDialogContext()
  const { mutate: markAsUsedIssuedTickets, isPending: isMarkingAsUsed } = useMarkAsUsedIssuedTicketsMutation({
    onSuccess: () => {
      toastSuccess('Đánh dấu đã sử dụng vé thành công')
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
        Bạn có chắc chắn muốn đánh dấu đã sử dụng{' '}
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
        <Button
          variant="outline"
          onClick={() => !isMarkingAsUsed && close()}
          className="w-full"
          disabled={isMarkingAsUsed}
        >
          Đóng
        </Button>
        <Button
          loading={isMarkingAsUsed}
          className="w-full"
          onClick={() => isHaveIssuedTicket && markAsUsedIssuedTickets({ ids: issuedTicketIds })}
          disabled={!isHaveIssuedTicket}
        >
          Xác nhận
        </Button>
      </div>
    </div>
  )
}

export default IssuedTicketMarkAsUsedConfirm
