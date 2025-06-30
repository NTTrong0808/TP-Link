export interface ILocalizedText {
  vi: string
  en: string
}

export enum ServiceType {
  SINGLE_SERVICE = 'SINGLE_SERVICE',
  PACKAGE_SERVICE = 'PACKAGE_SERVICE',
}

export interface ICreateServiceDto {
  shortTitle: ILocalizedText

  title: ILocalizedText

  invoiceTitle?: string

  invoiceUnit: string // Gói, Vé,...

  description: ILocalizedText

  image: string

  note?: string

  type?: ServiceType

  childServiceIds?: string[]

  childServiceNumOfUses?: Record<string, number>
}

export interface IUpdateServiceDto {
  shortTitle?: ILocalizedText

  title?: ILocalizedText

  invoiceTitle?: string

  invoiceUnit?: string // Gói, Vé,...

  description?: ILocalizedText

  image?: string

  note?: string

  type?: ServiceType

  childServiceIds?: string[]

  childServiceNumOfUses?: Record<string, number>
}
