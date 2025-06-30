import { Badge, BadgeProps } from '@/components/ui/badge'
import { ORDER_STATUS_LABEL } from '@/lib/api/queries/order/constant'
import { OrderStatus } from '@/lib/api/queries/order/schema'

const badgeVariant = {
  PROCESSING: 'warning',
  COMPLETED: 'default',
  CANCELLED: 'destructive',
} as Record<keyof typeof OrderStatus, BadgeProps['variant']>

export interface OrderStatusBadgeProps {
  status?: OrderStatus | string
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  return (
    <Badge
      variant={badgeVariant?.[status as keyof typeof badgeVariant] || 'secondary'}
      corner="full"
      className="text-nowrap"
    >
      {ORDER_STATUS_LABEL[status as keyof typeof ORDER_STATUS_LABEL] || status || 'Không rõ'}
    </Badge>
  )
}

export default OrderStatusBadge
