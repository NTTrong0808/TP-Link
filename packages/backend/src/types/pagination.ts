export interface IPagination<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
}
