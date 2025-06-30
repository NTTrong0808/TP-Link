import { AxiosInstance } from 'axios'
import { consumerApi } from '../..'
import { ApiResponse } from '../../schema'
import { ILCScannerTerminal, ICreateScannerDto, IUpdateScannerDto } from './schema'

export class ScannerTerminalService {
  private axiosInstance: AxiosInstance

  public static API_PATHS = {
    GET_SCANNER_TERMINALS: '/scanner-terminal',
  }

  constructor() {
    this.axiosInstance = consumerApi
  }

  async getScannerTerminals(filters?: { search?: string; status?: string[] }) {
    const result = await this.axiosInstance.get<ApiResponse<ILCScannerTerminal[]>>(
      ScannerTerminalService.API_PATHS.GET_SCANNER_TERMINALS,
      {
        params: { ...filters, status: filters?.status?.join(',') ?? undefined },
      },
    )
    return result?.data
  }

  async createScanner(dto: ICreateScannerDto) {
    const result = await this.axiosInstance.post<ApiResponse<ILCScannerTerminal>>(
      ScannerTerminalService.API_PATHS.GET_SCANNER_TERMINALS,
      dto,
    )
    return result?.data
  }

  async update(id: string, dto: IUpdateScannerDto) {
    const result = await this.axiosInstance.put<ApiResponse<ILCScannerTerminal>>(
      ScannerTerminalService.API_PATHS.GET_SCANNER_TERMINALS + `/${id}`,
      dto,
    )
    return result?.data
  }

  async deleteScanner(posId: string) {
    const result = await this.axiosInstance.delete<ApiResponse<ILCScannerTerminal>>(
      ScannerTerminalService.API_PATHS.GET_SCANNER_TERMINALS + `/${posId}`,
    )
    return result?.data
  }
}

export const scannerTerminalService = new ScannerTerminalService()
