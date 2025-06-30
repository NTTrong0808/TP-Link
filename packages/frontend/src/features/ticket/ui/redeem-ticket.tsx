'use client'

import WarningCircleFilledIcon from '@/components/widgets/icons/warning-circle-filled-icon'
import { ComponentProps, Fragment, memo, useMemo, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CheckedCircleFilledIcon from '@/components/widgets/icons/checked-circle-filled-icon'
import QRCodeIcon from '@/components/widgets/icons/qr-code-icon'
import { toastError } from '@/components/widgets/toast'
import { IssuedTicketHistoryStatusColor, IssuedTicketHistoryStatusLabel } from '@/constants/status'
import { TICKET_VALID_TIME_TO_SECOND } from '@/helper/ticket'
import { useRedeemTicketMutation } from '@/lib/api/queries/ticket/redeem-ticket'
import { IIssuedTicketHistory, ISSUED_TICKET_HISTORY_STATUS } from '@/lib/api/queries/ticket/schema'
import { cn } from '@/lib/tw'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useAudio } from 'react-use'

export const RedeemTicket = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [ticketResult, setTicketResult] = useState<Partial<IIssuedTicketHistory> | undefined>()

  const [successAudio, , controlSuccess] = useAudio({
    src: '/sounds/success.mp3',
  })
  const [errorAudio, , controlError] = useAudio({
    src: '/sounds/error.mp3',
  })

  const { mutateAsync: checkTicket } = useRedeemTicketMutation()

  const handleRedeemTicket = async (value: string) => {
    try {
      const { data } = await checkTicket({ issuedCode: value })
      setTicketResult(data)
      if (data?.status === ISSUED_TICKET_HISTORY_STATUS.VALID) {
        controlSuccess.play()
      } else {
        controlError.play()
      }
    } catch (error) {
      setTicketResult({
        status: ISSUED_TICKET_HISTORY_STATUS.QR_CODE_INVALID,
      })
      controlError.play()
      toastError('Lỗi hệ thống')
    }
  }

  const ticketDetailField = useMemo(() => {
    return [
      {
        label: 'Loại vé',
        value: ticketResult?.title,
      },
      {
        label: 'Ngày bán vé',
        value: ticketResult?.purchasedAt ? dayjs(ticketResult?.purchasedAt).format('DD/MM/YYYY HH:mm:ss') : '',
      },
      {
        label: 'Thời gian sử dụng',
        value: ticketResult?.usedAt ? dayjs(ticketResult?.usedAt).format('DD/MM/YYYY HH:mm:ss') : '',
      },
      {
        label: 'Hạn sử dụng',
        value: ticketResult?.expiryDate
          ? dayjs(ticketResult?.expiryDate)
              .startOf('day')
              .add(TICKET_VALID_TIME_TO_SECOND, 'second')
              .format('DD/MM/YYYY HH:mm')
          : '',
      },
      {
        label: 'Mã vé',
        value: ticketResult?.issuedCode,
      },
      {
        label: 'Số hóa đơn',
        value: ticketResult?.bookingCode || '-',
      },
    ].filter((item) => item.value)
  }, [ticketResult])

  return (
    <div
      className={cn(
        'flex-1 flex flex-col gap-4 items-center',
        (!ticketResult || ticketResult?.status === ISSUED_TICKET_HISTORY_STATUS.QR_CODE_INVALID) && 'justify-center',
      )}
    >
      {successAudio}
      {errorAudio}
      <Input
        ref={inputRef}
        className="bg-white"
        size="lg"
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleRedeemTicket(inputRef.current?.value || '')
            inputRef.current?.blur()
          }
        }}
        suffix={
          <Button
            size="sm"
            className="bg-[#c1dcc3] text-[#388d3d] rounded-sm"
            variant="default"
            onClick={(e) => {
              handleRedeemTicket(inputRef.current?.value || '')
            }}
          >
            <QRCodeIcon className="!size-6" />
          </Button>
        }
      />
      <div
        className={cn(
          'bg-white p-3 rounded-md inline-flex items-center gap-2 w-full text-sm',
          IssuedTicketHistoryStatusColor[ticketResult?.status as keyof typeof IssuedTicketHistoryStatusColor] ||
            IssuedTicketHistoryStatusColor.INVALID,
          !ticketResult?.status && 'hidden',
        )}
      >
        {ticketResult?.status === ISSUED_TICKET_HISTORY_STATUS.VALID ? (
          <CheckedCircleFilledIcon className="size-6" />
        ) : (
          <WarningCircleFilledIcon className="size-6" />
        )}
        <div>
          <p className="font-semibold">
            {IssuedTicketHistoryStatusLabel[ticketResult?.status as keyof typeof IssuedTicketHistoryStatusLabel] ||
              IssuedTicketHistoryStatusLabel.QR_CODE_INVALID}
          </p>
          <p className={cn('text-[#606060] font-normal', !ticketResult?.reason && 'hidden')}>{ticketResult?.reason}</p>
        </div>
      </div>
      <div
        className={cn(
          'rounded-md p-3 w-full bg-white',
          'flex-col gap-3',
          '[&>*>p:nth-child(odd)]:text-xs [&>*>p:nth-child(odd)]:font-semibold [&>*>p:nth-child(odd)]:text-[#606060] ',
          '[&>*>p:nth-child(odd)]:mb-1 [&>*>p:nth-child(odd):not(:first-child)]:mt-3',
          '[&>*>p:nth-child(even)]:text-sm',
          !ticketResult || ticketResult?.status === ISSUED_TICKET_HISTORY_STATUS.QR_CODE_INVALID ? 'hidden' : 'flex',
        )}
      >
        {ticketDetailField.map((item, index) => (
          <Fragment key={item.label}>
            {index !== 0 && <Line />}
            <div>
              <p>{item.label}</p>
              <p>{item.value || '-'}</p>
            </div>
          </Fragment>
        ))}
      </div>
      <div className="text-sm text-[#616161]">
        {ticketResult?.status ? 'Nhấn phím chức năng để soát vé tiếp theo' : 'Vui lòng nhấn phím chức năng để soát vé'}
      </div>
    </div>
  )
}

const Line = memo((props: ComponentProps<'div'>) => {
  return <div className="w-full h-[1px] bg-[#e9e9e9]" {...props} />
})

Line.displayName = 'Line'
