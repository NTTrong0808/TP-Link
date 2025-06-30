'use client'

import { Button } from '@/components/ui/button'
import LogoIcon from '@/components/widgets/icons/logo-icon'
import TopRightArrowIcon from '@/components/widgets/icons/top-right-arrow-icon'
import { URLS } from '@/constants/urls'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ComponentProps, createContext, PropsWithChildren, useMemo } from 'react'
import { PanelHeaderButton, UserDropDown } from '../panel'

export interface KiosquePanelContextState {}

export const KiosquePanelContext = createContext<KiosquePanelContextState>({} as KiosquePanelContextState)

export interface KiosquePanelProps extends PropsWithChildren {}

export const KiosquePanel = ({ children }: KiosquePanelProps) => {
  const values = useMemo<KiosquePanelContextState>(() => ({}), [])

  return (
    <KiosquePanelContext.Provider value={values}>
      <main className="flex flex-col bg-neutral-grey-100 h-svh">{children}</main>
    </KiosquePanelContext.Provider>
  )
}

export interface KiosquePanelMenu extends PanelHeaderButton {
  target?: '_blank' | '_self' | '_parent' | '_top'
}

export interface KiosquePanelHeaderProps extends PropsWithChildren {
  menu: KiosquePanelMenu[]
}

export const KiosquePanelHeader = ({ menu }: KiosquePanelHeaderProps) => {
  const router = useRouter()

  const isCanAccess = useCanAccess()

  const isCanAccessDashboard = isCanAccess(CASL_ACCESS_KEY.TICKET_DASHBOARD_VIEW)

  const logoHref = isCanAccessDashboard ? URLS.ADMIN.DASHBOARD : URLS.HOME

  return (
    <header className="flex items-center h-15 w-full bg-neutral-white border-b border-low px-10">
      <Link href={logoHref}>
        <LogoIcon className="size-6" />
      </Link>
      <div className="ml-auto flex items-center gap-6 justify-between">
        <div className="hidden md:flex flex-col md:flex-row gap-3 justify-between items-end md:items-center">
          {menu
            ?.filter((item) => isCanAccess(item?.permissions))
            .map((item) => (
              <Link href={item?.url ?? '#'} key={item.label} target={item?.target}>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-neutral-grey-100/50"
                  type="button"
                  disabled={!item?.url || item?.disabled}
                  // onClick={() => item.url && router.push(item.url)}
                >
                  {item.label} <TopRightArrowIcon className="size-5" />
                </Button>
              </Link>
            ))}
        </div>
        <UserDropDown />
      </div>
    </header>
  )
}

export interface KiosquePanelContentProps extends ComponentProps<'article'> {}

export const KiosquePanelContent = ({ children, ...props }: KiosquePanelContentProps) => {
  return (
    <article {...props} className={cn('flex-1 grow h-10 p-4 overflow-auto', props.className)}>
      {children}
    </article>
  )
}
