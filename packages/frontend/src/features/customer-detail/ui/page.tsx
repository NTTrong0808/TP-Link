'use client'

import CustomerBookings from '../components/customer-bookings'
import CustomerInfo from '../components/customer-info'

type Props = {
  customerId: string
}
const CustomerDetailPage = ({ customerId }: Props) => {
  // useHeader({
  //   title: URLS_TITLE[URLS.ADMIN.CUSTOMER.DETAIL],
  // })
  return (
    <main className="w-full p-4 bg-[#F5F5F5]  flex flex-col items-center h-full">
      <div className="max-w-[1200px] w-full flex flex-col gap-6">
        <CustomerInfo customerId={customerId} />
        <CustomerBookings customerId={customerId} />
      </div>
    </main>
  )
}

export default CustomerDetailPage
