export enum OrderChannel {
  SPE = 'SPE',
  LZD = 'LZD',
  TTS = 'TTS',
}
export enum OrderPaymentMethod {
  COD = 'COD',
  PLATFORM = 'PLATFORM',
}

export enum OrderPaymentStatus {
  'PAID' = 'PAID',
  'UNPAID' = 'UNPAID',
}

export enum OrderStatus {
  'PROCESSING' = 'PROCESSING',
  'CANCELLED' = 'CANCELLED',
  'COMPLETED' = 'COMPLETED',
  'RETURNED' = 'RETURNED',
}

export enum OrderFulfilmentStatus {
  WAITING_FOR_PICKUP = 'WAITING_FOR_PICKUP', // Chờ lấy hàng
  PICKING_UP = 'PICKING_UP', // Đang đi lấy
  DELIVERING = 'DELIVERING', // Đang giao hàng
  DELIVERED = 'DELIVERED', // Đã giao hàng
  DELIVERY_CANCELED = 'DELIVERY_CANCELED', // Hủy giao hàng
  RETURNED = 'RETURNED', // Chuyển hoàn
  NOT_DELIVERED_YET = 'NOT_DELIVERED_YET', // Chưa giao hàng
  CUSTOMER_NOT_FOUND = 'CUSTOMER_NOT_FOUND', // Không gặp khách
  WAITING_FOR_RETURN = 'WAITING_FOR_RETURN', // Chờ chuyển hoàn
  INCOMPLETE = 'INCOMPLETE', // Chưa hoàn thành
  DELIVERY_FAILED = 'DELIVERY_FAILED', // Lỗi giao hàng
  PICKUP_FAILED = 'PICKUP_FAILED', // Lấy hàng thất bại
}

export interface IOrder {
  _id: string
  createdAt: Date
  updatedAt: Date
  haravanData: IHaravanData
  channel: OrderChannel
  orderNumber: string
  status?: OrderStatus
  deliveringAt?: string
  cancelAt?: Date
  deliveredAt?: Date
  paymentMethod?: OrderPaymentMethod
  paymentStatus?: OrderPaymentStatus
  fulfilmentStatus?: OrderFulfilmentStatus
  totalAmountListPrice: number
  totalDiscount: number
  totalAmount: number
  discountCodes: DiscountCode[]
  lineItems: LineItem2[]
  invoiceIssuedData?: {
    invCode: string
    invNo: string
    transId: string
    invSymbol?: string
  }
  invoiceCreatedAt?: Date
  invoiceRefId?: string
  invoiceData?: Record<string, any>
  vatData?: {
    address?: string
    legalName?: string
    receiverEmail?: string
    taxCode?: string
    note?: string
  }
  note?: string
}
export interface IHaravanData {
  billing_address: BillingAddress
  browser_ip: any
  buyer_accepts_marketing: boolean
  cancel_reason: any
  cancelled_at: Date
  cart_token: string
  checkout_token: string
  client_details: ClientDetails
  closed_at: Date
  created_at: Date
  currency: string
  customer: Customer
  discount_codes: DiscountCode[]
  email: string
  financial_status: string
  fulfillments: Fulfillment[]
  fulfillment_status: string
  tags: string
  gateway: string
  gateway_code: any
  id: number
  landing_site: any
  landing_site_ref: any
  source: string
  line_items: LineItem2[]
  name: string
  note: string
  number: number
  order_number: string
  processing_method: any
  referring_site: any
  refunds: any[]
  shipping_address: ShippingAddress
  shipping_lines: ShippingLine[]
  source_name: string
  subtotal_price: number
  tax_lines: any
  taxes_included: boolean
  token: string
  total_discounts: number
  total_line_items_price: number
  total_price: number
  total_tax: number
  total_weight: number
  updated_at: Date
  transactions: Transaction[]
  note_attributes: NoteAttribute[]
  confirmed_at: Date
  closed_status: string
  cancelled_status: string
  confirmed_status: string
  assigned_location_id: number
  assigned_location_name: string
  assigned_location_at: string
  exported_confirm_at: any
  user_id: number
  device_id: any
  location_id: number
  location_name: string
  ref_order_id: number
  ref_order_date: any
  ref_order_number: any
  utm_source: any
  utm_medium: any
  utm_campaign: any
  utm_term: any
  utm_content: any
  payment_url: any
  contact_email: string
  order_processing_status: string
  prev_order_id: any
  prev_order_number: any
  prev_order_date: any
  redeem_model: any
  confirm_user: any
  risk_level: any
  discount_applications: any
}

