export interface ICustomerHaravan {
  accepts_marketing: boolean
  addresses: IAddressHaravan[]
  created_at: string
  default_address: IDefaultAddressHaravan
  email: string
  phone: string
  first_name: string
  id: number
  last_name: string
  last_order_id: string
  last_order_name: string
  note: string
  orders_count: number
  state: string
  tags: string
  total_spent: number
  updated_at: string
  verified_email: boolean
  birthday: Date
  gender: string
  last_order_date: string
  multipass_identifier: string
}

export interface IAddressHaravan {
  address1: string
  address2: string
  city: string
  compstring: string
  country: string
  first_name: string
  id: number
  last_name: string
  phone: string
  province: string
  zip: string
  name: string
  province_code: string
  country_code: string
  default: boolean
  district: string
  district_code: string
  ward: string
  ward_code: string
}

export interface IDefaultAddressHaravan extends IAddressHaravan {
  default: boolean
}

export interface ITotalCustomerHaravan {
  count: number
}

export interface IResponseCustomersHaravan {
  customers: ICustomerHaravan[]
  errors?: string
}

export interface IResponseCustomerHaravan {
  customer: ICustomerHaravan
  errors?: string
}

export interface IResponseAddressHaravan {
  address: IAddressHaravan
  errors?: string
}

export interface IResponseInvoiceHaravan {
  order: IHaravanInvoices
  errors?: string
}

export interface IResponseInvoicesHaravan {
  orders: IHaravanInvoices[]
  errors?: string
}

export interface IHaravanInvoices {
  billing_address: IDefaultAddressHaravan
  browser_ip: any
  buyer_accepts_marketing: boolean
  cancel_reason: string
  cancelled_at: string
  cart_token: string
  checkout_token: string
  client_details: any
  created_at: string
  currency: string
  customer: ICustomerHaravan
  discount_codes: any[]
  email: string
  financial_status: string
  fulfillments: any[]
  fulfillment_status: string
  tags: string
  gateway: string
  gateway_code: string
  id: number
  landing_site: any
  landing_site_ref: any
  source: string
  line_items: LineItem[]
  name: string
  note: string
  number: number
  order_number: string
  processing_method: any
  referring_site: any
  refunds: Refund[]
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
  updated_at: string
  transactions: Transaction[]
  note_attributes: any[]
  confirmed_at: string
  closed_status: string
  cancelled_status: string
  confirmed_status: string
  assigned_location_id: any
  assigned_location_name: any
  assigned_location_at: any
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
  confirm_user: number
}

export interface LineItem {
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
  properties: any[]
  applied_discounts: any[]
  total_discount: number
  image: {
    src: string
  }
  not_allow_promotion: boolean
  ma_cost_amount: number
  actual_price: number
  serviceCode: string
  dwPrice: number
  dwTitle: string
  unitName: string
  vatRate: number
}

export interface Refund {
  created_at: string
  id: number
  note: string
  refund_line_items: any[]
  restock: boolean
  user_id: number
  order_id: number
  location_id: number
  transactions: Transaction[]
}

export interface ShippingAddress extends IAddressHaravan {
  latitude: any
  longitude: any
}

export interface ShippingLine {
  code: any
  price: number
  source: any
  title: any
}

export interface Transaction {
  amount: number
  authorization: any
  created_at: string
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
  currency: any
  haravan_transaction_id: any
  external_transaction_id: any
}
