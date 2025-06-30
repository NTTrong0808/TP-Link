'use client'
import SolidLine from '@/components/widgets/solid-line'
import PrintLayout from '@/features/print/layouts/print-layout'
import { useMe } from '@/lib/api/queries/auth/get-me'
import { formatInternationalWithoutCurrency } from '@/utils/currency'
import { appDayJs } from '@/utils/dayjs'
import { ComponentProps, memo, useImperativeHandle, useRef } from 'react'

// Data as props
const DataReportContent = ({
  ref,
  reportData,
}: ComponentProps<'div'> & {
  reportData: {
    totalBank: number
    totalCash: number
    totalPayoo: number
    totalPoint: number
    totalVoucher: number
    cashierName: string
  }
}) => {
  const printRef = useRef<HTMLDivElement | null>(null)
  useImperativeHandle(ref, () => printRef.current as HTMLDivElement)
  const { data: currentUser } = useMe()
  return (
    <PrintLayout className="daily-report" ref={printRef}>
      <div className="flex flex-col">
        <h2 className="!text-xl !font-langfarm text-left">BÁO CÁO NỘP TIỀN CUỐI NGÀY</h2>
        <span className="text-xs">Ngày: {appDayJs().format('DD/MM/YYYY')}</span>
        <span className="text-xs"> Người in: {`${currentUser?.data?.lastName} ${currentUser?.data?.firstName}`}</span>
        <span className="text-xs"> Thời gian in: {appDayJs().format('DD/MM/YYYY HH:mm:ss')}</span>
      </div>
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr>
            <th className="border border-black p-[6px] text-left">STT</th>
            <th className="border border-black p-[6px] text-left">Chỉ tiêu</th>
            <th className="border border-black p-[6px] text-left">Số tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-[6px] font-bold">I</td>
            <td className="border border-black p-[6px] font-bold">Tổng doanh số</td>
            <td className="border border-black p-[6px] text-end">
              {formatInternationalWithoutCurrency(
                reportData?.totalBank +
                  reportData?.totalCash +
                  reportData?.totalPayoo +
                  reportData?.totalPoint +
                  reportData?.totalVoucher,
                ',',
              )}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[6px] text-end">1</td>
            <td className="border border-black p-[6px]">Tiền mặt</td>
            <td className="border border-black p-[6px] text-end">
              {formatInternationalWithoutCurrency(reportData.totalCash, ',') ?? ''}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[6px] text-end">2</td>
            <td className="border border-black p-[6px]">Payoo</td>
            <td className="border border-black p-[6px] text-end">
              {formatInternationalWithoutCurrency(reportData.totalPayoo, ',') ?? ''}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[6px] text-end">3</td>
            <td className="border border-black p-[6px]">Chuyển khoản</td>
            <td className="border border-black p-[6px] text-end">
              {formatInternationalWithoutCurrency(reportData.totalBank, ',') ?? ''}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[6px] text-end">4</td>
            <td className="border border-black p-[6px]">Voucher</td>
            <td className="border border-black p-[6px] text-end">
              {formatInternationalWithoutCurrency(reportData.totalVoucher, ',') ?? ''}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[6px] text-end">5</td>
            <td className="border border-black p-[6px]">Điểm</td>
            <td className="border border-black p-[6px] text-end">{reportData.totalPoint ?? ''}</td>
          </tr>
          <tr>
            <td className="border border-black p-[6px] font-bold">II</td>
            <td className="border border-black p-[6px] font-bold">Tiền mặt phải nộp</td>
            <td className="border border-black p-[6px] text-end">
              {formatInternationalWithoutCurrency(reportData.totalCash, ',') ?? ''}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[6px] text-end">1</td>
            <td className="border border-black p-[6px]">Thực nộp</td>
            <td className="border border-black p-[6px] text-end"></td>
          </tr>
          <tr>
            <td className="border border-black p-[6px] text-end">2</td>
            <td className="border border-black p-[6px]">Chênh lệch</td>
            <td className="border border-black p-[6px] text-end"></td>
          </tr>
        </tbody>
      </table>

      <span className="text-xs">Ghi chú: </span>

      <div className="mt-4 mb-16 flex justify-between text-[12px]">
        <div className="w-[45%] text-center">
          <p>Người giao</p>
          <p>(Ký, ghi họ tên)</p>
        </div>
        <div className="w-[45%] text-center">
          <p>Người nhận</p>
          <p>(Ký, ghi họ tên)</p>
        </div>
      </div>
      <SolidLine />
    </PrintLayout>
  )
}

export default memo(DataReportContent)
