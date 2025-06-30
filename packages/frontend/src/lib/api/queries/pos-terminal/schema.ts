export enum PosTerminalStatus {
  'ACTIVED' = 'ACTIVED',
  'INACTIVED' = 'INACTIVED',
  'MAINTENANCE' = 'MAINTENANCE',
}

export interface ILCPosTerminal {
  _id: string;

  createdAt: Date;

  updatedAt: Date;

  ID: string;

  name: string;

  location: string;

  posCode: string;

  status?: PosTerminalStatus;

  otherDevices?: string[];
}

export interface ICreatePosDto {
  ID: string;
  name: string;
  location: string;
  posCode: string;
  otherDevices?: string[];
  status?: PosTerminalStatus;
}

export interface IUpdatePosDto {
  ID?: string;
  name?: string;
  location?: string;
  posCode?: string;
  otherDevices?: string[];
  status?: PosTerminalStatus;
}
