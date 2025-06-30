'use client'

import TicketList from '@/features/ticket/ui/ticket-list'
import { useVerifyTicketByBooking } from '@/lib/api/queries/ticket/verify-tickets-by-booking'
import { useAuth } from '@/lib/auth/context'
import { notFound, useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Page() {
  const [valid, setValid] = useState(true)
  const { cognitoUser } = useAuth()
  const params = useParams()
  const searchParams = useSearchParams()

  const { mutateAsync: verifyTicketByBooking } = useVerifyTicketByBooking({
    retry: false,
    onError() {
      setValid(false)
    },
  })

  useEffect(() => {
    if (cognitoUser) return
    verifyTicketByBooking({
      bookingId: params.bookingId as string,
      sign: searchParams.get('sign') as string,
      noAuth: true,
    })
      .then(() => {})
      .catch(() => {
        notFound()
      })
  }, [cognitoUser])

  if (!(params?.bookingId && valid)) {
    return notFound()
  }

  return <TicketList bookingId={params.bookingId as string} />
}
