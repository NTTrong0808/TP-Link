import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Loader from '@/components/ui/loader'
import { TimelineStepper } from '@/components/ui/stepper'
import { useDialogContext } from '@/components/widgets/dialoger'
import ReceptXIcon from '@/components/widgets/icons/recept-x-icon'
import { ORDER_HISTORY_ACTION_LABEL, ORDER_STATUS_LABEL } from '@/lib/api/queries/order/constant'
import { useGetAllOrderHistories } from '@/lib/api/queries/order/get-all-order-histories'
import { IOrderHistory, OrderHistoryAction, OrderStatus } from '@/lib/api/queries/order/schema'
import { cn } from '@/lib/tw'
import { appDayJs } from '@/utils/dayjs'
import { FileTextIcon, MailIcon, PrinterIcon, SquarePenIcon, XCircleIcon } from 'lucide-react'

export interface OrderHistoryDialogProps {
  bookingId: string
}

const ORDER_HISTORY_ACTION_ICON = {
  [OrderHistoryAction.CREATED]: <SquarePenIcon />,
  [OrderHistoryAction.CANCELLED]: <ReceptXIcon />,
  [OrderHistoryAction.FAILED]: <XCircleIcon />,
  [OrderHistoryAction.UPDATED_NOTE]: <FileTextIcon className="transform scale-y-[-1]" />,
  [OrderHistoryAction.CONFIRMED]: <PrinterIcon />,
  [OrderHistoryAction.SENT_TICKET_EMAIL]: <MailIcon />,
  [OrderHistoryAction.PRINTED_BILL]: <PrinterIcon />,
}

const OrderHistoryDialog = ({ bookingId }: OrderHistoryDialogProps) => {
  const { close } = useDialogContext()

  const { data, isFetching } = useGetAllOrderHistories({
    variables: {
      bookingId,
    },
  })

  return (
    <div className="flex flex-col gap-4">
      {isFetching ? (
        <div className="flex items-center justify-center bg-neutral-white/50 backdrop-blur-sm">
          <Loader loading={isFetching} />
        </div>
      ) : (
        <div className="max-h-[80dvh] overflow-y-auto">
          <TimelineStepper
            steps={
              data?.data?.map((item) => ({
                title: (
                  <>
                    {item?.createdByName && item?.action !== OrderHistoryAction.FAILED && (
                      <span className="font-medium">{item?.createdByName} </span>
                    )}
                    <span className={cn('text-neutral-grey-400', item?.createdByName && 'lowercase')}>
                      {ORDER_HISTORY_ACTION_LABEL[item.action as keyof typeof ORDER_HISTORY_ACTION_LABEL]}
                    </span>
                    {item?.action === OrderHistoryAction.CREATED && item?.paymentMethodName && (
                      <span className="text-neutral-grey-400">
                        {' '}
                        bằng phương thức thanh toán{' '}
                        <span className="font-medium text-neutral-black">{item?.paymentMethodName}</span>
                      </span>
                    )}
                  </>
                ),

                description: appDayJs(item.createdAt).format('DD/MM/YYYY HH:mm:ss'),
                icon: ORDER_HISTORY_ACTION_ICON[item.action as keyof typeof ORDER_HISTORY_ACTION_ICON],
                color:
                  item.action === OrderHistoryAction.CANCELLED || item.action === OrderHistoryAction.FAILED
                    ? ('destructive' as const)
                    : ('default' as const),
                content: (
                  <StepperContent
                    bookingStatus={item.bookingStatus}
                    note={item?.note}
                    cancelledReason={item?.cancelledReason}
                  />
                ),
              })) || []
            }
          />
        </div>
      )}
      <Button variant="outline" onClick={close}>
        Đóng
      </Button>
    </div>
  )
}

const badgeVariant = {
  [OrderStatus.PROCESSING]: 'warning',
  [OrderStatus.COMPLETED]: 'default',
  [OrderStatus.CANCELLED]: 'destructive',
} as Record<keyof typeof OrderStatus, BadgeProps['variant']>

const StepperContent = ({
  bookingStatus,
  note,
  cancelledReason,
}: {
  bookingStatus: IOrderHistory['bookingStatus']
  note?: string
  cancelledReason?: string
}) => {
  if (note) {
    return (
      <span className="text-neutral-grey-400">
        <span className="font-medium">Nội dung:</span> {note}
      </span>
    )
  }

  if (cancelledReason) {
    return (
      <span className="text-neutral-grey-400">
        <span className="font-medium">Lý do:</span> {cancelledReason}
      </span>
    )
  }

  if (bookingStatus) {
    return (
      <span className="text-neutral-grey-400">
        Trạng thái:{' '}
        <Badge variant={badgeVariant?.[bookingStatus as keyof typeof badgeVariant] || 'default'} corner="full">
          {ORDER_STATUS_LABEL[bookingStatus as keyof typeof ORDER_STATUS_LABEL]}
        </Badge>
      </span>
    )
  }

  return null
}

export default OrderHistoryDialog
