import { AxiosInstance } from 'axios'
import { consumerApi } from '../..'
import { ApiResponse } from '../../schema'
import { CreateCustomerDto, CustomerType, ILCCustomer, ILCCustomerHistory, UpdateCustomerDto } from './schema'

export class CustomerService {
  private axiosInstance: AxiosInstance

  public static API_PATHS = {
    GET_CUSTOMERS: '/customers',
    GET_CUSTOMERS_PAGINATION: '/customers/pagination',
    GET_CUSTOMER_BY_ID: '/customers/:id',
    GET_CUSTOMER_STATISTICS: '/bookings/statistics/:id',
    GET_CUSTOMER_HISTORY_CHANGE: '/customers/:id/history',
  }

  constructor() {
    this.axiosInstance = consumerApi
  }

  async getAllCustomers(filters: { type?: CustomerType; isActive?: boolean }) {
    const result = await this.axiosInstance.get<ApiResponse<ILCCustomer[]>>(CustomerService.API_PATHS.GET_CUSTOMERS, {
      params: filters,
    })
    return result?.data?.data ?? []
  }

  async getAllCustomersPagination(variables: {
    size?: number
    page?: number
    search?: string
    type?: CustomerType[]
    status?: boolean[]
  }) {
    const result = await this.axiosInstance.get<ApiResponse<ILCCustomer[]>>(
      CustomerService.API_PATHS.GET_CUSTOMERS_PAGINATION,
      {
        params: {
          ...variables,
          status: variables?.status && variables?.status?.length !== 0 ? variables.status.join(',') : undefined,
          type: variables?.type && variables?.type?.length !== 0 ? variables.type.join(',') : undefined,
        },
      },
    )
    return result?.data
  }

  async getCustomerById(id: string) {
    const result = await this.axiosInstance.get<ApiResponse<ILCCustomer>>(
      CustomerService.API_PATHS.GET_CUSTOMER_BY_ID.replace(':id', id),
    )
    return result?.data?.data ?? null
  }

  async getCustomerStatistics(id: string) {
    const result = await this.axiosInstance.get<
      ApiResponse<{
        totalBookings: number
        totalTickets: number
        totalPaid: number
      }>
    >(CustomerService.API_PATHS.GET_CUSTOMER_STATISTICS.replace(':id', id))
    return result?.data?.data
  }

  async deleteCustomer(id: string) {
    const result = await this.axiosInstance.delete<ApiResponse<ILCCustomer>>(
      CustomerService.API_PATHS.GET_CUSTOMER_BY_ID.replace(':id', id),
    )
    return result?.data?.data
  }

  async updateCustomer(id: string, dto: UpdateCustomerDto) {
    const result = await this.axiosInstance.put<ApiResponse<ILCCustomer>>(
      CustomerService.API_PATHS.GET_CUSTOMER_BY_ID.replace(':id', id),
      dto,
    )
    return result?.data?.data
  }

  async createCustomer(dto: CreateCustomerDto) {
    const result = await this.axiosInstance.post<ApiResponse<ILCCustomer>>(CustomerService.API_PATHS.GET_CUSTOMERS, dto)
    return result?.data?.data
  }

  async getCustomerHistory(id: string) {
    const result = await this.axiosInstance.get<ApiResponse<ILCCustomerHistory[]>>(
      CustomerService.API_PATHS.GET_CUSTOMER_HISTORY_CHANGE.replace(':id', id),
    )
    return result?.data
  }
}

export const customerService = new CustomerService()
