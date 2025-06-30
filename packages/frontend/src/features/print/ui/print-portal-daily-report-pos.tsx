import DataReportPOSContent from '@/features/print/ui/daily-report-pos-content'
import { useGetDailyReportPOS } from '@/lib/api/queries/booking/get-daily-report-pos'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { useEffect } from 'react'
import PrintPortal from '../components/print-portal'
import { PrintType } from '../types'

type Props = {
  onLoaded?: () => void
}

const PrintDailyReportPOSPortal = ({ onLoaded }: Props) => {
  const canAccess = useCanAccess()

  const isCanViewDailyReportPos = canAccess(CASL_ACCESS_KEY.TICKET_REPORT_DAILY_REPORT_POS_VIEW)
  const { data, isLoading } = useGetDailyReportPOS({
    variables: {},
    enabled: isCanViewDailyReportPos,
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
    isCanViewDailyReportPos &&
    data?.data &&
    !isLoading && (
      <PrintPortal type={PrintType.DAILY_REPORT_POS}>
        {data?.data && !isLoading && <DataReportPOSContent reportData={data?.data} />}
      </PrintPortal>
    )
  )
}

export default PrintDailyReportPOSPortal
