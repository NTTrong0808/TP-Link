export enum ProductVariantStatus {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEACTIVATING = 'DEACTIVATING',
}

export interface IProductVariant {
  _id: string

  variantCode?: string

  name: string

  status: ProductVariantStatus

  barcode?: string

  unitName: string

  localPrice: number

  nationalPrice: number

  vatIn: number

  vatOut: number

  boxSpecification?: string

  expirationDate?: string

  expirationUnit?: string

  categoryId?: string

  collectionId?: string

  brandId?: string

  saleGroup?: string

  brandName?: string
  collectionName?: string
  categoryName?: string
  index: number
}

export interface IImportProductVariantDto {
  variantCode?: string

  name: string

  status: ProductVariantStatus

  barcode?: string

  unitName: string

  localPrice: number

  nationalPrice: number

  vatIn: number

  vatOut: number

  boxSpecification?: string

  expirationDate?: string

  expirationUnit?: string

  categoryId?: string

  collectionId?: string

  brandId?: string

  saleGroup?: string
}
