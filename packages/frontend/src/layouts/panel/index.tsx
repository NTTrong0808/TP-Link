'use client'

import {
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuDrawer,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader } from '@/components/ui/sidebar'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarProvider } from '@/components/ui/sidebar'
import LeftArrowIcon from '@/components/widgets/icons/left-arrow-icon'
import LogoIcon from '@/components/widgets/icons/logo-icon'
import TopRightArrowIcon from '@/components/widgets/icons/top-right-arrow-icon'
import UserCircleFilledIcon from '@/components/widgets/icons/user-circle-filled-icon'
import { URLS, URLS_TITLE } from '@/constants/urls'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { useAuth } from '@/lib/auth/context'
import { cn } from '@/lib/tw'
import { KeyIcon, LogOutIcon, QrCodeIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

const sidebarWidth = '56px'

export interface PanelContextType {
  title: string
  setTitle: (title: string) => void
  isBack: boolean
  setIsBack: (isBack: boolean) => void
}

export const PanelContext = createContext<PanelContextType>({
  title: 'Page Title',
  setTitle: () => {},
  isBack: false,
  setIsBack: () => {},
})

export const usePanelContext = () => {
  return useContext(PanelContext)
}

export interface PanelProps extends PropsWithChildren {
  defaultTitle?: string
  defaultIsBack?: boolean
  defaultBackText?: string
}

export const Panel = ({ children, defaultTitle = 'Page Title', defaultIsBack = false }: PanelProps) => {
  const pathname = usePathname()
  const [title, setTitle] = useState(defaultTitle)
  const [isBack, setIsBack] = useState(defaultIsBack)

  const values = useMemo<PanelContextType>(
    () => ({
      title,
      setTitle,
      isBack,
      setIsBack,
    }),
    [title, isBack, pathname],
  )

  useEffect(() => {
    const matchingPath = Object.keys(URLS_TITLE).find((path) => {
      const pattern = path.replace(/:\w+/g, '[^/]+')
      return new RegExp(`^${pattern}$`).test(pathname!)
    })
    if (matchingPath) {
      setTitle(URLS_TITLE[matchingPath as keyof typeof URLS_TITLE] || defaultTitle)
    }
    return () => {
      setTitle(defaultTitle)
    }
  }, [pathname])

  return (
    <PanelContext.Provider value={values}>
      <SidebarProvider
        style={
          {
            '--sidebar-width': sidebarWidth,
          } as React.CSSProperties
        }
      >
        {children}
      </SidebarProvider>
    </PanelContext.Provider>
  )
}

export interface PanelHeaderButton {
  label: string
  icon?: React.ElementType
  url?: string
  permissions?: string[]
  className?: string
  onClick?: () => void
  disabled?: boolean
}

// TODO: Edit header buttons
const HEADER_BUTTONS: PanelHeaderButton[] = [
  {
    label: 'Quản lý cấu hình',
    icon: SettingsIcon,
    url: URLS.ADMIN.CONFIGURATION,
    permissions: [CASL_ACCESS_KEY.TICKET_SERVICE_AND_SERVICE_PRICE_LIST],
  },
  {
    label: 'Bán vé',
    url: URLS.KIOS.INDEX,
    permissions: [
      CASL_ACCESS_KEY.TICKET_OFFLINE_SALE_ACCESS,
      CASL_ACCESS_KEY.TICKET_OFFLINE_SALE_ACCESS_DAY_ONLY,
      CASL_ACCESS_KEY.TICKET_OFFLINE_CREATE_BOOKING_PAY_LATER,
    ],
  },
  {
    label: 'Soát vé',
    icon: QrCodeIcon,
    url: URLS.TICKET.SCAN,
    permissions: [CASL_ACCESS_KEY.TICKET_INSPECTATION],
  },
]

export interface PanelHeaderProps extends PropsWithChildren {
  user?: {
    avatar?: string
    name?: string
  }
}

export const PanelHeader = ({ user }: PanelHeaderProps) => {
  const { title, isBack } = usePanelContext()
  const router = useRouter()
  const isCanAccess = useCanAccess()
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.style.setProperty('--panel-header-height', `${headerRef.current?.offsetHeight}px`)
    document.documentElement.style.setProperty('--sidebar-width', sidebarWidth)
  }, [headerRef.current])

  const isCanBack = isBack && window && window?.history && window?.history?.length > 1

  return (
    <header className="sticky top-0 bg-white m-h-15 z-[2]" ref={headerRef}>
      <div className="flex shrink-0 items-center gap-2 border-b p-4 bg-white z-[2]">
        <h1 className={cn('text-lg font-semibold overflow-hidden text-ellipsis flex-1')}>{title}</h1>
        <div className="hidden md:flex flex-col md:flex-row gap-3 justify-between items-end md:items-center">
          {HEADER_BUTTONS.filter((item) => isCanAccess(item?.permissions)).map((item) => (
            <Link href={item.url ?? '#'} key={item.label}>
              <Button
                variant="outline"
                size="sm"
                className="bg-neutral-grey-100/50"
                type="button"
                disabled={!item.url || item.disabled}
                // onClick={() => item.url && router.push(item.url)}
              >
                {item.label} <TopRightArrowIcon className="size-5" />
              </Button>
            </Link>
          ))}
        </div>
        <UserDropDown user={user} />
      </div>

      <div
        className={cn(
          'sticky top-0 flex justify-between shrink-0 items-center border-b bg-background px-3 py-2',
          !isCanBack && 'hidden',
        )}
      >
        {isCanBack && (
          <div
            onClick={() => {
              if (isCanBack) {
                router.back()
              }
            }}
            className="flex items-center gap-2 text-sm font-medium cursor-pointer h-8"
          >
            <LeftArrowIcon className="text-neutral-400 h-6 w-6" />
            Quay lại
          </div>
        )}
      </div>
    </header>
  )
}

