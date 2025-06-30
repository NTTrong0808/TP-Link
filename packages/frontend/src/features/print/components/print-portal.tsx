import { cn } from '@/lib/tw'
import { ComponentProps } from 'react'
import { createPortal } from 'react-dom'
import { PrintType } from '../types'

type PrintPortalProps = ComponentProps<'div'> & {
  type?: PrintType
  isView?: boolean
}

const PrintPortal = ({ children, className, type, isView = false, ...props }: PrintPortalProps) => {
  if (isView) {
    return children
  }
  return createPortal(
    <div className={cn('hidden', type)} {...props}>
      <div className={cn('print:break-inside-avoid print:break-after-page last:print:break-after-auto', className)}>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default PrintPortal
