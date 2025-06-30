import { Button } from '@/components/ui/button'
import ExportIcon from '@/components/widgets/icons/export-icon'
import PrintDailyReportPortal from '@/features/print/ui/print-portal-daily-report'
import PrintDailyReportPOSPortal from '@/features/print/ui/print-portal-daily-report-pos'
import { useEffect, useState } from 'react'

const DailyReportAction = () => {
  const [isLoadedExportDailyReport, setIsLoadedExportDailyReport] = useState<boolean>(false)
  const [isLoadedExportDailyPOSReport, setIsLoadedExportDailyPOSReport] = useState<boolean>(false)
  const [reportType, setReportType] = useState<'POS' | 'Daily'>()

  const handleExportDailyPOSReport = async () => {
    setReportType('POS')
    setIsLoadedExportDailyPOSReport(false)
  }

  const handleExportDailyReport = async () => {
    setReportType('Daily')
    setIsLoadedExportDailyReport(false)
  }

  useEffect(() => {
    if (isLoadedExportDailyPOSReport) {
      window?.print()
    }
  }, [isLoadedExportDailyPOSReport])

  useEffect(() => {
    if (isLoadedExportDailyReport) {
      window?.print()
    }
  }, [isLoadedExportDailyReport])

  return (
    <div className="flex items-center gap-4">
      {reportType === 'POS' && (
        <PrintDailyReportPOSPortal
          onLoaded={() => {
            setIsLoadedExportDailyPOSReport(true)
          }}
        />
      )}
      {reportType === 'Daily' && (
        <PrintDailyReportPortal
          onLoaded={() => {
            setIsLoadedExportDailyReport(true)
          }}
        />
      )}
      <Button size="lg" variant="outline" onClick={handleExportDailyPOSReport}>
        <ExportIcon className="size-6" />
        Xuất báo cáo nộp tiền POS
      </Button>
      <Button size="lg" variant="outline" onClick={handleExportDailyReport}>
        <ExportIcon className="size-6" />
        Xuất báo cáo nộp tiền cuối ngày
      </Button>
    </div>
  )
}

export default DailyReportAction
