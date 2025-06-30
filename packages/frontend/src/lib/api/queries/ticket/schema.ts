import { z } from 'zod'
import { IOrder } from '../order/schema'
import { ILCPosTerminal } from '../pos-terminal/schema'
import { User } from '../user/schema'

export const ISSUED_TICKET_STATUS = {
  USED: 'USED',
  UN_USED: 'UN_USED',
  EXPIRED: 'EXPIRED',
  DELETED: 'DELETED',
} as const

export const ISSUED_TICKET_HISTORY_STATUS = {
  VALID: 'VALID',
  INVALID: 'INVALID',
  QR_CODE_INVALID: 'QR_CODE_INVALID',
  PRINT: 'PRINT',
  REPRINT: 'REPRINT',
  EXPIRED: 'EXPIRED',
  CREATED: 'CREATED',
  MARK_AS_USED: 'MARK_AS_USED',
} as const

export const issuedTicketSchema = z.object({
  _id: z.string(),
  bookingId: z.union([
    z.object({
      metadata: z.object({
        invNo: z.string(),
      }),
    }),
    z.string(),
    z.any(),
  ]),
  status: z.nativeEnum(ISSUED_TICKET_STATUS),
  issuedCode: z.string(),
  referenceCode: z.string().optional(),
  price: z.number(),
  expiryDate: z.string(),
  title: z.string().optional(),
  createdAt: z.union([z.date(), z.string()]).optional(),
  updatedAt: z.union([z.date(), z.string()]).optional(),
  usedAt: z.union([z.date(), z.string()]).optional(),
  validFrom: z.union([z.date(), z.string()]).optional(),
  validTo: z.union([z.date(), z.string()]).optional(),
  ticketIndex: z.number().optional(),
  printCount: z.number().optional(),
  printTimes: z.array(z.union([z.date(), z.string()])).optional(),
  lastPrintTime: z.union([z.date(), z.string()]).optional(),
  shortTitle: z.string().optional(),
  note: z.string().optional(),
  bookingCode: z.string().optional(),
  serviceId: z.string().optional(),
})

export const issuedTicketHistorySchema = z.object({
  ticketStatus: z.nativeEnum(ISSUED_TICKET_STATUS),
  status: z.nativeEnum(ISSUED_TICKET_HISTORY_STATUS),
  purchasedAt: z.union([z.date(), z.string()]).optional(),
  reason: z.string().optional(),
  createdAt: z.union([z.date(), z.string()]).optional(),
})

export interface IIssuedTicket extends z.infer<typeof issuedTicketSchema> {
  booking?: IOrder
  histories?: IIssuedTicketHistory[]
}
export interface IIssuedTicketHistory extends z.infer<typeof issuedTicketHistorySchema>, Omit<IIssuedTicket, 'status'> {
  posTerminalId?: ILCPosTerminal | string
  ticketId?: IIssuedTicket | string
  createdBy?: User | string
  createdByName?: string
}

export interface GetIssuedTicketListVariables {
  size?: number
  pageSize?: number
  page?: number
  search?: string
  sortBy?: string
  status?: (typeof ISSUED_TICKET_STATUS)[keyof typeof ISSUED_TICKET_STATUS][]
  sortOrder?: 'asc' | 'desc'
}
