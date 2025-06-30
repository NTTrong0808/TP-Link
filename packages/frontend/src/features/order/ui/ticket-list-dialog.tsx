import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import PrintTicketPortal from '@/features/print/ui/print-ticket-portal'
import { PanelView } from '@/layouts/panel/panel-view'
import { IOrder } from '@/lib/api/queries/order/schema'
import { IIssuedTicket } from '@/lib/api/queries/ticket/schema'
import { useIsFetching } from '@tanstack/react-query'
import { useState } from 'react'
import TicketListFilter from '../components/ticket-list-filter'
import TicketListTable from '../components/ticket-list-table'

export interface TicketListDialogProps {
  orderData?: IOrder
}

const TicketListDialog = ({ orderData }: TicketListDialogProps) => {
  const isLoading = useIsFetching()

  const [selectedTickets, setSelectedTickets] = useState<IIssuedTicket[]>([])

  return (
    <>
      <Dialog
        onOpenChange={(open) => {
          if (!open) setSelectedTickets([])
        }}
      >
        <DialogTrigger asChild>
          <Button size="lg" variant="ghost" className="text-semantic-info-300" loading={Boolean(isLoading)}>
            Xem vé
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[90dvh] max-w-[90dvw] flex flex-col">
          <DialogHeader>
            <DialogTitle>Xem vé</DialogTitle>
          </DialogHeader>
          <PanelView className="p-0 bg-white">
            <TicketListFilter selectedTickets={selectedTickets} setSelectedTickets={setSelectedTickets} />
            <TicketListTable selectedTickets={selectedTickets} setSelectedTickets={setSelectedTickets} />
          </PanelView>
        </DialogContent>
      </Dialog>
      {selectedTickets?.length > 0 && <PrintTicketPortal tickets={selectedTickets || []} booking={orderData} />}
    </>
  )
}

export default TicketListDialog
