import { AxiosInstance } from 'axios';
import { consumerApi } from '../..';
import { ApiResponse } from '../../schema';
import { IServicePriceConfigByMonthYear } from './types';

export class ServicePriceConfigService {
  private axiosInstance: AxiosInstance;

  public static API_PATHS = {
    GET_SERVICE_PRICE_CONFIG_BY_MONTH:
      '/service-price-list/price-config/:month/:year',
    CONFIG_SERVICE_PRICE_LIST: '/service-price-list/config',
    REMOVE_CONFIG_SERVICE_PRICE_LIST: '/service-price-list/remove-config',
    REMOVE_CONFIG_SERVICE_PRICE_LIST_A_DAY:
      '/service-price-list/remove-config-a-day',
  };

  constructor() {
    this.axiosInstance = consumerApi;
  }

  async getServicePriceConfigsByMonthYear(month: number, year: number) {
    const result = await this.axiosInstance.get<
      ApiResponse<IServicePriceConfigByMonthYear[]>
    >(
      ServicePriceConfigService.API_PATHS.GET_SERVICE_PRICE_CONFIG_BY_MONTH.replace(
        ':month',
        String(month)
      ).replace(':year', String(year))
    );
    return result?.data?.data ?? [];
  }

  async configServicePriceList(days: string[], servicePriceListId: string) {
    const result = await this.axiosInstance.post<
      ApiResponse<IServicePriceConfigByMonthYear[]>
    >(ServicePriceConfigService.API_PATHS.CONFIG_SERVICE_PRICE_LIST, {
      days,
      servicePriceListId,
    });
    return result?.data?.data ?? [];
  }

  async removeConfigServicePriceList(date: string, servicePriceListId: string) {
    const result = await this.axiosInstance.post<
      ApiResponse<IServicePriceConfigByMonthYear[]>
    >(ServicePriceConfigService.API_PATHS.REMOVE_CONFIG_SERVICE_PRICE_LIST, {
      date,
      servicePriceListId,
    });
    return result?.data?.data ?? [];
  }

  async removeConfigServicePriceListADay(
    date: string,
    servicePriceListId: string
  ) {
    const result = await this.axiosInstance.post<
      ApiResponse<IServicePriceConfigByMonthYear[]>
    >(
      ServicePriceConfigService.API_PATHS
        .REMOVE_CONFIG_SERVICE_PRICE_LIST_A_DAY,
      {
        date,
        servicePriceListId,
      }
    );
    return result?.data?.data ?? [];
  }
}

export const servicePriceConfigService = new ServicePriceConfigService();
