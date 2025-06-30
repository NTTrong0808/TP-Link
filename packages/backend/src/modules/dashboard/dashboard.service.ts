import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PaymentMethod } from '@src/enums/paymentMethod.enum'
import { appDayJs } from '@src/lib/dayjs'
import { AnyBulkWriteOperation, Model } from 'mongoose'
import { DashboardData } from './dto/response'
import { LCDashboard } from './schemas/dashboard.schema'

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(LCDashboard.name)
    private readonly dashboardModel: Model<LCDashboard>,
  ) {}

  // async getDashboardData(body: { from: Date; to: Date; type: 'hour' | 'day' | 'week' | 'month' | 'year' }) {
  //   let isHour = false

  //   if (body.type === 'hour') {
  //     isHour = true
  //   }

  //   const current = body.to
  //     ? appDayJs(body.to)
  //         .endOf(isHour ? 'day' : body.type)
  //         .toDate()
  //     : appDayJs()
  //         .endOf(isHour ? 'day' : body.type)
  //         .toDate()

  //   const lastPeriod = body.from
  //     ? appDayJs(body.from)
  //         .startOf(isHour ? 'day' : body.type)
  //         .toDate()
  //     : appDayJs()
  //         .subtract(7, 'day')
  //         .startOf(isHour ? 'day' : body.type)
  //         .toDate()

  //   const diff = appDayJs(current).diff(appDayJs(lastPeriod), body.type)

  //   const [saleChannels, paymentMethods] = await Promise.all([
  //     this.saleChannelService.getAllSaleChannels(),
  //     this.paymentMethodService.findPaymentMethods(),
  //   ])

  //   const cashPaymentMethodId = paymentMethods
  //     ?.find((method) => method?.payooType === PaymentMethod.CASH)
  //     ?._id?.toString()

  //   // const payooQrPaymentMethodId = paymentMethods
  //   //   ?.find((method) => method?.payooType === PaymentMethod.PAYOO_QR)
  //   //   ?._id?.toString()

  //   const data: DashboardData = {
  //     revenue: [],
  //     ticketSold: [],
  //     composedChart: [],
  //     pieChart: [],
  //     saleChannels: [],
  //     totalRevenue: 0,
  //     totalRevenueByCash: 0,
  //     totalRevenueByPayoo: 0,
  //     // totalRevenueByPayooQR: 0,
  //     totalTicketSold: 0,
  //     totalTicketSoldAdult: 0,
  //     totalTicketSoldChild: 0,
  //     totalBooking: 0,
  //     totalBookingAverage: 0,
  //     lastUpdated: undefined,
  //   }

  //   const [total] = await this.dashboardModel.aggregate<{
  //     current: {
  //       _id: {
  //         saleChannelId?: string
  //         targetId?: string
  //         paymentMethodId?: string
  //       }
  //       totalRevenue: number
  //       totalRevenueByCash: number
  //       totalRevenueByPayoo: number
  //       totalTicketSold: number
  //       totalTicketSoldAdult: number
  //       totalTicketSoldChild: number
  //       totalBooking: number
  //       updatedAt: Date
  //     }[]
  //     lastPeriod: {
  //       _id: {
  //         saleChannelId?: string
  //         targetId?: string
  //         paymentMethodId?: string
  //       }
  //       totalRevenue: number
  //       totalRevenueByCash: number
  //       totalRevenueByPayoo: number
  //       totalTicketSold: number
  //       totalTicketSoldAdult: number
  //       totalTicketSoldChild: number
  //       totalBooking: number
  //       updatedAt: Date
  //     }[]
  //   }>([
  //     {
  //       $facet: {
  //         current: [
  //           {
  //             $match: {
  //               date: {
  //                 $gte: appDayJs(lastPeriod).startOf(body.type).toDate(),
  //                 $lte: appDayJs(current).endOf(body.type).toDate(),
  //               },
  //             },
  //           },
  //           {
  //             $group: {
  //               _id: {
  //                 saleChannelId: '$saleChannelId',
  //                 paymentMethodId: '$paymentMethodId',
  //               },
  //               totalRevenue: { $sum: '$revenue' },
  //               // totalRevenueByCash: { $sum: '$revenueByCash' },
  //               // totalRevenueByPayoo: { $sum: '$revenueByPayoo' },
  //               totalTicketSold: { $sum: '$ticketSold' },
  //               totalTicketSoldAdult: { $sum: '$ticketSoldAdult' },
  //               totalTicketSoldChild: { $sum: '$ticketSoldChild' },
  //               totalBooking: { $sum: '$totalBooking' },
  //               updatedAt: { $max: '$updatedAt' },
  //             },
  //           },
  //         ],
  //         // lastPeriod: [
  //         //   {
  //         //     $match: {
  //         //       date: {
  //         //         $gte: appDayJs(lastPeriod).subtract(1, 'day').subtract(diff, body.type).startOf(body.type).toDate(),
  //         //         $lte: appDayJs(lastPeriod).subtract(1, 'day').endOf(body.type).toDate(),
  //         //       },
  //         //     },
  //         //   },
  //         //   groupBy,
  //         // ],
  //       },
  //     },
  //   ])

  //   if (total && total.current.length > 0) {
  //     const currentData = total?.current

  //     // const lastPeriodData = total[0].lastPeriod[0] ?? { totalRevenue: 0, totalTicketSold: 0, totalTicketExpired: 0 }

  //     data.totalRevenue = currentData?.reduce((acc, curr) => acc + (curr?.totalRevenue || 0), 0) || 0
  //     data.totalRevenueByCash =
  //       currentData
  //         ?.filter((data) => data?._id?.paymentMethodId === cashPaymentMethodId)
  //         ?.reduce((acc, curr) => acc + (curr?.totalRevenue || 0), 0) || 0

  //     // data.totalRevenueByPayooQR =
  //     //   currentData
  //     //     ?.filter((data) => data?._id?.paymentMethodId === payooQrPaymentMethodId)
  //     //     ?.reduce((acc, curr) => acc + (curr?.totalRevenue || 0), 0) || 0

  //     data.totalRevenueByPayoo =
  //       currentData
  //         ?.filter(
  //           (data) =>
  //             // data?._id?.paymentMethodId !== payooQrPaymentMethodId &&
  //             data?._id?.paymentMethodId !== cashPaymentMethodId,
  //         )
  //         ?.reduce((acc, curr) => acc + (curr?.totalRevenue || 0), 0) || 0

  //     data.totalTicketSold = currentData?.reduce((acc, curr) => acc + (curr?.totalTicketSold || 0), 0) || 0
  //     data.totalTicketSoldAdult = currentData?.reduce((acc, curr) => acc + (curr?.totalTicketSoldAdult || 0), 0) || 0
  //     data.totalTicketSoldChild = currentData?.reduce((acc, curr) => acc + (curr?.totalTicketSoldChild || 0), 0) || 0

  //     data.totalBooking = currentData?.reduce((acc, curr) => acc + (curr?.totalBooking || 0), 0) || 0

  //     data.totalBookingAverage = data.totalRevenue / (data.totalBooking || 1)
  //     // data.revenueRate =
  //     //   lastPeriodData.totalRevenue > 0
  //     //     ? (currentData.totalRevenue - lastPeriodData.totalRevenue) / lastPeriodData.totalRevenue
  //     //     : 0
  //     // data.ticketSoldRate =
  //     //   lastPeriodData.totalTicketSold > 0
  //     //     ? (currentData.totalTicketSold - lastPeriodData.totalTicketSold) / lastPeriodData.totalTicketSold
  //     //     : 0
  //     // data.ticketExpiredRate =
  //     //   lastPeriodData.totalTicketExpired > 0
  //     //     ? (currentData.totalTicketExpired - lastPeriodData.totalTicketExpired) / lastPeriodData.totalTicketExpired
  //     //     : 0

  //     data.saleChannels = data.pieChart = currentData
  //       ?.filter((data) => {
  //         const hasValidId = Object.keys(data?._id || {}).length > 0
  //         const hasValue =
  //           (data?.totalRevenue || 0) > 0 ||
  //           (data?.totalTicketSold || 0) > 0 ||
  //           (data?.totalTicketSoldAdult || 0) > 0 ||
  //           (data?.totalTicketSoldChild || 0) > 0 ||
  //           (data?.totalBooking || 0) > 0
  //         return hasValidId && hasValue
  //       })
  //       ?.reduce(
  //         (acc, data) => {
  //           const saleChannelId = data?._id?.saleChannelId?.toString() || 'empty'
  //           const saleChannel = saleChannels?.find((channel) => channel?._id?.toString() === saleChannelId)
  //           const existingChannel = acc.find((channel) => channel.saleChannelId === saleChannelId)

  //           if (existingChannel) {
  //             existingChannel.revenue += data?.totalRevenue || 0
  //             existingChannel.ticketSold += data?.totalTicketSold || 0
  //             existingChannel.ticketSoldAdult += data?.totalTicketSoldAdult || 0
  //             existingChannel.ticketSoldChild += data?.totalTicketSoldChild || 0
  //             return acc
  //           }

  //           return [
  //             ...acc,
  //             {
  //               saleChannelId,
  //               saleChannelGroup: saleChannel?.groupSaleChannel || '',
  //               saleChannelName: saleChannel?.name || 'Không xác định',
  //               revenue: data?.totalRevenue || 0,
  //               ticketSold: data?.totalTicketSold || 0,
  //               ticketSoldAdult: data?.totalTicketSoldAdult || 0,
  //               ticketSoldChild: data?.totalTicketSoldChild || 0,
  //             },
  //           ]
  //         },
  //         [] as {
  //           saleChannelId: string
  //           saleChannelGroup: string
  //           saleChannelName: string
  //           revenue: number
  //           ticketSold: number
  //           ticketSoldAdult: number
  //           ticketSoldChild: number
  //         }[],
  //       )
  //       .sort((a, b) => {
  //         if (a.saleChannelGroup === '' && b.saleChannelGroup !== '') return 1
  //         if (a.saleChannelGroup !== '' && b.saleChannelGroup === '') return -1
  //         if (a.saleChannelGroup === b.saleChannelGroup) {
  //           if (a.saleChannelName === 'Không xác định' && b.saleChannelName !== 'Không xác định') return 1
  //           if (a.saleChannelName !== 'Không xác định' && b.saleChannelName === 'Không xác định') return -1
  //           return a.saleChannelName.localeCompare(b.saleChannelName)
  //         }
  //         return (a.saleChannelGroup || '').localeCompare(b.saleChannelGroup || '')
  //       })

  //     data.lastUpdated = currentData?.reduce(
  //       (acc, curr) => (curr?.updatedAt > acc ? curr?.updatedAt : acc),
  //       currentData?.[0]?.updatedAt,
  //     )
  //   }

  //   for (let i = 0; i <= diff; i++) {
  //     const currentDate = appDayJs(current).subtract(i, body.type).toDate()
  //     const lastPeriodDate = appDayJs(lastPeriod).subtract(i, body.type).toDate()

  //     const [result] = await this.dashboardModel.aggregate<{
  //       current: { _id: string; revenue: number; ticketSold: number; lastUpdated?: Date }[]
  //       lastPeriod: { _id: string; revenue: number; ticketSold: number; lastUpdated?: Date }[]
  //     }>([
  //       {
  //         $facet: {
  //           current: [
  //             {
  //               $match: {
  //                 date: {
  //                   $gte: appDayJs(currentDate).startOf(body.type).toDate(),
  //                   $lte: appDayJs(currentDate).endOf(body.type).toDate(),
  //                 },
  //               },
  //             },
  //             {
  //               $group: {
  //                 _id: '$saleChannelId',
  //                 revenue: { $sum: '$revenue' },
  //                 ticketSold: { $sum: '$ticketSold' },
  //                 lastUpdated: { $max: '$updatedAt' },
  //               },
  //             },
  //           ],
  //           lastPeriod: [
  //             {
  //               $match: {
  //                 date: {
  //                   $gte: appDayJs(lastPeriodDate).startOf(body.type).toDate(),
  //                   $lte: appDayJs(lastPeriodDate).endOf(body.type).toDate(),
  //                 },
  //               },
  //             },
  //             {
  //               $group: {
  //                 _id: '$saleChannelId',
  //                 revenue: { $sum: '$revenue' },
  //                 ticketSold: { $sum: '$ticketSold' },
  //               },
  //             },
  //           ],
  //         },
  //       },
  //     ])

  //     const currentData = result.current
  //     const lastPeriodData = result.lastPeriod

  //     let keyField = appDayJs(currentDate).format('DD/MM/YYYY')
  //     let lastPeriodKeyField = appDayJs(lastPeriodDate).format('DD/MM/YYYY')
  //     switch (body.type) {
  //       case 'week':
  //         keyField = `${appDayJs(currentDate).startOf('week').format('DD/MM/YYYY')} - ${appDayJs(currentDate).endOf('week').format('DD/MM/YYYY')}`
  //         lastPeriodKeyField = `${appDayJs(lastPeriodDate).startOf('week').format('DD/MM/YYYY')} - ${appDayJs(lastPeriodDate).endOf('week').format('DD/MM/YYYY')}`
  //         break
  //       case 'month':
  //         keyField = appDayJs(currentDate).startOf('month').format('MM/YYYY')
  //         lastPeriodKeyField = appDayJs(lastPeriodDate).startOf('month').format('MM/YYYY')
  //         break
  //       case 'year':
  //         keyField = appDayJs(currentDate).startOf('year').format('YYYY')
  //         lastPeriodKeyField = appDayJs(lastPeriodDate).startOf('year').format('YYYY')
  //         break
  //       case 'hour':
  //         keyField = appDayJs(currentDate).startOf('hour').format('HH:mm DD/MM')
  //         lastPeriodKeyField = appDayJs(lastPeriodDate).startOf('hour').format('HH:mm DD/MM')
  //         break
  //       default:
  //         keyField = appDayJs(currentDate).format('DD/MM/YYYY')
  //         lastPeriodKeyField = appDayJs(lastPeriodDate).format('DD/MM/YYYY')
  //         break
  //     }

  //     const currentRevenue = currentData?.reduce((acc, curr) => acc + (curr?.revenue || 0), 0) || 0
  //     const lastPeriodRevenue = lastPeriodData?.reduce((acc, curr) => acc + (curr?.revenue || 0), 0) || 0
  //     const currentTicketSold = currentData?.reduce((acc, curr) => acc + (curr?.ticketSold || 0), 0) || 0
  //     const lastPeriodTicketSold = lastPeriodData?.reduce((acc, curr) => acc + (curr?.ticketSold || 0), 0) || 0

  //     // const revenueTrend = (currentRevenue - lastPeriodRevenue) / lastPeriodRevenue

  //     // const ticketSoldTrend = (currentTicketSold - lastPeriodTicketSold) / lastPeriodTicketSold

  //     // if (!data?.lastUpdated && currentData?.[0]?.lastUpdated) {
  //     //   data.lastUpdated = currentData?.[0]?.lastUpdated
  //     // }

  //     // data.revenue.unshift({
  //     //   date: keyField,
  //     //   current: currentRevenue,
  //     //   lastPeriod: lastPeriodRevenue,
  //     //   lastPeriodDate: lastPeriodKeyField,
  //     //   rate: revenueTrend,
  //     // })

  //     // data.ticketSold.unshift({
  //     //   date: keyField,
  //     //   current: currentTicketSold,
  //     //   lastPeriod: lastPeriodTicketSold,
  //     //   lastPeriodDate: lastPeriodKeyField,
  //     //   rate: ticketSoldTrend,
  //     // })

  //     // Aggregate sale channel data for chart
  //     const saleChannelChartData: {
  //       [key: string]: // | {
  //       //     currentRevenue: number
  //       //     lastPeriodRevenue: number
  //       //     currentTicketSold: number
  //       //     lastPeriodTicketSold: number
  //       //   }
  //       // |
  //       number
  //     } = {}

  //     currentData?.forEach((data) => {
  //       const saleChannelId = data?._id?.toString() || 'empty'
  //       const saleChannel = saleChannels?.find((channel) => channel?._id?.toString() === saleChannelId)
  //       const channelName = saleChannel?.name || 'Không xác định'

  //       // const lastPeriodSaleChannel = lastPeriodData?.find((item) => item?._id?.toString() === saleChannelId)

  //       if (saleChannelChartData[channelName]) {
  //         saleChannelChartData[channelName] += data?.revenue || 0
  //       } else {
  //         saleChannelChartData[channelName] = data?.revenue || 0
  //       }

  //       // if (saleChannelChartData[channelName]) {
  //       //   saleChannelChartData[channelName].currentRevenue += data?.revenue || 0
  //       //   saleChannelChartData[channelName].currentTicketSold += data?.ticketSold || 0
  //       //   saleChannelChartData[channelName].lastPeriodRevenue += lastPeriodSaleChannel?.revenue || 0
  //       //   saleChannelChartData[channelName].lastPeriodTicketSold += lastPeriodSaleChannel?.ticketSold || 0
  //       // } else {
  //       //   saleChannelChartData[channelName] = {
  //       //     currentRevenue: data?.revenue || 0,
  //       //     lastPeriodRevenue: lastPeriodSaleChannel?.revenue || 0,
  //       //     currentTicketSold: data?.ticketSold || 0,
  //       //     lastPeriodTicketSold: lastPeriodSaleChannel?.ticketSold || 0,
  //       //   }
  //       // }
  //     })

  //     // const details = currentData
  //     //   ?.filter((data) => {
  //     //     const hasValidId = Object.keys(data?._id || {}).length > 0
  //     //     const hasValue = (data?.revenue || 0) > 0 || (data?.ticketSold || 0) > 0
  //     //     return hasValidId && hasValue
  //     //   })
  //     //   ?.map((data) => {
  //     //     const saleChannelId = data?._id?.toString() || 'empty'
  //     //     const saleChannel = saleChannels?.find((channel) => channel?._id?.toString() === saleChannelId)
  //     //     const lastPeriodSaleChannel = lastPeriodData?.find((item) => item?._id?.toString() === saleChannelId)

  //     //     return {
  //     //       saleChannelGroup: saleChannel?.groupSaleChannel || '',
  //     //       saleChannelName: saleChannel?.name || 'Không xác định',
  //     //       currentRevenue: data?.revenue || 0,
  //     //       lastPeriodRevenue: lastPeriodSaleChannel?.revenue || 0,
  //     //       currentTicketSold: data?.ticketSold || 0,
  //     //       lastPeriodTicketSold: lastPeriodSaleChannel?.ticketSold || 0,
  //     //     }
  //     //   })
  //     //   .sort((a, b) => {
  //     //     if (a.saleChannelGroup === '' && b.saleChannelGroup !== '') return 1
  //     //     if (a.saleChannelGroup !== '' && b.saleChannelGroup === '') return -1
  //     //     if (a.saleChannelGroup === b.saleChannelGroup) {
  //     //       if (a.saleChannelName === 'Không xác định' && b.saleChannelName !== 'Không xác định') return 1
  //     //       if (a.saleChannelName !== 'Không xác định' && b.saleChannelName === 'Không xác định') return -1
  //     //       return a.saleChannelName.localeCompare(b.saleChannelName)
  //     //     }
  //     //     return (a.saleChannelGroup || '').localeCompare(b.saleChannelGroup || '')
  //     //   })

  //     data.composedChart.unshift({
  //       date: keyField,
  //       lastPeriodDate: lastPeriodKeyField,
  //       currentRevenue,
  //       lastPeriodRevenue,
  //       currentTicketSold,
  //       lastPeriodTicketSold,
  //       // saleChannels: details?.map((item) => item?.saleChannelName),
  //       // details: details,
  //       ...saleChannelChartData,
  //     })
  //   }

  //   return data
  // }

  // // TODO: run cron job to update dashboard data
  // async updateDashboardData(body: { hour?: number; day?: number }) {
  //   const { hour = 48, day } = body

  //   const totalHour = hour && !day ? hour : (day || 30) * 24

  //   for (let i = 0; i <= totalHour; i++) {
  //     const current = appDayJs().subtract(i, 'h').endOf('h').toDate()
  //     // const lastPeriod = appDayJs(current)
  //     //   .subtract(i + 1, 'h')
  //     //   .endOf('h')
  //     //   .toDate()

  //     const logString = appDayJs(current).format('DD/MM/YYYY HH')

  //     console.time(logString)

  //     const [
  //       currentRevenue,
  //       // lastPeriodRevenue
  //     ] = await Promise.all([
  //       this.bookingService.getTotalByDay(current),
  //       // this.bookingService.getTotalByDay(lastPeriod),
  //     ])

  //     await this.dashboardModel.deleteMany({
  //       dateString: appDayJs(current).format('DD/MM/YYYY'),
  //       hourString: appDayJs(current).format('HH'),
  //     })

  //     const bulkWriteData: AnyBulkWriteOperation<any>[] = currentRevenue?.map((data) => {
  //       return {
  //         updateOne: {
  //           filter: {
  //             dateString: appDayJs(current).format('DD/MM/YYYY'),
  //             hourString: appDayJs(current).format('HH'),
  //             saleChannelId: data?.saleChannelId,
  //             paymentMethodId: data?.paymentMethodId,
  //           },
  //           update: {
  //             revenue: data?.totalPaid || 0,
  //             // revenueByCash: data?.totalPaidByCash || 0,
  //             // revenueByPayoo: data?.totalPaidByPayoo || 0,

  //             ticketSold: data?.totalTicket || 0,
  //             ticketSoldAdult: data?.totalTicketAdult || 0,
  //             ticketSoldChild: data?.totalTicketChild || 0,

  //             totalBooking: data?.totalBooking || 0,
  //             originalRevenue: data?.originalRevenue || 0,
  //             // ticketExpired: currentTicketSold.expired,
  //             date: current,
  //           },
  //           upsert: true,
  //         },
  //       }
  //     })

  //     // [
  //     //   {
  //     //     updateOne: {
  //     //       filter: {
  //     //         dateString: appDayJs(current).format('DD/MM/YYYY'),
  //     //         hourString: appDayJs(current).format('HH'),
  //     //       },
  //     //       update: {
  //     //         revenue: currentRevenue?.totalPaid,
  //     //         revenueByCash: currentRevenue?.totalPaidByCash,
  //     //         revenueByPayoo: currentRevenue?.totalPaidByPayoo,

  //     //         ticketSold: currentRevenue?.totalTicket,
  //     //         ticketSoldAdult: currentRevenue?.totalTicketAdult,
  //     //         ticketSoldChild: currentRevenue?.totalTicketChild,

  //     //         totalBooking: currentRevenue?.totalBooking,
  //     //         // ticketExpired: currentTicketSold.expired,
  //     //         date: current,
  //     //       },
  //     //       upsert: true,
  //     //     },
  //     //   },
  //     //   // {
  //     //   //   updateOne: {
  //     //   //     filter: {
  //     //   //       dateString: appDayJs(lastPeriod).format('DD/MM/YYYY'),
  //     //   //       hourString: appDayJs(lastPeriod).format('HH'),
  //     //   //     },
  //     //   //     update: {
  //     //   //       revenue: lastPeriodRevenue.totalPaid,
  //     //   //       revenueByCash: lastPeriodRevenue.totalPaidByCash,
  //     //   //       revenueByPayoo: lastPeriodRevenue.totalPaidByPayoo,

  //     //   //       ticketSold: lastPeriodRevenue.totalTicket,
  //     //   //       ticketSoldAdult: lastPeriodRevenue.totalTicketAdult,
  //     //   //       ticketSoldChild: lastPeriodRevenue.totalTicketChild,

  //     //   //       totalBooking: lastPeriodRevenue.totalBooking,
  //     //   //       date: lastPeriod,
  //     //   //     },
  //     //   //     upsert: true,
  //     //   //   },
  //     //   // },
  //     // ]

  //     await this.dashboardModel.bulkWrite(bulkWriteData)

  //     console.timeEnd(logString)
  //   }
  // }

  // async clearDashboard() {
  //   await this.dashboardModel.deleteMany()
  // }
}