export const UserDropDown = ({ user }: PanelHeaderProps) => {
  const { signOut, currentUser } = useAuth()
  const router = useRouter()

  const isCanAccess = useCanAccess()
  const profileMenu: PanelHeaderButton[] = useMemo(
    () => [
      ...HEADER_BUTTONS.filter((item) => isCanAccess(item?.permissions)),
      {
        label: 'Đổi mật khẩu',
        icon: KeyIcon,
        url: URLS.ADMIN.PROFILE.CHANGE_PASSWORD,
      },
      {
        label: 'Đăng xuất',
        icon: LogOutIcon,
        onClick: () => {
          signOut()
        },
      },
    ],
    [currentUser],
  )
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {user ? (
          <Avatar role="button" className="rounded-md cursor-pointer">
            <AvatarFallback className="rounded-md bg-green-200 text-green-700 font-semibold">
              {user?.name?.slice(0, 1)?.toUpperCase() || 'A'}
            </AvatarFallback>
            <AvatarImage src={user?.avatar} className="rounded-md" />
          </Avatar>
        ) : (
          <div
            className={cn(
              'size-fit rounded-full p-1 my-3.5 border outline outline-1 outline-[#e9e9e9] cursor-pointer',
              'bg-neutral-100',
            )}
          >
            <UserCircleFilledIcon className="size-6 text-[#606060]" />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          {currentUser?.lastName} {currentUser?.firstName}
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>{currentUser?.username || currentUser?.email}</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {profileMenu.map((menuItem) => (
          <DropdownMenuItem
            key={menuItem.label}
            className={cn('cursor-pointer', menuItem.permissions && 'md:hidden', menuItem.className)}
            onClick={menuItem.onClick ?? (() => menuItem.url && router.push(menuItem.url))}
          >
            {menuItem.icon ? <menuItem.icon /> : <TopRightArrowIcon />}
            {menuItem.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export interface PanelContentProps extends PropsWithChildren, React.ComponentProps<'div'> {
  header?: React.ReactNode
}

export const PanelContent = ({ children, header, ...props }: PanelContentProps) => {
  return (
    <SidebarInset className="max-w-[calc(100%-var(--sidebar-width))]">
      {header}
      <div {...props} className={cn(props.className)}>
        {children}
      </div>
    </SidebarInset>
  )
}

export interface PanelSidebarItem {
  url: string
  icon?: React.ElementType
  isActive: boolean
  children?: Omit<PanelSidebarItem, 'children'>[]
  label?: string
  tooltip?: string
  permissions?: string[]
}

export interface PanelSidebarProps extends React.ComponentProps<typeof Sidebar> {
  items: PanelSidebarItem[]
}

export interface PanelTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  title?: string
}

export function PanelSidebar({ items = [], ...props }: PanelSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isCanAccess = useCanAccess()

  const [activeItem, setActiveItem] = useState<PanelSidebarItem | undefined>(items?.[0])

  const { setOpen, subMenu, setSubMenu, setSubMenuLabel, activeItemUrl, setActiveItemUrl } = useSidebar()

  useLayoutEffect(() => {
    const activeItem = items.find(
      (item) =>
        pathname.startsWith(item.url.slice(0, item.url.indexOf('/:id'))) ||
        item?.children?.some((child) => pathname.startsWith(child.url.slice(0, child.url.indexOf('/:id')))),
    )
    setActiveItem(activeItem)
    setActiveItemUrl(activeItem?.url || '')
  }, [])

  return (
    <Sidebar collapsible="icon" className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row" {...props}>
      <Sidebar collapsible="none">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center justify-center">
              <SidebarMenuButton
                size="lg"
                asChild
                // className="md:h-8 md:p-0"
              >
                <LogoIcon className="mx-auto" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent
            // className="px-1.5 md:px-0"
            >
              <SidebarMenu>
                {items
                  .filter((item) => isCanAccess(item?.permissions))
                  .map((item, idx) => {
                    const label = item.label ? item.label : URLS_TITLE[item.url as keyof typeof URLS_TITLE]
                    return (
                      <SidebarMenuItem key={`${item.url}-${idx}`}>
                        <SidebarMenuButton
                          onClick={() => {
                            setActiveItem(item)
                            setActiveItemUrl(item.url)
                            setSubMenuLabel(label)
                            setSubMenu(item.children || [])
                            if (item.children) {
                              setOpen((prev) => !prev)
                            } else {
                              router.push(item.url)
                            }
                          }}
                          tooltip={item.tooltip ?? label}
                          label={label}
                          isActive={activeItem?.url === item.url}
                          // className="px-2.5 md:px-2"
                        >
                          {item.icon && <item.icon />}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarMenuDrawer />
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
