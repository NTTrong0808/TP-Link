import { AxiosInstance } from 'axios'
import { consumerApi } from '../..'
import { ApiResponse } from '../../schema'
import { ICreateServicePriceListDto, ILCServicePriceList, ILCTranformServicePriceList } from './types'

export class ServicePriceListService {
  private axiosInstance: AxiosInstance

  public static API_PATHS = {
    GET_ALL_SERVICE_PRICE_LIST: '/service-price-list',
    GET_SERVICE_PRICE_LIST_BY_ID: '/service-price-list/:id',
  }

  constructor() {
    this.axiosInstance = consumerApi
  }

  async getAllServicePriceList() {
    const result = await this.axiosInstance.get<ApiResponse<ILCServicePriceList[]>>(
      ServicePriceListService.API_PATHS.GET_ALL_SERVICE_PRICE_LIST,
    )
    return result?.data?.data ?? []
  }

  async getServicePriceListById(servicePriceListId: string) {
    const result = await this.axiosInstance.get<ApiResponse<ILCTranformServicePriceList>>(
      ServicePriceListService.API_PATHS.GET_SERVICE_PRICE_LIST_BY_ID.replace(':id', servicePriceListId),
    )
    return result?.data?.data
  }

  async createServicePriceList(dto: ICreateServicePriceListDto) {
    const result = await this.axiosInstance.post<ApiResponse<ILCTranformServicePriceList>>(
      ServicePriceListService.API_PATHS.GET_ALL_SERVICE_PRICE_LIST,
      dto,
    )

    return result?.data?.data
  }

  async deleteServicePriceList(servicePriceListId: string) {
    const result = await this.axiosInstance.delete<ApiResponse<ILCTranformServicePriceList>>(
      ServicePriceListService.API_PATHS.GET_SERVICE_PRICE_LIST_BY_ID.replace(':id', servicePriceListId),
    )

    return result?.data?.data
  }

  async updateServicePriceList(
    servicePriceListId: string,
    priceConfigs: Record<string, number>,
    priceConfigServiceCodes: Record<string, string>,
  ) {
    const filteredPriceConfigs = Object.fromEntries(
      Object.entries(priceConfigs)
        .filter(([_, value]) => value !== undefined)
        .map(([_, value]) => [_, Number(value)]),
    )
    const filteredPriceConfigServiceCodes = Object.fromEntries(Object.entries(priceConfigServiceCodes).filter(Boolean))
    const result = await this.axiosInstance.put<ApiResponse<ILCTranformServicePriceList>>(
      ServicePriceListService.API_PATHS.GET_SERVICE_PRICE_LIST_BY_ID.replace(':id', servicePriceListId),
      { priceConfigs: filteredPriceConfigs, priceConfigServiceCodes: filteredPriceConfigServiceCodes },
    )

    return result?.data?.data
  }
}

export const servicePriceListService = new ServicePriceListService()
