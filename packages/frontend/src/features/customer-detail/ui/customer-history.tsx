'use client'

import { DataTable } from '@/components/data-table'
import ArrowRightIcon from '@/components/widgets/icons/arrow-right-icon'
import CustomerStatusChip from '@/features/customer/components/customer-status-chip'
import { PanelView, PanelViewContent } from '@/layouts/panel/panel-view'
import useHeader from '@/layouts/panel/use-header'
import { useCustomerHistoryChange } from '@/lib/api/queries/customer/get-customer-history-change'
import { ILCCustomerHistory } from '@/lib/api/queries/customer/schema'
import { appDayJs } from '@/utils/dayjs'
import { ColumnDef } from '@tanstack/react-table'
import { useParams } from 'next/navigation'
import { CUSTOMER_FIELD_LABEL } from '../constants'

const CustomerHistory = () => {
  const { id } = useParams()

  useHeader({
    isBack: true,
  })
  const { data } = useCustomerHistoryChange({ variables: { id: id as string } })

  const columns: ColumnDef<ILCCustomerHistory>[] = [
    {
      header: 'Thời gian',
      accessorKey: 'changeAt',
      cell: ({ row }) => {
        return <div className="py-4 text-nowrap">{appDayJs(row.original.changeAt).format('DD/MM/YYYY HH:mm:ss')}</div>
      },
      meta: {
        columnClassName: 'align-top',
      },
    },
    {
      header: 'Người thực hiện',
      accessorKey: 'changeByName',
      cell: ({ row }) => {
        return <div className="py-4 text-nowrap">{row.original.changeByName}</div>
      },
      meta: {
        columnClassName: 'align-top',
      },
    },
    {
      header: 'Nội dung thay đổi',
      accessorKey: 'actionType',
      cell: ({ row }) => {
        const changes = row.original.changes
        const changeKeys = Object.keys(changes)?.filter((key) => CUSTOMER_FIELD_LABEL[key])

        return (
          <div className="py-4 grid grid-cols-2 gap-4 relative">
            {/* <div className="absolute top-1/2 right-1/2 -translate-y-1/2 bg-transparent ">
              <ArrowRightIcon className="w-4 h-4 text-neutral-grey-300" />
            </div> */}
            {changeKeys?.map((key) => {
              const oldValue =
                typeof changes[key]?.at(0) === 'boolean' ? (
                  <CustomerStatusChip isActive={changes[key]?.at(0) ?? false} />
                ) : (
                  changes[key]?.at(0)
                )
              const newValue =
                typeof changes[key]?.at(1) === 'boolean' ? (
                  <CustomerStatusChip isActive={changes[key]?.at(1) ?? false} />
                ) : (
                  changes[key]?.at(1)
                )
              return (
                <>
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-neutral-grey-400">{CUSTOMER_FIELD_LABEL[key] || key}</div>
                    <div className="text-sm text-neutral-black">{oldValue || ' '}</div>
                  </div>

                  <div className="flex flex-col gap-1 relative">
                    <div className="absolute top-1/2 left-0 -translate-x-6 -translate-y-1/2 bg-transparent ">
                      <ArrowRightIcon className="w-4 h-4 text-neutral-grey-300" />
                    </div>
                    <div className="text-xs text-neutral-grey-400">{CUSTOMER_FIELD_LABEL[key]}</div>
                    <div className="text-sm text-neutral-black">{newValue}</div>
                  </div>
                </>
              )
            })}
          </div>
        )
      },
    },
  ]

  return (
    <PanelView>
      <PanelViewContent className="px-24">
        <DataTable
          data={data?.data || []}
          columns={columns}
          pagination={{
            hidden: true,
          }}
          tableClassName="table-auto"
        />
      </PanelViewContent>
    </PanelView>
  )
}

export default CustomerHistory
