import { IOrder } from '@/lib/api/queries/order/schema'
import { useGetIssuedTicketsByBookingId } from '@/lib/api/queries/ticket/get-issued-tickets-by-booking-id'
import Bill from './bill'

type PrintBillPortalProps = { booking: IOrder } | { bookingId: IOrder['_id'] }

const PrintBillPortal = (props: PrintBillPortalProps) => {
  const isEnabled = 'bookingId' in props

  const { data, refetch } = useGetIssuedTicketsByBookingId({
    variables: {
      bookingId: isEnabled ? props?.bookingId : '',
    },
    enabled: isEnabled,
    select: (data) => data.data,
  })

  const booking = 'booking' in props ? props.booking : data?.booking

  return booking && Object.keys(booking).length > 0 && <Bill booking={booking} />
}

export default PrintBillPortal
