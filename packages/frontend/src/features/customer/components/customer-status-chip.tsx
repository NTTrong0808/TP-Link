import { cn } from '@/lib/tw'

type Props = {
  isActive: boolean
}
const CustomerStatusChip = ({ isActive }: Props) => {
  return (
    <span
      className={cn(
        'px-2 py-[2px] rounded-[100px] text-xs font-medium',
        isActive && 'bg-[#D5FCEA] text-[#0D8F53]',
        !isActive && 'bg-[#EAEAEA] text-[#1F1F1F]',
      )}
    >
      {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
    </span>
  )
}

export default CustomerStatusChip
