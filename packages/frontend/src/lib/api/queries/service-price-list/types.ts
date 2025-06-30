import { ILocalizedText } from '../service/types'

export interface ILCServicePriceList {
  _id: string
  title: {
    vi: string
    en: string
  }
  applyDays: string[]
  isDefault: boolean
  isDeleted: boolean
}

export interface ILCTranformServicePriceList extends ILCServicePriceList {
  saleChannelPriceConfigs: ILCSaleChannelPriceConfig[]
}

export interface ILCSaleChannelPriceConfig {
  saleChannelId: string
  saleChannelName: string
  saleChannelCode: string
  isActive: boolean
  groupPriceConfigs: IGroupPriceConfig[]
}
export interface IGroupPriceConfig {
  serviceId: string
  serviceTitle: ILocalizedText
  priceConfigs: IPriceConfig[]
}

export interface IPriceConfig {
  id: string
  serviceTitle: ILocalizedText
  targetTitle: ILocalizedText
  targetShortTitle: ILocalizedText
  price: number
  serviceCode?: string
}

export interface ICreateServicePriceListDto {
  title: {
    vi: string
    en: string
  }

  baseServicePriceListId?: string

  baseServicePriceListType?: string
}
