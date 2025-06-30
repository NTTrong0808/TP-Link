import { Badge, BadgeProps } from '@/components/ui/badge'
import Nothing from '@/components/ui/nothing'
import { TimelineStepper } from '@/components/ui/stepper'
import { TICKET_VALID_TIME_FROM_SECOND, TICKET_VALID_TIME_TO_SECOND } from '@/helper/ticket'
import { ISSUED_TICKET_HISTORY_STATUS_LABEL, ISSUED_TICKET_STATUS_LABEL } from '@/lib/api/queries/ticket/constants'
import {
  IIssuedTicket,
  IIssuedTicketHistory,
  ISSUED_TICKET_HISTORY_STATUS,
  ISSUED_TICKET_STATUS,
} from '@/lib/api/queries/ticket/schema'
import { cn } from '@/lib/tw'
import { appDayJs } from '@/utils/dayjs'
import { CheckCheckIcon, PrinterIcon, SquarePenIcon, XCircleIcon } from 'lucide-react'

export interface TicketHistoryTimelineProps {
  data?: IIssuedTicketHistory[]
  ticketStatus?: IIssuedTicket['status']
  ticketExpiryDate?: IIssuedTicket['expiryDate']
}

const STATUS_ICON = {
  [ISSUED_TICKET_HISTORY_STATUS.VALID]: <PrinterIcon />,
  [ISSUED_TICKET_HISTORY_STATUS.EXPIRED]: <XCircleIcon />,
  [ISSUED_TICKET_HISTORY_STATUS.INVALID]: <XCircleIcon />,
  [ISSUED_TICKET_HISTORY_STATUS.QR_CODE_INVALID]: <XCircleIcon />,
  [ISSUED_TICKET_HISTORY_STATUS.PRINT]: <PrinterIcon />,
  [ISSUED_TICKET_HISTORY_STATUS.REPRINT]: <PrinterIcon />,
  [ISSUED_TICKET_HISTORY_STATUS.CREATED]: <SquarePenIcon />,
  [ISSUED_TICKET_HISTORY_STATUS.MARK_AS_USED]: <CheckCheckIcon />,
}

const TicketHistoryTimeline = ({ data, ticketStatus, ticketExpiryDate }: TicketHistoryTimelineProps) => {
  if (!data || data.length === 0) {
    return <Nothing />
  }

  return (
    <TimelineStepper
      steps={(
        data?.map((item) => ({
          title:
            item.status === ISSUED_TICKET_HISTORY_STATUS.VALID ||
            item.status === ISSUED_TICKET_HISTORY_STATUS.EXPIRED ? (
              <span className="font-medium">{ISSUED_TICKET_HISTORY_STATUS_LABEL[item.status]}</span>
            ) : (
              <span>
                {item?.createdBy && (
                  <span className="font-medium">
                    {typeof item?.createdBy === 'object'
                      ? `${item.createdBy?.lastName} ${item.createdBy?.firstName}`
                      : item?.createdByName || item?.createdBy || ''}{' '}
                  </span>
                )}
                <span className={cn('text-neutral-grey-400', item?.createdBy && 'lowercase')}>
                  {ISSUED_TICKET_HISTORY_STATUS_LABEL[item.status as keyof typeof ISSUED_TICKET_HISTORY_STATUS_LABEL]}
                </span>
                {typeof item?.posTerminalId === 'object' && (
                  <>
                    <span className={cn('text-neutral-grey-400', item?.createdBy && 'lowercase')}> tại</span>
                    <span className="font-medium"> {item?.posTerminalId?.ID}</span>
                  </>
                )}
              </span>
            ),

          description: appDayJs(item.createdAt).format('DD/MM/YYYY HH:mm:ss'),
          icon: STATUS_ICON[item.status],
          color:
            item.status === ISSUED_TICKET_HISTORY_STATUS.INVALID ||
            item.status === ISSUED_TICKET_HISTORY_STATUS.QR_CODE_INVALID ||
            item.status === ISSUED_TICKET_HISTORY_STATUS.EXPIRED
              ? ('destructive' as const)
              : ('default' as const),
          content: (item.status === ISSUED_TICKET_HISTORY_STATUS.INVALID ||
            item.status === ISSUED_TICKET_HISTORY_STATUS.QR_CODE_INVALID ||
            item.status === ISSUED_TICKET_HISTORY_STATUS.VALID) && (
            <StepperContent ticketStatus={ticketStatus} expiryDate={ticketExpiryDate} />
          ),
          date: appDayJs(item?.createdAt)?.toDate(),
        })) || []
      )
        ?.concat(
          ticketStatus === ISSUED_TICKET_STATUS.EXPIRED
            ? [
                {
                  title: (
                    <>
                      <span className="font-medium text-black">{ISSUED_TICKET_HISTORY_STATUS_LABEL.EXPIRED}</span>{' '}
                      <span className={cn('text-neutral-grey-400 lowercase')}>do quá thời gian sử dụng</span>
                    </>
                  ),
                  icon: STATUS_ICON[ISSUED_TICKET_HISTORY_STATUS.EXPIRED],
                  description: appDayJs(ticketExpiryDate)
                    .startOf('D')
                    .add(TICKET_VALID_TIME_TO_SECOND, 'second')
                    .format('DD/MM/YYYY HH:mm:ss'),
                  color: 'destructive' as const,
                  content: <StepperContent ticketStatus={ticketStatus} />,
                  date: appDayJs(ticketExpiryDate).startOf('D').add(TICKET_VALID_TIME_TO_SECOND, 'second').toDate(),
                },
              ]
            : [],
        )
        ?.sort((a, b) => appDayJs(b.date).diff(appDayJs(a.date)))}
    />
  )
}

const badgeVariant = {
  [ISSUED_TICKET_STATUS.USED]: 'warning',
  [ISSUED_TICKET_STATUS.UN_USED]: 'default',
  [ISSUED_TICKET_STATUS.EXPIRED]: 'destructive',
  [ISSUED_TICKET_STATUS.DELETED]: 'secondary',
} as Record<keyof typeof ISSUED_TICKET_STATUS, BadgeProps['variant']>

const StepperContent = ({
  ticketStatus,
  expiryDate,
}: {
  ticketStatus?: IIssuedTicket['status']
  expiryDate?: IIssuedTicket['expiryDate']
}) => {
  const startOfExpiry = appDayJs(expiryDate).startOf('D').add(TICKET_VALID_TIME_FROM_SECOND, 'second')
  const endOfExpiry = appDayJs(expiryDate).startOf('D').add(TICKET_VALID_TIME_TO_SECOND, 'second')

  if (expiryDate && appDayJs().isBefore(startOfExpiry)) {
    return <span className="text-neutral-grey-400">Lý do: Vé chưa có hiệu lực</span>
  }
  if (expiryDate && appDayJs().isAfter(endOfExpiry)) {
    return <span className="text-neutral-grey-400">Lý do: Vé đã hết hạn</span>
  }

  if (ticketStatus) {
    return (
      <span className="text-neutral-grey-400">
        Trạng thái:{' '}
        <Badge variant={badgeVariant?.[ticketStatus as keyof typeof badgeVariant] || 'default'} corner="full">
          {ISSUED_TICKET_STATUS_LABEL[ticketStatus as keyof typeof ISSUED_TICKET_STATUS_LABEL]}
        </Badge>
      </span>
    )
  }
  return null
}

export default TicketHistoryTimeline
