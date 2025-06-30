import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ProductVariantService } from './product-variant.service'
import { ImportProductVariantArrayDto } from './dto/import-product-variants'
import { ApiBuilder, ApiMeta } from '@src/lib/api'
import { AppVersion } from '@src/enums/app.enum'
import { getPaginationQuery } from '@src/utils/get-pagination-query'

@Controller({ path: 'product-variants', version: AppVersion.v1 })
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  // @Post()
  // async getProductVariantsPagination(@Body() body: Record<string, any>, @Query() query: Record<string, any>) {
  //   const { page, pageSize, sort, isExportExcel, receiverEmail } = getPaginationQuery(query)
  //   const advancedFilters = this.productVariantService.getAdvanceFilter(body?.advancedFilters) ?? {}
  //   const _filters = { ...advancedFilters }

  //   const result = await this.productVariantService.getPaginatedOrders({
  //     page: Number(page ?? 1),
  //     pageSize: Number(pageSize ?? 100),
  //     sort,
  //     filters: _filters,
  //     isExportExcel,
  //     receiverEmail,
  //   })

  //   return ApiBuilder.create()
  //     .setData(result?.[0])
  //     .setMeta(result?.[1] as ApiMeta)
  //     .setMessage('Success')
  //     .build()
  // }

  // @Post('/import')
  // async importProductVariants(@Body() body: ImportProductVariantArrayDto) {
  //   const result = await this.productVariantService.importProductVariants(body)
  //   return ApiBuilder.create().setData(result).setMessage('POS create successfully').build()
  // }
}
