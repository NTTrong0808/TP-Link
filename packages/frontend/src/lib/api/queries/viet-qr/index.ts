import { vietqrFetcher } from './fetcher'
import { GetCompanyInfoData, VietQRBaseResult } from './schema'

export type VietQRGetCompanyInfoVariables = { taxCode: string }
export type VietQRGetCompanyInfoResult = VietQRBaseResult<GetCompanyInfoData>

class VietQRService {
  getCompanyInfo(variables: VietQRGetCompanyInfoVariables) {
    const { taxCode } = variables
    return vietqrFetcher.get<VietQRGetCompanyInfoResult>(`/business/${taxCode}`)
  }
}

export const vietQRService = new VietQRService()
