'use client'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { URLS } from '@/constants/urls'
import { usePrintPortal } from '@/features/print/contexts/print-portal-context'
import { PrintType } from '@/features/print/types'
import PrintDailyReportPortal from '@/features/print/ui/print-portal-daily-report'
import PrintDailyReportPOSPortal from '@/features/print/ui/print-portal-daily-report-pos'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Report {
  name: string
  printType?: PrintType
  url?: string
  permissions?: string[]
  STT?: number
}

const Report = () => {
  const canAccess = useCanAccess()
  const { handlePrint, isPrinting } = usePrintPortal()
  const router = useRouter()

  const adminReport: Report[] = [
    {
      name: 'Tổng hợp doanh số bán theo ngày',
      url: URLS.ADMIN.REPORT.REVENUE_BY_DATE,
      STT: 3,
      permissions: [CASL_ACCESS_KEY.TICKET_REPORT_REVENUE_BY_DATE_VIEW],
    },
    {
      name: 'Tổng hợp doanh số bán theo đơn hàng',
      url: URLS.ADMIN.REPORT.REVENUE_BY_BOOKING,
      STT: 4,
      permissions: [CASL_ACCESS_KEY.TICKET_REPORT_REVENUE_BY_BOOKING_VIEW],
    },
    {
      name: 'Chi tiết doanh số bán theo mặt hàng',
      url: URLS.ADMIN.REPORT.REVENUE_BY_SERVICE,
      STT: 5,
      permissions: [CASL_ACCESS_KEY.TICKET_REPORT_REVENUE_BY_SERVICE_VIEW],
    },
    {
      name: 'Chi tiết doanh số bán theo mặt hàng và đơn hàng',
      url: URLS.ADMIN.REPORT.REVENUE_BY_BOOKING_AND_SERVICE,
      STT: 6,
      permissions: [CASL_ACCESS_KEY.TICKET_REPORT_REVENUE_BY_BOOKING_AND_SERVICE_VIEW],
    },
    {
      name: 'Tổng hợp doanh số bán theo khách hàng',
      url: URLS.ADMIN.REPORT.REVENUE_BY_CUSTOMER,
      STT: 7,
      permissions: [CASL_ACCESS_KEY.TICKET_REPORT_REVENUE_BY_CUSTOMER_VIEW],
    },
    {
      name: 'Chi tiết doanh số bán theo khách hàng và đơn hàng',
      url: URLS.ADMIN.REPORT.REVENUE_BY_BOOKING_AND_CUSTOMER,
      STT: 8,
      permissions: [CASL_ACCESS_KEY.TICKET_REPORT_REVENUE_BY_BOOKING_AND_CUSTOMER_VIEW],
    },
    {
      name: 'Tổng hợp doanh số bán theo nhân viên',
      url: URLS.ADMIN.REPORT.REVENUE_BY_USER,
      STT: 9,
      permissions: [CASL_ACCESS_KEY.TICKET_REPORT_REVENUE_BY_USER_VIEW],
    },
    {
      name: 'Tổng hợp doanh số theo kênh bán',
      url: URLS.ADMIN.REPORT.REVENUE_BY_CHANNEL,
      STT: 10,
      permissions: [CASL_ACCESS_KEY.TICKET_REPORT_REVENUE_BY_CHANNEL_VIEW],
    },
  ]

  const userReport: Report[] = [
    {
      name: 'Báo cáo tổng doanh thu cuối ngày theo kênh bán',
      printType: PrintType.DAILY_REPORT,
      STT: 1,
      permissions: [CASL_ACCESS_KEY.TICKET_REPORT_DAILY_REPORT_VIEW],
    },
    {
      name: 'Báo cáo doanh thu ngày theo thu ngân',
      printType: PrintType.DAILY_REPORT_POS,
      STT: 2,
      permissions: [CASL_ACCESS_KEY.TICKET_REPORT_DAILY_REPORT_POS_VIEW],
    },
  ]

  const columns: ColumnDef<Report>[] = [
    {
      header: 'Tên báo cáo',
      accessorKey: 'STT',
      cell: ({ row }) => row.original.name,
    },
    {
      header: 'Đường dẫn',
      accessorKey: 'type',

      cell: ({ row }) => {
        const url = row.original.url
        const printType = row.original.printType
        return (
          <Button
            size="sm"
            onClick={() => {
              if (url) router.push(url)
              else if (printType) handlePrint(printType)
            }}
            disabled={!(url || printType)}
            loading={isPrinting}
          >
            {printType ? 'Xuất báo cáo' : 'Mở báo cáo'} <ArrowUpRightIcon />
          </Button>
        )
      },
    },
  ]

  const reportData = (userReport.concat(adminReport) || [])?.filter((item) => canAccess(item?.permissions))

  return (
    <>
      <DataTable
        data={reportData}
        columns={columns}
        pagination={{
          hidden: true,
        }}
        tableClassName="table-auto"
        sortColumn="STT"
        sortDirection="asc"
      />
      <PrintDailyReportPOSPortal />
      <PrintDailyReportPortal />
    </>
  )
}

export default Report
