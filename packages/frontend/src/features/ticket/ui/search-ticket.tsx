'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import QRCodeIcon from '@/components/widgets/icons/qr-code-icon'
import { IssuedTicketStatusColor, IssuedTicketStatusLabel } from '@/constants/status'
import usePressScan from '@/hooks/use-press-scan'
import { useSearch } from '@/hooks/use-search'
import { useGetIssuedTicketByIssuedCode } from '@/lib/api/queries/ticket/get-issued-ticket-by-code'
import { cn } from '@/lib/tw'
import dayjs from 'dayjs'
import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useAudio } from 'react-use'

const SearchTicket = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useSearch()

  const [errorAudio, , controlError] = useAudio({
    src: '/sounds/error.mp3',
  })

  usePressScan({
    onEnter: (value) => {
      inputRef.current!.value = value
      setSearch(value)
      // const numberValue = value.replace(/[^0-9]/g, "");
      // if (numberValue?.length > 0) {
      //   if (inputRef.current === document.activeElement) {
      //     if (inputRef.current?.value && inputRef.current?.value?.length > 0) {
      //       setSearch(inputRef.current?.value);
      //     }
      //   } else {
      //     inputRef.current!.value = numberValue;
      //     setSearch(numberValue);
      //   }
      // }
    },
  })

  const { data, refetch, isError } = useGetIssuedTicketByIssuedCode({
    variables: {
      issuedCode: search || '',
    },
    enabled: !!search,
    retry: false,
    select: (data) => data.data,
  })

  useEffect(() => {
    if (isError) {
      controlError.play()
    }
  }, [isError])

  useEffect(() => {
    if (search) {
      inputRef.current!.value = search
      refetch()
    }
  }, [search])

  const ticketFields = useMemo(() => {
    if (!data) return []
    return [
      {
        label: 'Loại vé:',
        value: data.title,
      },
      {
        label: 'Ngày bán vé',
        value: dayjs(data.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      },
      {
        children: [
          {
            label: 'Thời gian hiệu lực',
            value: data.validFrom ? dayjs(data.validFrom).format('DD/MM/YYYY HH:mm:ss') : '',
          },
          {
            label: 'Thời gian hết hiệu lực',
            value: data.validTo ? dayjs(data.validTo).format('DD/MM/YYYY HH:mm:ss') : '',
          },
        ],
      },

      {
        children: [
          {
            label: 'Trạng thái',
            value: IssuedTicketStatusLabel[data.status as keyof typeof IssuedTicketStatusLabel],

            className: cn(
              'font-semibold',
              IssuedTicketStatusColor[data.status as keyof typeof IssuedTicketStatusColor],
            ),
          },
          {
            label: 'Thời gian sử dụng',
            value: data.usedAt ? dayjs(data.usedAt).format('DD/MM/YYYY HH:mm:ss') : '',
          },
        ],
      },

      {
        label: 'Mã vé',
        value: data.issuedCode,
      },
      {
        label: 'Mã tham chiếu',
        value: data.bookingId?.metadata?.invNo,
      },
      {
        label: 'Số hóa đơn',
        value: data.bookingCode,
      },
    ]
  }, [data])

  return (
    <div className="flex flex-col gap-4 flex-1">
      <h2 className="text-lg font-semibold">Tra cứu</h2>
      <Input
        ref={inputRef}
        className="bg-white"
        size="lg"
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            setSearch(inputRef.current?.value || '')
            inputRef.current?.blur()
          }
        }}
        suffix={
          <Button
            size="sm"
            className="bg-[#c1dcc3] text-[#388d3d] rounded-sm"
            variant="default"
            onClick={(e) => {
              setSearch(inputRef.current?.value || '')
            }}
          >
            <QRCodeIcon className="!size-6" />
          </Button>
        }
      />

      <div
        className={cn(
          'flex flex-col gap-1',
          '*:rounded-md *:bg-white *:p-3',
          '[&>*>p:nth-child(odd)]:text-xs [&>*>p:nth-child(odd)]:font-semibold [&>*>p:nth-child(odd)]:text-[#606060] ',
          '[&>*>p:nth-child(odd)]:mb-1 [&>*>p:nth-child(odd):not(:first-child)]:mt-3',
          '[&>*>p:nth-child(even)]:text-sm',
          !data && 'hidden',
        )}
      >
        {errorAudio}
        {ticketFields.map((field, index) => (
          <div key={index}>
            {field?.children?.length ? (
              field.children.map((child, index) => (
                <Fragment key={child.label}>
                  <p>{child.label}</p>
                  <p className={cn(child.className)}>{child.value || '-'}</p>
                </Fragment>
              ))
            ) : (
              <>
                <p>{field.label}</p>
                <p>{field.value || '-'}</p>
              </>
            )}
          </div>
        ))}
      </div>

      <div
        className={cn(
          'text-sm font-normal text-[#606060] flex flex-col justify-center items-center flex-1',
          data && 'hidden',
        )}
      >
        <div>{isError ? 'Không tìm thấy vé' : 'Vui lòng nhấn phím chức năng để tra cứu vé'}</div>
      </div>
    </div>
  )
}

export default SearchTicket
