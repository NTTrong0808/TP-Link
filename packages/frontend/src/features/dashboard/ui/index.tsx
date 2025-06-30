'use client'

import { PanelView } from '@/layouts/panel/panel-view'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { ComponentProps } from 'react'
import OverallRoot from '../components/overall-root'
import Welcome from '../components/welcome'

// const OverallRoot = dynamic(() => import('../components/overall-root'), {
//   ssr: true,
//   loading: () => <AuthLoading />,
// })

export interface DashboardProps extends ComponentProps<'div'> {}

const Dashboard = (props: DashboardProps) => {
  const canAccess = useCanAccess()

  const isCanAccessDashboard = canAccess([CASL_ACCESS_KEY.TICKET_DASHBOARD_VIEW, CASL_ACCESS_KEY.TICKET_DASHBOARD])

  return isCanAccessDashboard ? (
    // <Tabs
    //   defaultValue="overview"
    //   className={cn(
    //     'flex flex-col h-full',
    //     "[&>[role='tabpanel']]:bg-neutral-grey-50",
    //     "[&>[role='tabpanel']]:grow [&>[role='tabpanel']]:h-10",
    //   )}
    // >
    //   <TabsList
    //     className={cn(
    //       'h-13 pt-3 px-4 flex gap-5 border-b border-low',
    //       '[&>*]:text-sm [&>*]:font-medium',
    //       '[&>*[data-state=active]]:border-b-2',
    //       '[&>*[data-state=active]]:border-green-500 [&>*]:h-10',
    //     )}
    //   >
    //     <TabsTrigger value="overview">Doanh thu</TabsTrigger>
    //     {/* <TabsTrigger value="report">Tài chính</TabsTrigger> */}
    //   </TabsList>
    //   <PanelView className="overflow-auto">
    //     <TabsContent value="overview">
    //       <OverallRoot />
    //     </TabsContent>
    //     {/* <TabsContent value="report">
    //       <OverallReport />
    //     </TabsContent> */}
    //   </PanelView>
    // </Tabs>
    <PanelView className="overflow-auto">
      <OverallRoot />
    </PanelView>
  ) : (
    <Welcome />
  )
}

export default Dashboard
