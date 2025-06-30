'use client'

import PaymentMethod from '@/features/payment-method/ui'
import SaleChannel from '@/features/sale-channel/ui'
import { PanelView } from '@/layouts/panel/panel-view'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import InvoiceConfig from '../components/invoice-config'
import PosTerminalContent from '../components/pos-terminnal-content'
import ScannerTerminalContent from '../components/scanner-terminal-content'

const ConfigurationPage = () => {
  const canAccess = useCanAccess()

  const tabs = [
    {
      label: 'POS Terminal',
      value: 'posTerminal',
      permissions: [CASL_ACCESS_KEY.TICKET_POS_TERMINAL_VIEW],
      component: <PosTerminalContent />,
    },
    {
      label: 'Kênh bán',
      value: 'saleChannel',
      permissions: [CASL_ACCESS_KEY.TICKET_SALE_CHANNEL_VIEW],
      component: <SaleChannel />,
    },

    {
      label: 'Phương thức thanh toán',
      value: 'paymentMethod',
      permissions: [
        CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_VIEW,
        CASL_ACCESS_KEY.TICKET_PAYMENT_METHOD_BANK_ACCOUNT_VIEW,
      ],
      component: <PaymentMethod />,
    },
    {
      label: 'Xuất hóa đơn',
      value: 'invoice',
      component: <InvoiceConfig />,
      permissions: [CASL_ACCESS_KEY.TICKET_ISSUE_INVOICE_CONFIG_VIEW],
    },
    {
      label: 'Scanner Terminal',
      value: 'scannerTerminal',
      component: <ScannerTerminalContent />,
      permissions: [CASL_ACCESS_KEY.TICKET_SCANNER_TERMINAL_VIEW],
    },
  ].filter((tab) => canAccess(tab.permissions))

  return (
    <Tabs
      defaultValue={tabs?.at(0)?.value}
      className={cn(
        'flex flex-col h-full overflow-hidden',
        "[&>[role='tabpanel']]:bg-neutral-grey-50",
        "[&>[role='tabpanel']]:grow [&>[role='tabpanel']]:h-10",
      )}
    >
      <TabsList
        className={cn(
          'h-13 pt-3 px-4 flex gap-5 border-b border-low',
          '[&>*]:text-sm [&>*]:font-medium',
          '[&>*[data-state=active]]:border-b-2',
          '[&>*[data-state=active]]:border-green-500 [&>*]:h-10',
          '[&>*:disabled]:opacity-50',
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <PanelView>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="overflow-y-auto">
            {tab.component}
          </TabsContent>
        ))}
      </PanelView>
    </Tabs>
  )
}

export default ConfigurationPage
