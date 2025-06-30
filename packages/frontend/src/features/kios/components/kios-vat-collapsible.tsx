import { cn } from '@/lib/tw'
import { ChevronDownIcon } from 'lucide-react'
import { useWatch } from 'react-hook-form'
import { useToggle } from 'react-use'
import { useFormContext } from '../hooks/use-form-context'
import KiosDivider from './kios-divider'

export interface KiosVatCollapsibleProps {}

const KiosVatCollapsible = ({}: KiosVatCollapsibleProps) => {
  const [open, toggle] = useToggle(false)
  const form = useFormContext()

  const [vat, customer] = useWatch({ control: form.control, name: ['vat', 'customer'] })

  const vatData = [
    {
      label: 'Mã số thuế',
      value: vat?.taxCode,
    },
    {
      label: 'Tên công ty / cá nhân',
      value: vat?.companyName || customer?.name,
    },
    {
      label: 'Địa chỉ',
      value: vat?.address || customer?.address,
    },
    {
      label: 'Email',
      value: vat?.email || customer?.email,
    },
    {
      label: 'Ghi chú',
      value: vat?.note,
    },
  ]
  return (
    vat?.taxCode &&
    vat?.companyName &&
    vat?.address && (
      <>
        <KiosDivider />
        <div
          className={cn(
            'bg-neutral-grey-50 rounded-xl p-4',
            'flex flex-col gap-2 relative',
            'transition-all duration-300 ease-in',
            // !(vat?.taxCode && vat?.companyName && vat?.address) && 'hidden',
          )}
        >
          <p className="font-semibold">Thông tin xuất VAT</p>
          <div
            className={cn(
              'flex flex-col gap-1 px-4 overflow-hidden',
              open ? 'max-h-svh ease-in' : 'max-h-[100px] ease-out',
              'transition-all duration-300',
            )}
          >
            {vatData.map((item) => (
              <div key={item.label} className="text-sm">
                <p className="font-semibold text-neutral-grey-500">{item.label}</p>
                <p className="text-neutral-grey-400">{item.value}</p>
              </div>
            ))}
          </div>
          <div
            className="sticky bottom-0  w-full flex items-center justify-center gap-1 text-center text-sm text-neutral-grey-400 bg-neutral-grey-50 cursor-pointer"
            onClick={() => toggle(!open)}
          >
            {open ? 'Rút gọn' : 'Hiển thị thêm'}
            <ChevronDownIcon
              className={cn('size-4 transition-transform duration-300 ease-in-out', open ? '-rotate-180' : '')}
            />
          </div>
        </div>
      </>
    )
  )
}

export default KiosVatCollapsible
