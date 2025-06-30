'use client'
import { useRef } from 'react'

import { TableRefProps } from '@/components/advanced-table'
import { PanelView } from '@/layouts/panel/panel-view'
import IssuedTicketListFilter from '../components/issued-ticket-list-filter'
import IssuedTicketListTable from '../components/issued-ticket-list-table'

const IssuedTicketList = () => {
  const tableRef = useRef<TableRefProps>(null)

  const handleClearFilters = () => {
    tableRef.current?.clearFilters()
  }

  return (
    <PanelView>
      <IssuedTicketListFilter handleClearFilters={handleClearFilters} />
      <IssuedTicketListTable ref={tableRef} />
    </PanelView>
  )
}

export default IssuedTicketList
