import { AxiosInstance } from 'axios';
import { consumerApi } from '../..';
import { ApiResponse } from '../../schema';
import { ICreateServiceDto, IUpdateServiceDto, ServiceType } from './types';
import { ILCService, ILCServiceWithPrice } from './schema';

export class ServiceService {
  private axiosInstance: AxiosInstance;

  public static API_PATHS = {
    GET_SERVICES: '/services',
    GET_SERVICE_BY_ID: '/services/:id',
    ARRANGE_SERVICES: '/services/arrange',
    GET_SERVICES_BY_SALE_CHANNEL_CODE:
      '/services/by-sale-channel-code-and-date',
  };

  constructor() {
    this.axiosInstance = consumerApi;
  }

  async getServices(filters?: { type?: ServiceType }) {
    const result = await this.axiosInstance.get<ApiResponse<ILCService[]>>(
      ServiceService.API_PATHS.GET_SERVICES,
      {
        params: filters,
      }
    );
    return result?.data?.data ?? [];
  }

  async getServiceById(serviceId: string) {
    const result = await this.axiosInstance.get<ApiResponse<ILCService>>(
      ServiceService.API_PATHS.GET_SERVICE_BY_ID.replace(':id', serviceId)
    );
    return result?.data?.data;
  }

  async createService(dto: ICreateServiceDto) {
    const result = await this.axiosInstance.post<ApiResponse<ILCService>>(
      ServiceService.API_PATHS.GET_SERVICES,
      dto
    );
    return result?.data?.data;
  }

  async arrangeServices(positions: { serviceId: string; position: number }[]) {
    const result = await this.axiosInstance.post<ApiResponse<ILCService>>(
      ServiceService.API_PATHS.ARRANGE_SERVICES,
      {
        positions,
      }
    );
    return result?.data?.data;
  }

  async getServicesBySaleChannelCode({
    saleChannelCode,
    date,
  }: {
    saleChannelCode: string;
    date: string;
  }) {
    const result = await this.axiosInstance.post<
      ApiResponse<ILCServiceWithPrice[]>
    >(ServiceService.API_PATHS.GET_SERVICES_BY_SALE_CHANNEL_CODE, {
      saleChannelCode,
      date,
    });
    return result?.data?.data;
  }

  async updateService(serviceId: string, dto: IUpdateServiceDto) {
    const result = await this.axiosInstance.put<ApiResponse<ILCService>>(
      ServiceService.API_PATHS.GET_SERVICE_BY_ID.replace(':id', serviceId),
      dto
    );
    return result?.data?.data;
  }

  async disableOrEnableService(serviceId: string, isActive: boolean) {
    const result = await this.axiosInstance.put<ApiResponse<ILCService>>(
      ServiceService.API_PATHS.GET_SERVICE_BY_ID.replace(':id', serviceId),
      {
        isActive,
      }
    );
    return result?.data?.data;
  }

  async deleteService(serviceId: string) {
    const result = await this.axiosInstance.delete<ApiResponse<ILCService>>(
      ServiceService.API_PATHS.GET_SERVICE_BY_ID.replace(':id', serviceId)
    );
    return result?.data?.data;
  }
}

export const serviceService = new ServiceService();
