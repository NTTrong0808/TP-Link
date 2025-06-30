import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ProductVariantV2, ProductVariantV2Document, ProductVariantStatus } from './schemas/product-variant.schema'
import { ImportProductVariantArrayDto } from './dto/import-product-variants'
import { appDayJs } from '@src/lib/dayjs'
import { IPagination } from '@src/types/pagination'
import { ApiMeta } from '@src/lib/api'
import { ExcelService } from '../shared/excel/excel.service'
import { MailService } from '../shared/mail/mail.service'

export const ImportProductVariantStatus = {
  Mới: ProductVariantStatus.NEW,
  'Đang hoạt động': ProductVariantStatus.ACTIVE,
  'Ngừng hoạt động': ProductVariantStatus.INACTIVE,
  'Sắp ngừng hoạt động': ProductVariantStatus.DEACTIVATING,
}
const mappingStatus = (status: ProductVariantStatus) => {
  if (status === ProductVariantStatus.NEW) {
    return 'Mới'
  }
  if (status === ProductVariantStatus.ACTIVE) {
    return 'Đang hoạt động'
  }
  if (status === ProductVariantStatus.DEACTIVATING) {
    return 'Sắp ngừng hoạt động'
  }
  return 'Ngừng hoạt động'
}
@Injectable()
export class ProductVariantService {
  constructor(
    @InjectModel(ProductVariantV2.name) private productVariantModel: Model<ProductVariantV2Document>,
    private excelService: ExcelService,
    private sendEmailService: MailService,
  ) {}

  // async getPaginatedOrders({
  //   page,
  //   pageSize,
  //   sort,
  //   filters,
  //   isExportExcel,
  //   receiverEmail,
  // }: {
  //   page: number
  //   pageSize: number
  //   sort: Record<string, 1 | -1>
  //   filters: Record<string, any>
  //   isExportExcel?: boolean
  //   receiverEmail?: string
  // }) {
  //   try {
  //     if (isExportExcel) {
  //       if (receiverEmail) await this.getExcelOrders({ filters, receiverEmail })
  //     } else {
  //       const skip = (page - 1) * pageSize
  //       const [data, total] = await Promise.all([
  //         this.productVariantModel.find(filters).sort(sort).skip(skip).limit(pageSize).lean(),
  //         this.productVariantModel.countDocuments(filters),
  //       ])

  //       const brands = await this.brandModel.find().lean()
  //       const collections = await this.collectionModel.find().lean()
  //       const categories = await this.categoryModel.find().lean()

  //       return [
  //         data.map((e, index) => ({
  //           ...e,
  //           index: index + 1 + pageSize * (page - 1),
  //           brandName: brands.find((_) => _._id?.toString() === e.brandId)?.name,
  //           collectionName: collections.find((_) => _._id?.toString() === e.collectionId)?.name,
  //           categoryName: categories.find((_) => _._id?.toString() === e.categoryId)?.name,
  //         })),
  //         {
  //           total,
  //           page,
  //           pageSize,
  //           size: pageSize,
  //           totalPages: Math.ceil(total / pageSize),
  //           hasNextPage: (page * pageSize || data.length) < total,
  //           hasPrevPage: page > 1,
  //         },
  //       ] as [ProductVariantV2Document[], Partial<IPagination<ProductVariantV2Document> & ApiMeta>]
  //     }
  //   } catch (error) {
  //     console.log('🚀 ~ ProductVariantService ~ error:', error)
  //   }
  // }

  // async getExcelOrders({ filters, receiverEmail }: { filters: Record<string, any>; receiverEmail: string }) {
  //   const data = await this.productVariantModel
  //     .find(filters)
  //     .sort({
  //       variantCode: 1,
  //     })
  //     .lean()

  //   const brands = await this.brandModel.find().lean()
  //   const collections = await this.collectionModel.find().lean()
  //   const categories = await this.categoryModel.find().lean()
  //   const items = data.map((e, index) => ({
  //     ...e,
  //     brandName: brands.find((_) => _._id?.toString() === e.brandId)?.name,
  //     collectionName: collections.find((_) => _._id?.toString() === e.collectionId)?.name,
  //     categoryName: categories.find((_) => _._id?.toString() === e.categoryId)?.name,
  //   }))

  //   const excelFile: any = await this.excelService.exportReport({
  //     title: 'Danh sách sản phẩm',
  //     filters: [],
  //     data: items,
  //     headers: this.mappingHeaderKeys(),
  //   })

  //   await this.sendEmailService.sendEmail(
  //     this.sendEmailService.setProductVariantsExcelBufferAttachmentOption({
  //       to: receiverEmail,
  //       excelBuffer: excelFile,
  //       fileName: `${appDayJs().format('YYMMDDHHmm')}-DanhSachSanPham.xlsx`,
  //     }),
  //   )

  //   return 'Oke'
  // }

