'use client'

import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDialoger } from '@/components/widgets/dialoger'
import Dragon1Icon from '@/components/widgets/icons/dragon-1-icon'
import HistoryIcon from '@/components/widgets/icons/history-icon'
import PhoneIcon from '@/components/widgets/icons/phone-icon'
import { URLS } from '@/constants/urls'
import PrintTicketPortal from '@/features/print/ui/print-ticket-portal'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { appDayJs } from '@/utils/dayjs'
import { Plus, XIcon } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import KiosContextProvider from '../components/kios-context'
import KiosCreateOrderButton from '../components/kios-create-order-button'
import KiosDeleteOrder from '../components/kios-delete-order'
import KiosForm from '../components/kios-form'
import KiosPayment from '../components/kios-payment'
import KiosPosTerminal from '../components/kios-pos-terminal'
import KiosQuatiy from '../components/kios-quatity'
import KiosStoreIntegration from '../components/kios-store-integration'
import KiosSummary from '../components/kios-summary'
import KiosTA from '../components/kios-ta'
import { useOrderExpiryDate } from '../hooks/use-order-expiry-date'
import { useOrderTA } from '../hooks/use-order-ta'
import { useOrderActivation } from '../hooks/use-order-tab'
import { useDraftOrders } from '../store/use-draft-orders'
import { usePosTerminal } from '../store/use-pos-terminal'
import { useOrderActionsLogsStore } from '../store/use-order-action-logs'
import { useAuth } from '@/lib/auth/context'

export interface SellTicketProps {
  type: 'offline'
}

