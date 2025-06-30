import { Button } from '@/components/ui/button'
import Loader from '@/components/ui/loader'
import { useDialogContext } from '@/components/widgets/dialoger'
import { useGetAllTicketHistories } from '@/lib/api/queries/ticket/get-all-ticket-histories'
import { IIssuedTicket } from '@/lib/api/queries/ticket/schema'
import TicketHistoryTimeline from './ticket-history-timeline'

export interface TicketHistoryDialogProps {
  ticketId: string
  ticketStatus?: IIssuedTicket['status']
  ticketExpiryDate?: IIssuedTicket['expiryDate']
}

const TicketHistoryDialog = ({ ticketId, ticketStatus, ticketExpiryDate }: TicketHistoryDialogProps) => {
  const { close } = useDialogContext()

  const { data, isFetching } = useGetAllTicketHistories({
    variables: {
      ticketId,
    },
  })
  return (
    <div className="flex flex-col gap-4">
      {isFetching ? (
        <div className="flex items-center justify-center bg-neutral-white/50 backdrop-blur-sm">
          <Loader loading={isFetching} />
        </div>
      ) : (
        <div className="max-h-[80dvh] overflow-y-auto">
          <TicketHistoryTimeline
            data={data?.data ?? []}
            ticketStatus={ticketStatus}
            ticketExpiryDate={ticketExpiryDate}
          />
        </div>
      )}
      <Button variant="outline" onClick={close}>
        Đóng
      </Button>
    </div>
  )
}

export default TicketHistoryDialog
