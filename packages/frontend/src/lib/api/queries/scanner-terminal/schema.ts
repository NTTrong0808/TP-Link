export enum ScannerTerminalStatus {
  ACTIVED = 'ACTIVED',
  INACTIVED = 'INACTIVED',
  MAINTENANCE = 'MAINTENANCE',
}

export interface ServiceInfo {
  serviceId: string
  serviceName: string
}

export interface ILCScannerTerminal {
  _id: string
  ID: string
  name: string
  services: ServiceInfo[]
  status?: ScannerTerminalStatus
  createdAt?: Date
  updatedAt?: Date
}

export interface ICreateScannerDto {
  ID: string
  name: string
  services: ServiceInfo[]
  status?: ScannerTerminalStatus
}

export interface IUpdateScannerDto {
  ID?: string
  name?: string
  services?: ServiceInfo[]
  status?: ScannerTerminalStatus
}
