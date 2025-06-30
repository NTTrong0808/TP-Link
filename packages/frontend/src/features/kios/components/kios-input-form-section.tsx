import { PropsWithChildren } from 'react'

export interface KiosInputFormSectionProps extends PropsWithChildren {
  title?: string
}

const KiosInputFormSection = ({ children, title }: KiosInputFormSectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      {title && <div className="text-xs font-semibold text-neutral-grey-400 bg-neutral-grey-50 px-2 py-1">{title}</div>}
      {children}
    </div>
  )
}

export default KiosInputFormSection
