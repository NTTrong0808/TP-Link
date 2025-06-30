import NewOrderListTable from '@/features/new-orders/ui'
import { Suspense } from 'react'

const Page = () => {
  // return <OrderList />
  return (
    <Suspense>
      <NewOrderListTable />
    </Suspense>
  )
}

export default Page
