import DashedLine from '@/components/widgets/dashed-line'
import TicketLangfarmImage from '@/components/widgets/icons/ticket-langfarm-image'
import { cn } from '@/lib/tw'
import React, { Ref, useImperativeHandle, useRef } from 'react'

export interface PrintLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

const PrintLayout = ({ ref, children, className }: PrintLayoutProps) => {
  const printRef = useRef<HTMLDivElement | null>(null)

  useImperativeHandle(ref, () => printRef.current as HTMLDivElement)

  const data = {
    langfarm: [
      { label: 'Địa chỉ', value: '1B Hoàng Văn Thụ, Phường 5, TP. Đà Lạt, Tỉnh Lâm Đồng' },
      { label: 'Hotline', value: '0931904904' },
      { label: 'Website', value: 'www.langfarmcenter.com' },
      { label: 'Email', value: 'center@langfarm.com' },
    ],
  }

  return (
    <div
      className={cn(
        // arimo.className,
        'flex h-full w-full items-center justify-center bg-white text-pretty text-justify text-[10px] text-neutral-black',
        'print:break-inside-avoid print:break-after-page last:print:break-after-auto',
        className,
      )}
      ref={printRef}
    >
      <div className={cn('w-full max-w-[300px] h-fit p-5 flex flex-col gap-2 mx-auto')}>
        <div className="flex flex-col gap-1">
          {/* Langfarm Title */}
          <div className="font-semibold font-langfarm">
            <div className="text-base">Langfarm Center</div>
            <div className="text-xl">Nông trại cổ tích</div>
          </div>

          {/* Langfarm Info */}
          <div className=" -xs">
            {data.langfarm.map((item) => (
              <div key={item.label} className="leading-4">
                <span className="font-semibold before:content-['|'] before:mr-0.5 after:content-[':'] after:mr-0.5">
                  {item.label}
                </span>
                {item.value}
              </div>
            ))}
          </div>
          <DashedLine />
        </div>

        {children}

        {/* Langfarm Image */}
        <TicketLangfarmImage className="w-full" />

        {/* Langfarm Footer */}
        <div className="leading-4">
          <div className="">Cảm ơn quý khách hàng đã sử dụng dịch vụ của Langfarm Center!</div>
          <div className="font-semibold font-langfarm text-sm">Powered by Whammy Tech</div>
        </div>

        <DashedLine className="border-neutral-grey-50 mt-5" />
      </div>
    </div>
  )
}

export default PrintLayout