  // mappingHeaderKeys() {
  //   return [
  //     {
  //       title: 'Mã sản phẩm',
  //       key: 'variantCode',
  //     },
  //     {
  //       title: 'Tên sản phẩm',
  //       key: 'name',
  //     },
  //     {
  //       title: 'Tình trạng',
  //       key: 'status',
  //       render(_: ProductVariantV2Document) {
  //         return mappingStatus(_.status)
  //       },
  //     },
  //     {
  //       title: 'Mã vạch',
  //       key: 'barcode',
  //     },
  //     {
  //       title: 'Đơn vị tính',
  //       key: 'unitName',
  //     },
  //     {
  //       title: 'Giá Đà Lạt',
  //       key: 'localPrice',
  //       isFormatCurrency: true,
  //     },
  //     {
  //       title: 'Giá toàn quốc',
  //       key: 'nationalPrice',
  //       isFormatCurrency: true,
  //     },
  //     {
  //       title: 'VAT đầu vào',
  //       key: 'vatIn',
  //     },
  //     {
  //       title: 'VAT đầu ra',
  //       key: 'vatOut',
  //     },
  //     {
  //       title: 'Quy cách thùng',
  //       key: 'expirationDate',
  //     },
  //     {
  //       title: 'Đơn vị hạn sử dụng',
  //       key: 'expirationUnit',
  //     },
  //     {
  //       title: 'Nhóm sản phẩm',
  //       key: 'collectionName',
  //     },
  //     {
  //       title: 'Thương hiệu',
  //       key: 'brandName',
  //     },
  //     {
  //       title: 'Nhóm doanh số',
  //       key: 'saleGroup',
  //     },
  //   ]
  // }

  // async importProductVariants(dto: ImportProductVariantArrayDto) {
  //   const brands = await this.brandModel.find().lean()
  //   const collections = await this.collectionModel.find().lean()
  //   const categories = await this.categoryModel.find().lean()

  //   const productVariants = dto.productVariants.map((e) => {
  //     const brand = brands.find((b) => b?.name?.toLowerCase() === e?.brandId?.toLowerCase())
  //     const collection = collections.find((c) => c?.name?.toLowerCase() === e?.collectionId?.toLowerCase())
  //     const category = categories.find((cat) => cat?.name?.toLowerCase() === e?.categoryId?.toLowerCase())

  //     return {
  //       ...e,
  //       brandId: brand?._id?.toString() || null,
  //       collectionId: collection?._id?.toString() || null,
  //       categoryId: category?._id?.toString() || null,
  //       status: ImportProductVariantStatus[e.status],
  //     }
  //   })

  //   const operations = productVariants.map((variant) => ({
  //     updateOne: {
  //       filter: { variantCode: variant.variantCode },
  //       update: { $set: variant },
  //       upsert: true,
  //     },
  //   }))

  //   if (operations.length > 0) {
  //     const result = await this.productVariantModel.bulkWrite(operations)
  //     return {
  //       insertedCount: result.upsertedCount,
  //       modifiedCount: result.modifiedCount,
  //       matchedCount: result.matchedCount,
  //     }
  //   }

  //   return {
  //     insertedCount: 0,
  //     modifiedCount: 0,
  //     matchedCount: 0,
  //   }
  // }

  // getAdvanceFilter(
  //   advancedFilters: {
  //     field: string
  //     operator?: string
  //     value: any
  //   }[],
  // ) {
  //   const mongoFilters: Record<string, any> = {}
  //   const isDate = (val: any): boolean => {
  //     return (
  //       Object.prototype.toString.call(val) === '[object Date]' || (typeof val === 'string' && !isNaN(Date.parse(val)))
  //     )
  //   }

  //   for (const filter of advancedFilters ?? []) {
  //     const { field, operator = 'equal', value } = filter

  //     if ((value === '' && operator !== 'empty') || value === null || value === undefined) {
  //       continue
  //     }

  //     const isValidDate = isDate(value)
  //     // Xử lý value ngày cho các trường đặc biệt unix hoặc bình thường
  //     const dateVal = isValidDate ? new Date(value) : null
  //     const dayjsDate = isValidDate ? appDayJs(value) : null

  //     switch (operator) {
  //       case 'equal':
  //         if (field === 'vatInfo') {
  //           mongoFilters['invoiceIssuedData.invNo'] = {
  //             $exists: value === 'VAT' ? true : false,
  //           }
  //         } else if (dateVal && dayjsDate) {
  //           mongoFilters[field] = {
  //             $gte: dayjsDate.startOf('day').toISOString(),
  //             $lte: dayjsDate.endOf('day').toISOString(),
  //           }
  //         } else {
  //           mongoFilters[field] = value
  //         }
  //         break
  //       case 'contain':
  //         mongoFilters[field] = { $regex: value, $options: 'i' }
  //         break
  //       case 'notContain':
  //         mongoFilters[field] = { $not: new RegExp(value, 'i') }
  //         break
  //       case 'startWith':
  //         mongoFilters[field] = { $regex: `^${value}`, $options: 'i' }
  //         break
  //       case 'endWith':
  //         mongoFilters[field] = { $regex: `${value}$`, $options: 'i' }
  //         break
  //       case 'empty':
  //         mongoFilters.$or = [{ [field]: { $in: [null, ''] } }, { [field]: { $exists: false } }]
  //         break
  //       case 'lessThan':
  //         mongoFilters[field] = {
  //           $lt: dateVal || value,
  //         }
  //         break
  //       case 'lessThanEqual':
  //         mongoFilters[field] = {
  //           $lte: dayjsDate
  //             ? dayjsDate.endOf('days').unix()
  //             : dateVal
  //               ? appDayJs(dateVal).endOf('days').toISOString()
  //               : value,
  //         }
  //         break
  //       case 'greaterThan':
  //         mongoFilters[field] = {
  //           $gt: dayjsDate
  //             ? dayjsDate.endOf('days').unix()
  //             : dateVal
  //               ? appDayJs(dateVal).endOf('days').toISOString()
  //               : value,
  //         }
  //         break
  //       case 'greaterThanEqual':
  //         mongoFilters[field] = {
  //           $gte: dayjsDate
  //             ? dayjsDate.startOf('days').unix()
  //             : dateVal
  //               ? appDayJs(dateVal).startOf('days').toISOString()
  //               : value,
  //         }
  //         break
  //       default:
  //         mongoFilters[field] = value
  //         break
  //     }
  //   }
  //   return mongoFilters
  // }
}
