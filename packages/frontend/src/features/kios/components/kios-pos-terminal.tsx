'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toastError } from '@/components/widgets/toast'
import { useGetTerminals } from '@/lib/api/queries/pos-terminal/get-pos-terminals'
import { ILCPosTerminal, PosTerminalStatus } from '@/lib/api/queries/pos-terminal/schema'
import { cn } from '@/lib/tw'
import { useState } from 'react'
import { usePosTerminal } from '../store/use-pos-terminal'

const KiosPosTerminal = () => {
  const { data: posTerminalRes, isPending } = useGetTerminals({
    variables: {
      status: [PosTerminalStatus.ACTIVED],
    },
  })
  const [choosenPos, setChoosenPos] = useState<ILCPosTerminal>()
  const { choosenPosTerminal } = usePosTerminal()

  const posTerminals = posTerminalRes?.data

  const onChangeChoosenPos = (pos: ILCPosTerminal) => {
    if (pos.status === PosTerminalStatus.ACTIVED) {
      setChoosenPos(pos)
    }
  }

  const handleSubmitPos = () => {
    if (!choosenPos) {
      toastError('Vui lòng chọn máy POS')
      return
    }
    choosenPosTerminal(choosenPos)
  }

  return (
    <div className="w-full h-full flex justify-center bg-white rounded-lg p-6">
      <div className="flex flex-col border-[1px] border-[#EAEAEA] rounded-lg min-w-[1000px]">
        <div className="border-b-[1px] border-[#EAEAEA] px-6 py-2 font-semibold bg-[#F5F5F5]">POS Terminal</div>
        <div className="p-6 flex flex-col gap-6 w-full">
          <h2 className="text-lg font-semibold w-full text-center">Lựa chọn POS Terminal</h2>
          <div className="flex-1 grid grid-cols-2 flex-col gap-6 overflow-auto max-h-[calc(100vh-60px-32px-48px-148px-52px)] h-full">
            {isPending
              ? [1, 2, 3, 4, 5, 6].map((index) => (
                  <Skeleton className="min-h-[180px] h-[180px] w-full" key={`pos-loading-${index}`} />
                ))
              : posTerminals?.map((pos) => (
                  <div
                    key={`pos-${pos.ID}`}
                    className={cn(
                      'px-4 py-[14px] rounded-lg flex flex-col gap-2 border border-neutral-grey-200 hover:cursor-pointer relative duration-200 transition-all',
                      choosenPos?._id === pos._id && 'border-[3px] border-green-500',
                    )}
                    onClick={() => onChangeChoosenPos(pos)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{pos.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm text-neutral-400">
                        <b className="font-semibold text-neutral-grey-500">ID:</b> {pos.ID}
                      </p>
                      <p className="text-sm text-neutral-400">
                        <b className="font-semibold text-neutral-grey-500">Địa điểm:</b> {pos.location}
                      </p>
                      <p className="text-sm text-neutral-400">
                        <b className="font-semibold text-neutral-grey-500">Thiết bị thanh toán:</b> {pos.posCode}
                      </p>
                      <p className="text-sm flex flex-col">
                        <b className="font-semibold text-neutral-grey-500">Thiết bị ngoại vi:</b>
                        {pos.otherDevices?.map((device) => (
                          <span key={`device-${device}`} className="text-neutral-400">
                            {device}
                          </span>
                        ))}
                      </p>
                    </div>
                    {choosenPos?._id === pos._id && (
                      <p className="rounded-br-md rounded-tl-md px-4 py-2 bg-green-500 text-green-50 flex items-center gap-1 w-fit absolute bottom-0 right-0">
                        Đã chọn{' '}
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path
                            d="M1 4L3.66667 7L9 1"
                            stroke="#EBF4EC"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </p>
                    )}
                  </div>
                ))}
          </div>
          <Button onClick={handleSubmitPos}>Tiếp tục</Button>
        </div>
      </div>
    </div>
  )
}

type ChipProps = {
  status: PosTerminalStatus
}
const Chip = ({ status }: ChipProps) => {
  const mapping = {
    [PosTerminalStatus.ACTIVED]: 'Đang hoạt động',
    [PosTerminalStatus.INACTIVED]: 'Không hoạt động',
    [PosTerminalStatus.MAINTENANCE]: 'Đang bảo trì',
  }
  const mappingIcon = {
    [PosTerminalStatus.ACTIVED]: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M16.9291 12.8701C17.306 11.9602 17.5 10.9849 17.5 10C17.5 8.01088 16.7098 6.10322 15.3033 4.6967C13.8968 3.29018 11.9891 2.5 10 2.5C8.01088 2.5 6.10322 3.29018 4.6967 4.6967C3.29018 6.10322 2.5 8.01088 2.5 10C2.5 10.9849 2.69399 11.9602 3.0709 12.8701C3.44781 13.7801 4.00026 14.6069 4.6967 15.3033C5.39314 15.9997 6.21993 16.5522 7.12987 16.9291C8.03982 17.306 9.01509 17.5 10 17.5C10.9849 17.5 11.9602 17.306 12.8701 16.9291C13.7801 16.5522 14.6069 15.9997 15.3033 15.3033C15.9997 14.6069 16.5522 13.7801 16.9291 12.8701Z"
          fill="#388D3D"
        />
        <path
          d="M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 10.9849 17.306 11.9602 16.9291 12.8701C16.5522 13.7801 15.9997 14.6069 15.3033 15.3033C14.6069 15.9997 13.7801 16.5522 12.8701 16.9291C11.9602 17.306 10.9849 17.5 10 17.5C9.01509 17.5 8.03982 17.306 7.12987 16.9291C6.21993 16.5522 5.39314 15.9997 4.6967 15.3033C4.00026 14.6069 3.44781 13.7801 3.0709 12.8701C2.69399 11.9602 2.5 10.9849 2.5 10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.29018 15.3033 4.6967C16.7098 6.10322 17.5 8.01088 17.5 10Z"
          stroke="#EBF4EC"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    [PosTerminalStatus.INACTIVED]: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
          fill="#DC2626"
          stroke="#FECACA"
          strokeWidth="1.5"
          strokeMiterlimit="10"
        />
        <path d="M6.875 10H13.125" stroke="#FECACA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    [PosTerminalStatus.MAINTENANCE]: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
        <path
          d="M14.7734 14.8333H3.22673C1.94339 14.8333 1.14173 13.4441 1.78339 12.3333L7.55673 2.33331C8.19839 1.22247 9.80173 1.22247 10.4434 2.33331L16.2167 12.3333C16.8584 13.4441 16.0567 14.8333 14.7734 14.8333Z"
          fill="#F79009"
        />
        <path
          d="M9.00006 6.49998L9.00839 9.41664M9.00006 11.5H9.00839M3.22673 14.8333H14.7734C16.0567 14.8333 16.8584 13.4441 16.2167 12.3333L10.4434 2.33331C9.80173 1.22247 8.19839 1.22247 7.55673 2.33331L1.78339 12.3333C1.14173 13.4441 1.94339 14.8333 3.22673 14.8333Z"
          stroke="#FFDDB1"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  }
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-1 px-2 py-1 rounded-sm text-xs',
        status === PosTerminalStatus.ACTIVED && 'text-green-500 bg-green-50',
        status === PosTerminalStatus.INACTIVED && 'text-[#DC2626] bg-[#FECACA]',
        status === PosTerminalStatus.MAINTENANCE && 'text-[#D46D0D] bg-[#FFDDB1]',
      )}
    >
      {mapping[status]}
      {mappingIcon[status]}
    </div>
  )
}

export default KiosPosTerminal
