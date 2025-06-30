import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/constants/pagination.constant'

export function getPaginationQuery(query: Record<string, any>): PaginationQuery {
  const { page, pageSize, size, sortBy, sortOrder, isExportExcel, receiverEmail, ...filters } = query

  return {
    page: page ? Number(page) : DEFAULT_PAGE,
    pageSize: pageSize || size ? Number(pageSize || size) : DEFAULT_PAGE_SIZE,
    sort: {
      [sortBy ?? 'createdAt']: sortOrder ? (sortOrder === 'asc' ? 1 : -1) : -1,
    } as Record<string, 1 | -1>,
    isExportExcel: isExportExcel ? true : false,
    filters,
    receiverEmail,
  }
}

export type PaginationQuery = {
  page: number
  pageSize: number
  sort: Record<string, 1 | -1>
  isExportExcel: boolean
  filters: Record<string, any>
  receiverEmail?: string
}
