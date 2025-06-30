import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ProductVariantV2Document = HydratedDocument<ProductVariantV2> & {
  brandName?: string
  collectionName?: string
  categoryName?: string
}

export enum ProductVariantStatus {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEACTIVATING = 'DEACTIVATING',
}

@Schema({
  timestamps: true,
  collection: 'productvariantsv2',
})
export class ProductVariantV2 {
  @Prop()
  variantCode?: string

  @Prop()
  name: string

  @Prop({ required: true, enum: ProductVariantStatus, default: ProductVariantStatus.NEW })
  status: ProductVariantStatus

  @Prop()
  barcode?: string

  @Prop()
  unitName: string

  @Prop({ type: Number })
  localPrice: number

  @Prop({ type: Number })
  nationalPrice: number

  @Prop({ type: Number })
  vatIn: number

  @Prop({ type: Number })
  vatOut: number

  @Prop()
  boxSpecification?: string

  @Prop()
  expirationDate?: string

  @Prop()
  expirationUnit?: string

  @Prop()
  categoryId?: string

  @Prop()
  collectionId?: string

  @Prop()
  brandId?: string

  @Prop()
  saleGroup?: string
}

export const ProductVariantV2Schema = SchemaFactory.createForClass(ProductVariantV2)
