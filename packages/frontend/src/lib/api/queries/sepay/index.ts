import { sepayFetcher } from './fetcher'
import { BankListResponse } from './schema'

class SEPayService {
  async getBankList() {
    return sepayFetcher.get<BankListResponse>(`/banks.json`)
  }
}

export const sepayService = new SEPayService()
