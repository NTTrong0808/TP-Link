import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductVariantService } from './product-variant.service'
import { ProductVariantController } from './product-variant.controller'
import { ProductVariantV2, ProductVariantV2Schema } from './schemas/product-variant.schema'
import { SharedModule } from '../shared/shared.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductVariantV2.name,
        schema: ProductVariantV2Schema,
        collection: 'productvariantsv2',
      },
    ]),
    SharedModule,
  ],
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
  exports: [ProductVariantService],
})
export class ProductVariantModule {}
