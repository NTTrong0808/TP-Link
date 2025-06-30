'use client'

import { URLS } from '@/constants/urls'
import { usePosTerminal } from '@/features/kios/store/use-pos-terminal'
import { usePrintBillLogMutation } from '@/lib/api/queries/order/print-bill-log'
import { IOrder } from '@/lib/api/queries/order/schema'
import { getIssuedTicketsByBookingIdKey } from '@/lib/api/queries/ticket/get-issued-tickets-by-booking-id'
import { usePrintTicketLogMutation } from '@/lib/api/queries/ticket/print-ticket-log'
import { IIssuedTicket } from '@/lib/api/queries/ticket/schema'
import { useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useMemo } from 'react'
import { useBoolean, useEvent } from 'react-use'
import { PrintType } from '../types'

interface PrintContextType {
  handlePrint: (
    type?: PrintType,
    options?: {
      bookingId?: IOrder['_id']
      issuedCodes?: IIssuedTicket['issuedCode'][]
    },
  ) => Promise<void>
  handleOpenTicketList: (bookingId: string) => void
  isPrinting: boolean
}

const PrintContext = createContext<PrintContextType | null>(null)

export const PrintProvider = ({
  children,
  onBeforePrint,
  onAfterPrint,
}: {
  children: React.ReactNode
  onBeforePrint?: () => void
  onAfterPrint?: () => void
}) => {
  const [isPrinting, setIsPrinting] = useBoolean(false)
  const queryClient = useQueryClient()
  const { posTerminal } = usePosTerminal()

  const { mutateAsync: printBillLog } = usePrintBillLogMutation({})
  const { mutateAsync: printTicketLog } = usePrintTicketLogMutation({})

  const addPrintClass = useCallback((className?: string | null) => {
    try {
      const element = document.querySelectorAll(`.${className}`)
      if (element) {
        element.forEach((item) => {
          item.classList.add('print:!block')
        })
      }
    } catch {
      console.error('addPrintClass', className)
    }
  }, [])

  const removePrintClass = useCallback((className?: string | null) => {
    try {
      const element = document.querySelectorAll(`.${className}`)
      if (element) {
        element.forEach((item) => {
          item.classList.remove('print:!block')
        })
      }
    } catch {
      console.error('removePrintClass', className)
    }
  }, [])

  const refetchQuery = async (bookingId?: string, issuedCodeLength?: number) => {
    if (bookingId || issuedCodeLength) {
      await Promise.all([queryClient.refetchQueries({ queryKey: [getIssuedTicketsByBookingIdKey, bookingId] })])
    }
  }

  const handlePrint = useCallback(
    async (
      type?: PrintType,
      {
        bookingId,
        issuedCodes,
      }: {
        bookingId?: IOrder['_id']
        issuedCodes?: IIssuedTicket['issuedCode'][]
      } = {},
    ) => {
      setIsPrinting(true)
      try {
        await refetchQuery(bookingId, issuedCodes?.length)
        switch (type) {
          case PrintType.BILL:
            addPrintClass(PrintType.BILL)
            await printBillLog({
              bookingId: bookingId as string,
            })
            break
          case PrintType.TICKET:
            addPrintClass(PrintType.TICKET)
            await printTicketLog({
              issuedCodes: issuedCodes as string[],
              bookingId: bookingId as string,
              posTerminalId: posTerminal?._id,
            })
            break
          case PrintType.DAILY_REPORT:
            addPrintClass(PrintType.DAILY_REPORT)
            break
          case PrintType.DAILY_REPORT_POS:
            addPrintClass(PrintType.DAILY_REPORT_POS)
            break
          case PrintType.ALL:
            addPrintClass(PrintType.BILL)
            addPrintClass(PrintType.TICKET)

            await Promise.all([
              printBillLog({
                bookingId: bookingId as string,
              }),
              printTicketLog({
                issuedCodes: issuedCodes as string[],
                bookingId: bookingId as string,
                posTerminalId: posTerminal?._id,
              }),
            ])
            break
          default:
            break
        }
        await refetchQuery(bookingId, issuedCodes?.length)
        setTimeout(() => {
          window.print()
        }, 300)
      } catch (error) {
        console.error('Print error:', error)
      } finally {
        setIsPrinting(false)
      }
    },
    [addPrintClass, printBillLog, printTicketLog, queryClient],
  )

  const handleOpenTicketList = useCallback((bookingId: string) => {
    if (window) {
      window.open(URLS.TICKET.INDEX.replace(':id', bookingId as string), '_blank')
    }
  }, [])

  const handleBeforePrint = useCallback(() => {
    if (onBeforePrint) {
      onBeforePrint()
    }
  }, [onBeforePrint])

  const handleAfterPrint = useCallback(() => {
    if (onAfterPrint) {
      onAfterPrint()
    }
    Object.values(PrintType).forEach((className) => {
      removePrintClass(className)
    })
  }, [onAfterPrint, removePrintClass])

  useEvent('beforeprint', handleBeforePrint)
  useEvent('afterprint', handleAfterPrint)

  const value = useMemo(
    () => ({
      handlePrint,
      handleOpenTicketList,
      isPrinting,
    }),
    [handlePrint, handleOpenTicketList, isPrinting],
  )

  return <PrintContext.Provider value={value}>{children}</PrintContext.Provider>
}

export const usePrint = () => {
  const context = useContext(PrintContext)
  if (!context) {
    throw new Error('usePrint must be used within a PrintProvider')
  }
  return context
}

export const usePrintPortal = ({
  onBeforePrint,
  onAfterPrint,
}: {
  onBeforePrint?: () => void
  onAfterPrint?: () => void
} = {}) => {
  const { handlePrint, handleOpenTicketList, isPrinting } = usePrint()

  const handleBeforePrint = useCallback(() => {
    if (onBeforePrint) {
      onBeforePrint()
    }
  }, [onBeforePrint])

  const handleAfterPrint = useCallback(() => {
    if (onAfterPrint) {
      onAfterPrint()
    }
  }, [onAfterPrint])

  useEvent('beforeprint', handleBeforePrint)
  useEvent('afterprint', handleAfterPrint)

  return {
    handlePrint,
    handleOpenTicketList,
    isPrinting,
  }
}
