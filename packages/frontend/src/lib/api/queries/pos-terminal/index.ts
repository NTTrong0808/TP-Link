import { AxiosInstance } from 'axios';
import { consumerApi } from '../..';
import { ApiResponse } from '../../schema';
import { ICreatePosDto, ILCPosTerminal, IUpdatePosDto } from './schema';

export class PosTerminalService {
  private axiosInstance: AxiosInstance;

  public static API_PATHS = {
    GET_POS_TERMINALS: '/pos-terminal',
  };

  constructor() {
    this.axiosInstance = consumerApi;
  }

  async getPosTerminals(filters?: { search?: string; status?: string[] }) {
    const result = await this.axiosInstance.get<ApiResponse<ILCPosTerminal[]>>(
      PosTerminalService.API_PATHS.GET_POS_TERMINALS,
      {
        params: { ...filters, status: filters?.status?.join(',') ?? undefined },
      }
    );
    return result?.data;
  }

  async createPos(dto: ICreatePosDto) {
    const result = await this.axiosInstance.post<ApiResponse<ILCPosTerminal>>(
      PosTerminalService.API_PATHS.GET_POS_TERMINALS,
      dto
    );
    return result?.data;
  }

  async update(id: string, dto: IUpdatePosDto) {
    const result = await this.axiosInstance.put<ApiResponse<ILCPosTerminal>>(
      PosTerminalService.API_PATHS.GET_POS_TERMINALS + `/${id}`,
      dto
    );
    return result?.data;
  }

  async deletePos(posId: string) {
    const result = await this.axiosInstance.delete<ApiResponse<ILCPosTerminal>>(
      PosTerminalService.API_PATHS.GET_POS_TERMINALS + `/${posId}`
    );
    return result?.data;
  }
}

export const posTerminalService = new PosTerminalService();
