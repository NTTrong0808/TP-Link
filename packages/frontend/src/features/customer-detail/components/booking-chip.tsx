import { BookingStatus } from '@/lib/api/queries/booking/schema'
import { cn } from '@/lib/tw'

type Props = {
  status: BookingStatus
}
const BookingChip = ({ status }: Props) => {
  const mappedStatus = {
    [BookingStatus.CANCELLED]: 'Đã huỷ',
    [BookingStatus.COMPLETED]: 'Hoàn thành',
    [BookingStatus.PROCESSING]: 'Đang xử lý',
    [BookingStatus.UNKNOWN]: 'Chưa xác định',
  }
  return (
    <span
      className={cn(
        'px-2 py-[2px] rounded-[100px] text-xs font-medium',
        status === BookingStatus.CANCELLED && 'bg-[#EAEAEA] text-[#1F1F1F]',
        status === BookingStatus.COMPLETED && 'bg-[#D5FCEA] text-[#0D8F53]',
        status === BookingStatus.PROCESSING && 'bg-[#FAEFCA] text-[#F68342]',
        status === BookingStatus.UNKNOWN && 'bg-[#EAEAEA] text-[#1F1F1F]',
      )}
    >
      {mappedStatus[status] ?? 'UnKnown'}
    </span>
  )
}

export default BookingChip
