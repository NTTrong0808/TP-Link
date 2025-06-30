import DataReportContent from '@/features/print/ui/daily-report-content'
import { useGetDailyReport } from '@/lib/api/queries/booking/get-daily-report'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { useEffect } from 'react'
import PrintPortal from '../components/print-portal'
import { PrintType } from '../types'
type Props = {
  onLoaded?: () => void
}
const PrintDailyReportPortal = ({ onLoaded }: Props) => {
  const canAccess = useCanAccess()

  const isCanViewDailyReport = canAccess(CASL_ACCESS_KEY.TICKET_REPORT_DAILY_REPORT_VIEW)

  const { data, isLoading } = useGetDailyReport({
    variables: {},
    enabled: isCanViewDailyReport,
  })

  useEffect(() => {
    if (!isLoading && data?.data) {
      const timeout = setTimeout(() => {
        onLoaded?.()
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [isLoading, data, onLoaded])
  return (
    isCanViewDailyReport &&
    data?.data &&
    !isLoading && (
      <PrintPortal type={PrintType.DAILY_REPORT}>
        {data?.data && !isLoading && <DataReportContent reportData={data?.data} />}
      </PrintPortal>
    )
  )
}

export default PrintDailyReportPortal
