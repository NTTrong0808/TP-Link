export const VietQRResponseCode = {
  SUCCESS: "00",
  COMPANY_INFO_NOT_EXISTED: "52",
};

export interface VietQRBaseResult<TData = any> {
  code: string;
  desc: string;
  data: TData;
}

export interface GetCompanyInfoData {
  id: string;
  name: string;
  internationalName: string;
  shortName: string;
  address: string;
}
