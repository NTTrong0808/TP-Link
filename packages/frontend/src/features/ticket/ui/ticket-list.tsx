'use client'
import { useGetIssuedTicketsByBookingId } from '@/lib/api/queries/ticket/get-issued-tickets-by-booking-id'

import PrintTicketPortal from '@/features/print/ui/print-ticket-portal'
import Ticket from '@/features/print/ui/ticket'
import { cn } from '@/lib/tw'
import { Fragment, useMemo } from 'react'

const TicketList = ({ bookingId }: { bookingId: string }) => {
  const { data: issuedTickets } = useGetIssuedTicketsByBookingId({
    variables: {
      bookingId: bookingId as string,
    },
    enabled: !!bookingId,
    select: (resp) => resp.data,
  })

  const bookingField = useMemo(() => {
    return [
      {
        label: 'Số hóa đơn:',
        value: issuedTickets?.booking?.bookingCode,
      },
      {
        label: 'Tên khách hàng',
        value: issuedTickets?.booking?.customer?.name || issuedTickets?.booking?.vatInfo?.legalName,
      },
      {
        label: 'Số điện thoại',
        value: issuedTickets?.booking?.customer?.phone,
      },
      {
        label: 'Email',
        value: issuedTickets?.booking?.customer?.email || issuedTickets?.booking?.vatInfo?.receiverEmail,
      },
    ]
  }, [issuedTickets])

  return (
    <>
      <div className={cn('h-full w-full bg-neutral-grey-100/80 max-w-[375px] mx-auto px-4 py-6 flex flex-col gap-4')}>
        <div
          className={cn(
            'grid grid-cols-[max-content_1fr] gap-3 p-4 bg-white rounded-md shadow-[0px_1px_2px_0px_rgba(9,9,11,0.05)]',
            'text-sm font-medium [&>*:nth-child(odd)]:text-neutral-grey-400 ',
          )}
        >
          {bookingField?.map((booking) => (
            <Fragment key={booking.label}>
              <div>{booking.label}</div>
              <div>{booking.value}</div>
            </Fragment>
          ))}
        </div>
        {issuedTickets?.tickets?.map((data, index) => (
          <div
            key={data._id}
            className="bg-neutral-grey-50 px-3 py-2.5 border-low border rounded-md shadow-[0px_1px_2px_0px_rgba(9,9,11,0.05)]"
          >
            <div className="text-neutral-grey-400 text-xs font-semibold mb-3">
              {index + 1}/{issuedTickets?.tickets?.length}
            </div>
            <Ticket ticket={data} booking={issuedTickets?.booking} isView />
          </div>
        ))}
      </div>
      <PrintTicketPortal tickets={issuedTickets?.tickets || []} booking={issuedTickets?.booking} />
    </>
  )
}

export default TicketList
