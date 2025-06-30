'use client'

import { Button } from '@/components/ui/button'
import BarCodeIcon from '@/components/widgets/icons/bar-code-icon'
import ListDashesFilledIcon from '@/components/widgets/icons/list-dashes-filled-icon'
import LogoIcon from '@/components/widgets/icons/logo-icon'
import ReceptFilledIcon from '@/components/widgets/icons/recept-filled-icon'
import { URLS } from '@/constants/urls'
import useIsLoading from '@/features/kios/hooks/use-is-loading'
import { UserDropDown } from '@/layouts/panel'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {}

const TicketLayout = ({ children, ...rest }: Props) => {
  const pathname = usePathname()

  const isLoading = useIsLoading()

  const isCanAccess = useCanAccess()

  const isCanAccessDashboard = isCanAccess(CASL_ACCESS_KEY.TICKET_DASHBOARD_VIEW)

  const logoHref = isCanAccessDashboard ? URLS.ADMIN.DASHBOARD : URLS.HOME

  return (
    <section className="flex justify-center h-svh">
      <div className="relative w-full max-w-screen-sm *:max-w-screen-sm flex flex-col">
        <header className={cn('sticky top-0 z-10 flex justify-between items-center px-4 bg-white')}>
          <Link href={logoHref} replace>
            <LogoIcon className="size-6" />
          </Link>
          <UserDropDown />
        </header>

        <div className="px-4 py-6 bg-[#e9e9e9] flex flex-col flex-1 relative">
          {children}
          <div
            className={cn(
              'bg-white/10 backdrop-blur-sm inset-0 absolute w-full h-full items-center justify-center',
              'transition-opacity duration-100 ease-out',
              isLoading ? 'opacity-100 flex' : 'opacity-0 hidden',
            )}
          >
            <Loader2 className="animate-spin text-green-700" />
          </div>
        </div>
        <nav
          className={cn(
            'sticky bottom-0 w-full z-10 flex justify-between items-center',
            'bg-white text-sm font-semibold text-[#a6a6a6]',
            '[&>*:nth-child(odd)]:flex [&>*:nth-child(odd)]:justify-center [&>*:nth-child(odd)]:items-center [&>*:nth-child(odd)]:gap-1',
            '[&>*:nth-child(even)]:h-4 [&>*:nth-child(even)]:border  [&>*:nth-child(even)]:border-[#e9e9e9]',
          )}
        >
          <Link
            href={URLS.TICKET.SEARCH}
            replace
            className={cn('flex-1 px-4', pathname === URLS.TICKET.SEARCH && 'text-[#388d3d]')}
          >
            <ListDashesFilledIcon className="size-5" />
            <div>Tra cứu</div>
          </Link>
          <div />
          <Link href={URLS.TICKET.SCAN} replace className="py-3 px-6 flex items-center justify-center ">
            <Button
              size="lg"
              variant="default"
              className="rounded-[18px] p-3 !size-12 !outline outline-2 outline-white shadow-[0px_20px_24px_-4px_rgba(9,9,11,0.1)] !bg-[#388d3d]"
            >
              <BarCodeIcon className="!size-6" />
            </Button>
          </Link>
          <div />
          <Link
            href={URLS.TICKET.HISTORY}
            replace
            className={cn('flex-1 px-4', pathname === URLS.TICKET.HISTORY && 'text-[#388d3d]')}
          >
            <ReceptFilledIcon className="size-5" />
            <div>Lịch sử</div>
          </Link>
        </nav>
      </div>
    </section>
  )
}

export default TicketLayout
