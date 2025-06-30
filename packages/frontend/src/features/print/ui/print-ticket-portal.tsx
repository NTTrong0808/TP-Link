import Ticket from '@/features/print/ui/ticket'
import { IOrder } from '@/lib/api/queries/order/schema'
import {
  getIssuedTicketsByBookingId,
  getIssuedTicketsByBookingIdKey,
} from '@/lib/api/queries/ticket/get-issued-tickets-by-booking-id'
import { IIssuedTicket } from '@/lib/api/queries/ticket/schema'
import { useQuery } from '@tanstack/react-query'
import Bill from './bill'

type PrintTicketPortalProps = {
  tickets?: IIssuedTicket[]
  bookingId?: IOrder['_id']
  booking?: IOrder
} & ({ tickets: IIssuedTicket[] } | { bookingId: IOrder['_id'] })

const PrintTicketPortal = ({ tickets, bookingId, booking }: PrintTicketPortalProps) => {
  const isEnabled = !(tickets && tickets?.length > 0) && !!bookingId

  const { data } = useQuery({
    queryKey: [getIssuedTicketsByBookingIdKey, bookingId],
    queryFn: () => getIssuedTicketsByBookingId({ bookingId: bookingId as string }),
    enabled: isEnabled,
    select: (data) => data.data,
  })

  const issuedTickets = tickets && tickets?.length > 0 ? tickets : data?.tickets
  const bookingData = booking ?? data?.booking

  return (
    // issuedTickets &&
    // issuedTickets.length > 0 &&
    <>
      {bookingId && bookingData && <Bill booking={bookingData} />}
      {issuedTickets?.map((item) => (
        <Ticket ticket={item} key={item._id} booking={bookingData} />
      ))}
    </>
  )
}

export default PrintTicketPortal
