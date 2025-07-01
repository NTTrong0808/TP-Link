'use client'

import ClipboardTextIcon from '@/components/widgets/icons/clipboard-text-icon'
import ListDashesIcon from '@/components/widgets/icons/list-dashes-icon'
import PieChartIcon from '@/components/widgets/icons/pie-chart-icon'
import SquareFourIcon from '@/components/widgets/icons/square-four-icon'
import TicketIcon from '@/components/widgets/icons/ticket-icon'
import UserIcon from '@/components/widgets/icons/user-icon'
import UserListIcon from '@/components/widgets/icons/user-list-icon'
import WalletIcon from '@/components/widgets/icons/wallet-icon'
import { URLS } from '@/constants/urls'
import { Panel, PanelContent, PanelHeader, PanelSidebar, PanelSidebarItem } from '@/layouts/panel'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { useAuth } from '@/lib/auth/context'
import { Settings } from 'lucide-react'
import { PropsWithChildren } from 'react'

const sidebarItems: PanelSidebarItem[] = [
  {
    url: URLS.ADMIN.DASHBOARD,
    icon: SquareFourIcon,
    isActive: true,
    permissions: [CASL_ACCESS_KEY.TICKET_DASHBOARD_VIEW],
  },
  {
    url: URLS.ADMIN.USER.INDEX,
    icon: UserListIcon,
    isActive: true,
    permissions: [CASL_ACCESS_KEY.TICKET_VIEW_USERS],
  },
  {
    url: URLS.ADMIN.CUSTOMER.INDEX,
    icon: UserIcon,
    isActive: false,
    permissions: [CASL_ACCESS_KEY.TICKET_CUSTOMER_VIEW],
  },
  {
    url: URLS.ADMIN.ORDER.INDEX,
    icon: ListDashesIcon,
    isActive: false,
    permissions: [CASL_ACCESS_KEY.TICKET_ORDER_VIEW],
  },

  {
    url: URLS.ADMIN.CONFIGURATION,
    icon: Settings,
    isActive: false,
    permissions: [
      CASL_ACCESS_KEY.TICKET_POS_TERMINAL_VIEW,
      CASL_ACCESS_KEY.TICKET_SALE_CHANNEL_VIEW,
      CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_VIEW,
      CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_BANK_ACCOUNT_VIEW,
    ],
  },
]

const Layout = ({ children }: PropsWithChildren) => {
  const { currentUser } = useAuth()

  return (
    <Panel>
      <PanelSidebar items={sidebarItems} />
      <PanelContent
        header={
          <PanelHeader
            user={{
              avatar: undefined,
              name: `${currentUser?.lastName} ${currentUser?.firstName}`.trim(),
            }}
          />
        }
        className="max-w-full overflow-auto flex-1"
      >
        {children}
      </PanelContent>
    </Panel>
  )
}

export default Layout