interface BillingAddress {
  address1: string
  address2: any
  city: any
  company: any
  country: string
  first_name: string
  id: number
  last_name: any
  phone: any
  province: string
  zip: any
  name: string
  province_code: string
  country_code: string
  default: boolean
  district: string
  district_code: string
  ward: string
  ward_code: string
}

interface ClientDetails {
  accept_language: any
  browser_ip: any
  session_hash: any
  user_agent: any
  browser_height: any
  browser_width: any
}

interface Customer {
  accepts_marketing: boolean
  addresses: any[]
  created_at: Date
  default_address: any
  email: string
  phone: any
  first_name: any
  id: number
  last_name: any
  last_order_id: any
  last_order_name: any
  note: any
  orders_count: number
  state: string
  tags: any
  total_spent: number
  updated_at: Date
  verified_email: boolean
  birthday: any
  gender: any
  last_order_date: any
  multipass_identifier: any
}

interface DiscountCode {
  amount: number
  code: string
  type: any
  is_coupon_code: boolean
}

interface Fulfillment {
  created_at: Date
  id: number
  order_id: number
  receipt: any
  status: string
  tracking_company: string
  tracking_company_code: any
  tracking_numbers: string[]
  tracking_number: string
  tracking_url: any
  tracking_urls: any[]
  updated_at: Date
  line_items: LineItem[]
  province: any
  province_code: any
  district: any
  district_code: any
  ward: any
  ward_code: any
  cod_amount: number
  carrier_status_name: string
  carrier_cod_status_name: string
  carrier_status_code: string
  carrier_cod_status_code: string
  location_id: number
  location_name: string
  note: any
  carrier_service_package_name: any
  coupon_code: any
  ready_to_pick_date: any
  picking_date: any
  delivering_date: string
  delivered_date: string
  return_date: any
  not_meet_customer_date: any
  waiting_for_return_date: any
  cod_paid_date: any
  cod_receipt_date: any
  cod_pending_date: any
  cod_not_receipt_date: any
  cancel_date: any
  is_view_before: any
  country: any
  country_code: any
  zip_code: any
  city: any
  real_shipping_fee: number
  shipping_notes: string
  total_weight: number
  package_length: number
  package_width: number
  package_height: number
  boxme_servicecode: any
  transport_type: number
  address: any
  sender_phone: any
  sender_name: any
  carrier_service_code: any
  from_longtitude: number
  from_latitude: number
  to_longtitude: number
  to_latitude: number
  sort_code: string
  is_drop_off: boolean
  is_insurance: boolean
  insurance_price: number
  is_open_box: boolean
  request_id: any
  carrier_options: any
  note_attributes: any
  first_name: string
  last_name: any
  shipping_address: string
  shipping_phone: any
  carrier_id: any
}

interface LineItem {
  fulfillable_quantity: number
  fulfillment_service: string
  fulfillment_status: string
  grams: number
  id: number
  price: number
  product_id: number
  quantity: number
  requires_shipping: boolean
  sku: string
  title: string
  variant_id: number
  variant_title: string
  vendor: string
  name: string
  variant_inventory_management: string
  properties: any
  product_exists: boolean
}

interface LineItem2 {
  fulfillable_quantity: number
  fulfillment_service: any
  fulfillment_status: string
  grams: number
  id: number
  price: number
  price_original: number
  price_promotion: number
  product_id: number
  quantity: number
  requires_shipping: boolean
  sku: string
  title: string
  variant_id: number
  variant_title: string
  vendor: string
  type: string
  name: string
  gift_card: boolean
  taxable: boolean
  tax_lines: any
  product_exists: boolean
  barcode: string
  properties: Property[]
  applied_discounts: any[]
  total_discount: number
  image: Image
  not_allow_promotion: boolean
  ma_cost_amount: number
  actual_price: number
  discount_allocations: any
  serviceCode: string
  dwPrice: number
  dwTitle: string
  unitName: string
  vatRate: number
}

interface Property {
  name: string
  value: string
}

interface Image {
  src: string
}

interface ShippingAddress {
  address1: string
  address2: any
  city: any
  company: any
  country: string
  first_name: string
  last_name: any
  latitude: any
  longitude: any
  phone: any
  province: string
  zip: any
  name: string
  province_code: string
  country_code: string
  district_code: string
  district: string
  ward_code: string
  ward: string
}

interface ShippingLine {
  code: string
  price: number
  source: any
  title: string
}

interface Transaction {
  amount: number
  authorization: any
  created_at: Date
  device_id: any
  gateway: string
  id: number
  kind: string
  order_id: number
  receipt: any
  status: any
  user_id: number
  location_id: number
  payment_details: any
  parent_id: any
  currency: string
  haravan_transaction_id: any
  external_transaction_id: any
}

interface NoteAttribute {
  name: string
  value: string
}