const SellTicket = (props: SellTicketProps) => {
  // const confirm = useConfirm()
  const [activeTab, setActiveTab] = useOrderActivation()
  const [_, setTa] = useOrderTA()
  const [expiryDate, setExpiryDate] = useOrderExpiryDate()
  const setUserId = useOrderActionsLogsStore((s) => s.setUserId)
  const setUserName = useOrderActionsLogsStore((s) => s.setUserName)
  const resetSession = useOrderActionsLogsStore((s) => s.resetSession)

  const authUser = useAuth()

  const canAccess = useCanAccess()

  const isCanAccessOfflineSale = canAccess(CASL_ACCESS_KEY.TICKET_OFFLINE_SALE_ACCESS)

  const { addDialoger } = useDialoger()

  const [bookingId, setBookingId] = useState<string | undefined>()

  const { draftOrders, removeDraftOrder, updateDraftOrder, setCurrentDraftOrder } = useDraftOrders()

  const { posTerminal } = usePosTerminal()

  const setCurrentActiveTab = (id: string) => {
    if (id) {
      setActiveTab(id)
      setCurrentDraftOrder(id)
    }
  }

  const handleCloseDraftTransaction = useCallback(
    (id: string) => {
      addDialoger({
        variant: 'dialog',
        content: (
          <KiosDeleteOrder
            onConfirm={() => {
              const nextActiveTransaction = removeDraftOrder(id)

              if (nextActiveTransaction) {
                setCurrentActiveTab(nextActiveTransaction.id)
              }
              resetSession()
            }}
          />
        ),
        disableCloseOutside: true,
        hideXIcon: true,
      })
    },
    [removeDraftOrder, setCurrentActiveTab, addDialoger],
  )

  const handleDragTabList = useCallback((evt: React.MouseEvent<HTMLDivElement>) => {
    const { hold } = evt.currentTarget.dataset

    if (hold === 'true') {
      evt.preventDefault()
      evt.currentTarget.scrollLeft -= evt.movementX
    }
  }, [])

  // If there is no active tab selected, automatically select the first draft order's ID as the active tab
  // This ensures we always have a tab selected when draft orders exist
  useEffect(() => {
    if (!activeTab && draftOrders.length) {
      setCurrentActiveTab(draftOrders?.[0]?.id)
    }

    // else if (activeTab && !draftOrders.some((e) => e.id === activeTab) && draftOrders.length) {
    //   setCurrentActiveTab(draftOrders?.[0]?.id)
    // }
  }, [activeTab, draftOrders, setCurrentActiveTab])

  const handleChangeTab = useCallback(
    (tabId: string) => {
      const order = draftOrders.find((e) => e.id === tabId)
      setCurrentActiveTab(tabId)
      setTa(order?.formData?.ta ?? null)
      setExpiryDate(
        // order?.expiryDate &&
        //   appDayJs().isBefore(
        //     appDayJs(order?.expiryDate, 'DD/MM/YYYY').startOf('day').add(TICKET_VALID_TIME_TO_SECOND, 'second'),
        //   )
        //   ? appDayJs(order?.expiryDate).format('DD/MM/YYYY')
        //   :
        appDayJs().format('DD/MM/YYYY'),
      )
    },
    [draftOrders, setCurrentActiveTab, setTa, setExpiryDate],
  )

  const handleChangeExpiryDate = (date: Date) => {
    const newExpiryDate = appDayJs(date).isValid() && appDayJs(date)
    if (newExpiryDate) {
      updateDraftOrder(activeTab, { expiryDate: newExpiryDate.toDate() })
      setExpiryDate(newExpiryDate.format('DD/MM/YYYY'))
    }
  }

  const enableCreateOrderButton = false

  useEffect(() => {
    if (authUser?.currentUser?._id) setUserId(authUser?.currentUser?._id ?? '')
    if (authUser?.currentUser)
      setUserName(`${authUser?.currentUser?.lastName || ''} ${authUser?.currentUser?.firstName || ''}`)
  }, [authUser])

  return (
    <KiosContextProvider>
      {!posTerminal ? (
        <KiosPosTerminal />
      ) : draftOrders.length ? (
        <Tabs
          value={activeTab}
          onValueChange={handleChangeTab}
          defaultValue={activeTab}
          className="grow h-10 flex flex-col"
          orientation="vertical"
        >
          <div className="flex gap-2 justify-between">
            <div className="flex gap-2">
              <TabsList
                className="overflow-hidden flex justify-start"
                onPointerDown={(evt) => {
                  evt.currentTarget.dataset.hold = 'true'
                }}
                onPointerUp={(evt) => {
                  evt.currentTarget.dataset.hold = 'false'
                }}
                onPointerMove={handleDragTabList}
              >
                {draftOrders.map((tab) => (
                  <TabsTrigger key={`${tab.id}-trigger`} value={tab.id}>
                    {tab.name}

                    <XIcon
                      role="button"
                      data-close
                      className="size-5 hover:!text-neutral-black"
                      onClick={() => handleCloseDraftTransaction(tab.id)}
                    />
                  </TabsTrigger>
                ))}
              </TabsList>
              {enableCreateOrderButton && (
                <KiosCreateOrderButton onSuccess={(order) => setCurrentActiveTab(order.id)}>
                  <div
                    role="button"
                    className="self-start size-13 bg-neutral-grey-50 hover:bg-neutral-white rounded-lg grid place-items-center cursor-pointer transition-colors shrink-0"
                  >
                    <Plus className="size-4 text-neutral-grey-300" />
                  </div>
                </KiosCreateOrderButton>
              )}
            </div>
            <div
              className={cn(
                'flex gap-4 text-sm whitespace-nowrap',
                '[&>*]:flex [&>*]:items-center [&>*]:gap-2',
                '[&>*]:px-4 [&>*]:py-2 [&>*]:rounded-lg [&>*]:bg-white [&>*]:border [&>*]:border-[#EAEAEA] [&>*]:font-semibold',
              )}
            >
              <Link href={URLS.ADMIN.ORDER.INDEX}>
                <HistoryIcon className="!size-5 text-neutral-grey-300" /> Lịch sử
              </Link>
              {/* <Link href={URLS.KIOS.EXTEND_DISPLAY} target="_blank">
                <ArrowUpRightFromSquareIcon className="!size-5" /> Mở màn hình phụ
              </Link> */}
              <div className="!p-0">
                <DatePicker
                  currentDate
                  value={appDayJs(expiryDate, ['DD/MM/YYYY']).toDate()}
                  datePickerAlign="end"
                  disabled={!isCanAccessOfflineSale}
                  fromDate={new Date()}
                  onChange={handleChangeExpiryDate}
                  className="!border-none hover:bg-white"
                />
              </div>
              {posTerminal && (
                <div>
                  <PhoneIcon className="text-neutral-grey-300" />
                  {posTerminal.name}
                </div>
              )}
            </div>
          </div>

          {draftOrders.map((tab) => (
            <TabsContent
              key={`${tab.id}-content`}
              className="p-4 overflow-hidden h-[calc(100vh-60px-32px-52px)]"
              value={tab.id}
            >
              <KiosForm orderId={tab.id} className="flex gap-4 h-full" setBookingId={setBookingId}>
                <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
                  <KiosTA />
                  <KiosPayment />
                </div>
                <div className="flex flex-col gap-4 flex-1">
                  <KiosQuatiy />
                </div>
                <div className="flex flex-col gap-4 flex-1">
                  <KiosSummary />
                </div>
                <KiosStoreIntegration />
              </KiosForm>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="grid place-items-center h-full">
          <div className="flex flex-col gap-8 p-10 bg-neutral-white rounded-lg">
            <Dragon1Icon className="mx-auto" />
            <p className="text-neutral-grey-500 text-sm text-center">
              Chưa có phiên giao dịch nào trước đó, <br /> vui lòng ấn tạo mới.
            </p>
            <KiosCreateOrderButton className="w-fit mx-auto" onSuccess={(order) => setCurrentActiveTab(order.id)}>
              <Button>Tạo mới giao dịch</Button>
            </KiosCreateOrderButton>
          </div>
        </div>
      )}
      <PrintTicketPortal bookingId={bookingId as string} />
    </KiosContextProvider>
  )
}

export default SellTicket
