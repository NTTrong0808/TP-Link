'use client'

import { DataTable, useDataTablePagination } from '@/components/data-table'
import FileIcon from '@/components/widgets/icons/file-icon'
import { URLS } from '@/constants/urls'
import { useBookings } from '@/lib/api/queries/booking/get-bookings'
import { Booking, BookingStatus } from '@/lib/api/queries/booking/schema'
import { formatInternationalCurrency } from '@/utils/currency'
import { appDayJs } from '@/utils/dayjs'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { useUpdateEffect } from 'react-use'
import { useFilter } from '../hooks/use-filter'
import { useTotalCustomers } from '../hooks/use-total-customers'
import BookingChip from './booking-chip'
import CustomerBookingsFilter from './customer-bookings-filter'

const CustomerBookings = ({ customerId }: { customerId: string }) => {
  const { pagination, setPagination } = useDataTablePagination({
    defaultPageSize: 25,
    defaultPageIndex: 0,
  })
  const [filters] = useFilter()
  const { setTotal } = useTotalCustomers()
  const {
    data: bookingsRes,
    isLoading,
    isSuccess,
  } = useBookings({
    variables: {
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      taId: customerId,
      ...filters,
    },
  })

  const columns: ColumnDef<Booking>[] = [
    {
      header: 'Số hóa đơn',
      accessorKey: 'bookingCode',
      cell(props) {
        return (
          <Link
            href={`${URLS.ADMIN.ORDER.DETAIL.replace(':id', props.row.original._id)}`}
            className="text-semantic-info-300 font-medium"
          >
            {props.row.original.bookingCode}
          </Link>
        )
      },
    },
    {
      header: 'Ngày đặt',
      accessorKey: 'createdAt',
      cell(props) {
        return appDayJs(props.row.original.createdAt).format('DD/MM/YYYY HH:mm')
      },
    },
    {
      header: 'Giá trị',
      accessorKey: 'totalPaid',
      cell(props) {
        return formatInternationalCurrency(props.row.original.totalPaid)
      },
    },
    {
      header: 'PTTT',
      accessorKey: 'paymentMethodName',
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status',
      cell(props) {
        return <BookingChip status={props.row.original.status as BookingStatus} />
      },
    },
    {
      header: 'Ghi chú',
      accessorKey: 'note',
    },
    {
      header: 'VAT',
      accessorKey: 'VAT',
      cell(props) {
        return props?.row?.original?.vatInfo ? <FileIcon className="hover:cursor-pointer" /> : null
      },
    },
  ]

  useUpdateEffect(() => {
    if (isSuccess) {
      setTotal(bookingsRes?.meta?.total || 0)
    }
  }, [bookingsRes, isSuccess])

  return (
    <div className="flex flex-col gap-4 w-full">
      <CustomerBookingsFilter />
      <DataTable
        data={bookingsRes?.data ?? []}
        columns={columns}
        pagination={{
          type: 'manual',
          hidden: false,
          total: 0,
          ...pagination,
          setPagination,
        }}
        className="h-full z-1"
        loading={isLoading}
      />
    </div>
  )
}

export default CustomerBookings
