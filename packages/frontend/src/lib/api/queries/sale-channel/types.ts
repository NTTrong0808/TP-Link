export enum GroupSaleChannel {
  'ONLINE' = 'ONLINE',
  'OFFLINE' = 'OFFLINE',
}

export const GroupSaleChannelLabel = {
  [GroupSaleChannel.ONLINE]: 'Online',
  [GroupSaleChannel.OFFLINE]: 'Offline',
}

export interface SaleChannel {
  _id: string
  groupSaleChannel: GroupSaleChannel
  name: string
  code: string
  isActive: boolean
  services: string[]
  createdAt: string
  updatedAt: string
}
