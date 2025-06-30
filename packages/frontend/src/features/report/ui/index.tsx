import { PanelView } from '@/layouts/panel/panel-view'
import { AuthLoading } from '@/lib/auth/components'
import dynamic from 'next/dynamic'
import { ComponentProps } from 'react'

const Report = dynamic(() => import('../components/report'), {
  ssr: true,
  loading: () => <AuthLoading />,
})

export interface ReportProps extends ComponentProps<'div'> {}

const ReportIndex = (props: ReportProps) => {
  return (
    <PanelView className="overflow-auto">
      <Report />
    </PanelView>
  )
  // return (
  //   <Tabs
  //     defaultValue="report"
  //     className={cn(
  //       'flex flex-col h-full',
  //       "[&>[role='tabpanel']]:bg-neutral-grey-50",
  //       "[&>[role='tabpanel']]:grow [&>[role='tabpanel']]:h-10",
  //     )}
  //   >
  //     <TabsList
  //       className={cn(
  //         'h-13 pt-3 px-4 flex gap-5 border-b border-low',
  //         '[&>*]:text-sm [&>*]:font-medium',
  //         '[&>*[data-state=active]]:border-b-2',
  //         '[&>*[data-state=active]]:border-green-500 [&>*]:h-10',
  //         '[&>*:disabled]:opacity-50',
  //       )}
  //     >
  //       <TabsTrigger value="revenue" disabled>
  //         Doanh thu
  //       </TabsTrigger>
  //       <TabsTrigger value="report">Báo cáo</TabsTrigger>
  //     </TabsList>
  //     <PanelView className="overflow-auto">
  //       <TabsContent value="revenue"></TabsContent>
  //       <TabsContent value="report">
  //         <Report />
  //       </TabsContent>
  //       {/* <TabsContent value="report">
  //         <OverallReport />
  //       </TabsContent> */}
  //     </PanelView>
  //   </Tabs>
  // )
}

export default ReportIndex
