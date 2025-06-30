import { CustomerType } from '../schemas/customer.schema'

export interface CustomerFilter {
  search?: string
  type?: CustomerType[]
  isActive?: boolean[]
}

export interface IEzCloudTA {
  ID: string
  ProfileCode: string
  Name: string
  IdentityCard: string
  ProfileTypeID: string
  Email: string
  Image: any
  AlternativeEmail: any
  CellPhone?: string
  PhoneNumber?: string
  RegionID: any
  WardID: any
  Address: string
  ProfileLevelID: string
  SaleInChargeID: string
  PostalCode: any
  RepresentName?: string
  RepresentEmail: any
  RepresentGender: any
  RepresentBirthDate: any
  RepresentPhone: any
  Inactive: string
  IsDelete: string
  CreatedBy: string
  CreatedDate: string
  UpdatedBy?: string
  UpdatedDate?: string
  FlexCol1: any
  FlexCol2: any
  FlexCol3: any
  FlexCol4: any
  FlexCol5: any
  CityID: any
  DistrictID: any
  ProfileLevelName: string
  SaleInChargeName: string
  ProfileTypeName: string
}

export interface IEzCloudTaSales {
  'Mã đại lý': string
  'Mã tham chiếu': string
  'Tên đại lý': string
  'Địa chỉ': string
  'Loại khách hàng': string
  'Tổng tiền (VND)': string
}
