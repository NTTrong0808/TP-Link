type MeInvoiceCommonResponse<T> = {
  success: boolean;
  errorCode: string | null;
  descriptionErrorCode: string | null;
  errors: any[];
  data: T;
  customData?: string;
}

export type MeInvoiceAuthResponse = MeInvoiceCommonResponse<string>

export type MeInvoiceAuthPayload = {
  username: string;
  password: string;
  appid: string;
  taxcode: string;
}

export interface PublishInvoiceResult {
  RefID: string;
  TransactionID: string;
  InvTemplateNo: string | null;
  InvSeries: string | null;
  InvNo: string;
  InvCode: string;
  InvDate: string;
  ErrorCode: string | null;
  CustomData: any | null;
}

export type MeInvoiceCreateInvoiceResponse = {
  success: boolean;
  errorCode: string | null;
  descriptionErrorCode: string | null;
  createInvoiceResult: any;
  publishInvoiceResult: string; // JSON string
}

export type MeInvoiceCancelInvoiceResponse = MeInvoiceCommonResponse<string>