const castToString = (action: string, subject: string): string => {
  return `${action}:${subject}`
}

export enum CASL_ACTIONS_ENUM {
  PAGE_ACCESS = 'page_access',
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

export const CASL_ACCESS_KEY = {
  // Manage all access
  MANAGE_ALL_ACCESS: castToString(CASL_ACTIONS_ENUM.MANAGE, 'all'),

  // Page access
  MANAGE_SYSTEM: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'manage_system'),
  REPORT_TEMPLATE: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'report_template'),
  SETTINGS: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'settings'),
  BRANCHES: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'branches'),
  STORES: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'stores'),
  EMPLOYEES: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'employees'),
  CUSTOMERS: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'customers'),
  SUPPLIERS: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'suppliers'),
  PRODUCT_COLLECTIONS: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'product_collections'),
  PRODUCT_INVENTORY: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'product_inventory'),
  INVOICES: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'invoices'),
  ESHOP_RETURN_SLIPS: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'eshop_return_slips'),
  ESHOP_IMPORT_SLIPS: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'eshop_import_slips'),
  ESHOP_EXPORT_SLIPS: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'eshop_export_slips'),
  ORDERS_PLANNING: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'orders_planning'),
  SYNC_CUSTOMERS: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'sync_customers'),
  CREATED_REPORT_1: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'created_report_1'),
  CREATED_REPORT_2: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'created_report_2'),
  DAILY_SALE_REPORT: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'daily_sale_report'),
  ESHOP_REPORT: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'eshop_report'),
  LOTTE_REPORT: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'lotte_report'),
  PARC_MALL_REPORT: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'parc_mall_report'),
  ONLINE_WAREHOUSE: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'online_warehouse'),
  IMPORT_SLIPS: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'import_slips'),
  EZCLOUD_REPORT: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ezcloud_report'),
  ADJUST_SLIPS: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'adjust_slips'),
  EXPORT_SLIPS: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'export_slips'),
  RETURN_SLIPS: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'return_slips'),
  TICKET_OFFLINE_SELL: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_offline_sell'),
  TICKET_INSPECTATION: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_inspectation'),
  TICKET_USER: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_user'),
  TICKET_SERVICE_AND_SERVICE_PRICE_LIST: castToString(
    CASL_ACTIONS_ENUM.PAGE_ACCESS,
    'ticket_service_and_service_price_list',
  ),
  TICKET_CONFIG_SERVICE_PRICE: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_config_service_price'),
  TICKET_CUSTOMER: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_customer'),
  TICKET_SALE_CHANNEL: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_sale_channel'),
  TICKET_WAREHOUSE: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_warehouse'),
  TICKET_TERM: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_term'),
  TICKET_ORDER: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_order'),
  TICKET_ISSUED_TICKET: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_issued_ticket'),
  TICKET_DASHBOARD: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_dashboard'),
  TICKET_POS_TERMINAL: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_pos_terminal'),
  TICKET_SCANNER_TERMINAL: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_scanner_terminal'),
  TICKET_PAYMENT_METHOD: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_payment_method'),
  TICKET_REPORT: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_report'),
  TICKET_ISSUE_INVOICE: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'ticket_issue_invoice'),

  // LFC
  LFC_PARTNER: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'lfc_partner'),
  LFC_WH: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'lfc_wh'),
  LFC_BOOKING: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'lfc_booking'),

  // == [ROLES PERMISSION]
  ROLES_PERMISSION: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'roles_permission'),
  ROLES_PERMISSION_VIEW_GROUPS_ROLES: castToString(CASL_ACTIONS_ENUM.READ, 'roles_permission_view_groups_roles'),
  ROLES_PERMISSION_CREATE_GROUPS_ROLES: castToString(CASL_ACTIONS_ENUM.CREATE, 'roles_permission_create_groups_roles'),
  ROLES_PERMISSION_UPDATE_GROUPS_ROLES: castToString(CASL_ACTIONS_ENUM.UPDATE, 'roles_permission_update_groups_roles'),
  ROLES_PERMISSION_DELETE_GROUPS_ROLES: castToString(CASL_ACTIONS_ENUM.DELETE, 'roles_permission_delete_groups_roles'),
  ROLES_PERMISSION_ADD_REMOVE_EMPLOYEE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'roles_permission_add_remove_employee'),

  // Branches page functions
  BRANCHES_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'branches_view'),
  BRANCHES_CONFIG_ORDER_PLANNING: castToString(CASL_ACTIONS_ENUM.UPDATE, 'branches_config_order_planning'),
  BRANCHES_ADD_PRODUCTS: castToString(CASL_ACTIONS_ENUM.UPDATE, 'branches_update_products'),
  BRANCHES_REMOVE_PRODUCTS: castToString(CASL_ACTIONS_ENUM.UPDATE, 'branches_update_products'),
  BRANCHES_UPDATE_REPORT_TEMPLATE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'branches_update_report_template'),
  BRANCHES_CREATE_BRANCH: castToString(CASL_ACTIONS_ENUM.CREATE, 'branches_create_branch'),
  BRANCHES_UPDATE_BRANCH: castToString(CASL_ACTIONS_ENUM.UPDATE, 'branches_update_branch'),
  BRANCHES_DELETE_BRANCH: castToString(CASL_ACTIONS_ENUM.DELETE, 'branches_delete_branch'),
  BRANCHES_UPDATE_PASSWORD: castToString(CASL_ACTIONS_ENUM.UPDATE, 'branches_update_password'),
  BRANCHES_UPDATE_EMPLOYEES: castToString(CASL_ACTIONS_ENUM.UPDATE, 'branches_update_employees'),
  BRANCHES_SYNC: castToString(CASL_ACTIONS_ENUM.UPDATE, 'branches_sync'),

  // Stores page functions
  STORES_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'stores_view'),
  STORES_CREATE: castToString(CASL_ACTIONS_ENUM.CREATE, 'stores_create'),
  STORES_UPDATE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'stores_update'),

  // Employees page functions
  EMPLOYEES_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'employees_view'),
  EMPLOYEES_PROVIDE_NEW_PASSWORD: castToString(CASL_ACTIONS_ENUM.UPDATE, 'employees_provide_new_password'),
  EMPLOYEES_CREATE_EMPLOYEE: castToString(CASL_ACTIONS_ENUM.CREATE, 'employees_create_employee'),
  EMPLOYEES_DELETE_EMPLOYEE: castToString(CASL_ACTIONS_ENUM.DELETE, 'employees_delete_employee'),
  EMPLOYEES_UPDATE_EMPLOYEE: castToString(CASL_ACTIONS_ENUM.CREATE, 'employees_update_employee'),

  // Customers page functions
  CUSTOMERS_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'customers_view'),
  CUSTOMERS_EXPORT_EXCEL: castToString(CASL_ACTIONS_ENUM.READ, 'customers_export_excel'),
  CUSTOMERS_CONFIG: castToString(CASL_ACTIONS_ENUM.UPDATE, 'customers_config'),

  // Product collection page functions
  PRODUCT_COLLECTIONS_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'product_collections_view'),
  PRODUCT_COLLECTIONS_UPDATE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'product_collections_update'),
  PRODUCT_COLLECTIONS_DELETE: castToString(CASL_ACTIONS_ENUM.DELETE, 'product_collections_delete'),
  PRODUCT_COLLECTIONS_CREATE: castToString(CASL_ACTIONS_ENUM.CREATE, 'product_collections_create'),
  PRODUCT_CATEGORIES_CREATE: castToString(CASL_ACTIONS_ENUM.CREATE, 'product_categories_create'),
  PRODUCT_CATEGORIES_UPDATE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'product_categories_update'),
  PRODUCT_CATEGORIES_DELETE: castToString(CASL_ACTIONS_ENUM.DELETE, 'product_categories_delete'),
  PRODUCT_CATEGORIES_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'product_categories_view'),

  // Products page functions
  PRODUCTS: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'products'),
  PRODUCTS_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'products_view'),
  PRODUCTS_CREATE: castToString(CASL_ACTIONS_ENUM.CREATE, 'products_create'),
  PRODUCTS_UPDATE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'products_update'),
  PRODUCTS_DELETE: castToString(CASL_ACTIONS_ENUM.DELETE, 'products_delete'),
  PRODUCTS_DOWNLOAD_UPDATE_TEMPLATE: castToString(CASL_ACTIONS_ENUM.READ, 'products_download_update_template'),
  PRODUCTS_IMPORT_UPDATE_TEMPLATE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'products_import_update_template'),
  PRODUCTS_EXPORT: castToString(CASL_ACTIONS_ENUM.UPDATE, 'products_export'),
  PRODUCTS_SYNC_PLATFORMS: castToString(CASL_ACTIONS_ENUM.UPDATE, 'products_sync_platforms'),

  // Products inventory page functions
  PRODUCTS_INVENTORY_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'products_inventory_view'),
  PRODUCTS_INVENTORY_VIEW_ALL_BRANCHES: castToString(CASL_ACTIONS_ENUM.READ, 'products_inventory_view_all_branches'),
  PRODUCTS_INVENTORY_VIEW_WITH_ASSIGNED_BRANCHES: castToString(
    CASL_ACTIONS_ENUM.READ,
    'products_inventory_view_with_assigned_branches',
  ),

  // Invoices page functions
  INVOICES_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'invoices_view'),
  INVOICES_VIEW_WITH_ALL_BRANCH: castToString(CASL_ACTIONS_ENUM.READ, 'invoices_view_with_all_branch'),
  INVOICES_VIEW_WITH_ASSIGNED_BRANCHES: castToString(CASL_ACTIONS_ENUM.READ, 'invoices_view_with_assigned_branches'),
  INVOICES_VIEW_IN_DAY: castToString(CASL_ACTIONS_ENUM.READ, 'invoices_view_in_day'),
  INVOICES_VIEW_RANGE_TIME: castToString(CASL_ACTIONS_ENUM.READ, 'invoices_view_range_time'),

  // Eshop return slip page functions
  ESHOP_RETURN_SLIPS_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'eshop_return_slips_view'),
  ESHOP_RETURN_SLIPS_VIEW_WITH_ALL_BRANCH: castToString(
    CASL_ACTIONS_ENUM.READ,
    'eshop_return_slips_view_with_all_branch',
  ),
  ESHOP_RETURN_SLIPS_VIEW_WITH_ASSIGNED_BRANCH: castToString(
    CASL_ACTIONS_ENUM.READ,
    'eshop_return_slips_view_with_assigned_branch',
  ),
  ESHOP_RETURN_SLIPS_VIEW_IN_DAY: castToString(CASL_ACTIONS_ENUM.READ, 'eshop_return_slips_view_in_day'),
  ESHOP_RETURN_SLIPS_VIEW_RANGE_TIME: castToString(CASL_ACTIONS_ENUM.READ, 'eshop_return_slips_view_range_time'),
  ESHOP_RETURN_SLIPS_PRINT: castToString(CASL_ACTIONS_ENUM.READ, 'eshop_return_slips_print'),
  ESHOP_RETURN_SLIPS_MANUAL_SYNC: castToString(CASL_ACTIONS_ENUM.UPDATE, 'eshop_return_slips_manual_sync'),
  ESHOP_RETURN_SLIPS_print: castToString(CASL_ACTIONS_ENUM.UPDATE, 'eshop_return_slips_print'),

  // Orders planning page functions
  ORDERS_PLANNING_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'orders_planning_view'),
  ORDERS_PLANNING_VIEW_WITH_ASSIGNED_BRANCHES: castToString(
    CASL_ACTIONS_ENUM.READ,
    'orders_planning_view_with_assigned_branches',
  ),
  ORDERS_PLANNING_VIEW_WITH_ALL_BRANCHES: castToString(
    CASL_ACTIONS_ENUM.READ,
    'orders_planning_view_with_all_branches',
  ),
  ORDERS_PLANNING_CONFIRM_ORDER: castToString(CASL_ACTIONS_ENUM.UPDATE, 'orders_planning_confirm_order'),
  ORDERS_PLANNING_FINISH_ORDER: castToString(CASL_ACTIONS_ENUM.UPDATE, 'orders_planning_finish_order'),
  ORDERS_PLANNING_UPDATE_AND_IMPORT_TEMPLATE: castToString(
    CASL_ACTIONS_ENUM.UPDATE,
    'orders_planning_update_and_import_template',
  ),
  ORDERS_PLANNING_CREATE_WITH_ASSIGNED_BRANCHES: castToString(
    CASL_ACTIONS_ENUM.CREATE,
    'orders_planning_create_with_assigned_branches',
  ),
  ORDERS_PLANNING_CREATE_WITH_ALL_BRANCHES: castToString(
    CASL_ACTIONS_ENUM.CREATE,
    'orders_planning_create_with_all_branches',
  ),
  ORDERS_PLANNING_DELETE: castToString(CASL_ACTIONS_ENUM.DELETE, 'orders_planning_delete'),

  // Sync customers page functions
  SYNC_CUSTOMERS_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'sync_customers_view'),
  SYNC_CUSTOMERS_UPDATE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'sync_customers_update'),

  // Daily sales report page functions
  DAILY_SALES_REPORT_VIEW_IN_CURRENT_DAY: castToString(
    CASL_ACTIONS_ENUM.READ,
    'daily_sales_report_view_in_current_day',
  ),
  DAILY_SALES_REPORT_VIEW_IN_SPECIFIC_DAY: castToString(
    CASL_ACTIONS_ENUM.READ,
    'daily_sales_report_view_in_specific_day',
  ),
  DAILY_SALES_REPORT_VIEW_WITH_ALL_BRANCHES: castToString(
    CASL_ACTIONS_ENUM.READ,
    'daily_sales_report_view_with_all_branches',
  ),
  DAILY_SALES_REPORT_VIEW_WITH_ASSIGNED_BRANCHES: castToString(
    CASL_ACTIONS_ENUM.READ,
    'daily_sales_report_view_with_assigned_branches',
  ),
  DAILY_SALES_REPORT_PRINT_REPORT: castToString(CASL_ACTIONS_ENUM.READ, 'daily_sales_report_print_report'),

  // Lotte report page function
  LOTTE_REPORT_VIEW_IN_CURRENT_DAY: castToString(CASL_ACTIONS_ENUM.READ, 'lotte_report_view_in_current_day'),
  LOTTE_REPORT_VIEW_IN_SPECIFIC_DAY: castToString(CASL_ACTIONS_ENUM.READ, 'lotte_report_view_in_specific_day'),
  LOTTE_REPORT_VIEW_WITH_ALL_BRANCHES: castToString(CASL_ACTIONS_ENUM.READ, 'lotte_report_view_with_all_branches'),
  LOTTE_REPORT_VIEW_WITH_ASSIGNED_BRANCHES: castToString(
    CASL_ACTIONS_ENUM.READ,
    'lotte_report_view_with_assigned_branches',
  ),
  LOTTE_REPORT_PRINT_REPORT: castToString(CASL_ACTIONS_ENUM.READ, 'lotte_report_print_report'),

  PARC_MALL_REPORT_PRINT_REPORT: castToString(CASL_ACTIONS_ENUM.READ, 'parc_mall_report_print_report'),

  // Online warehouse
  ONLINE_WAREHOUSE_VIEW_LIST: castToString(CASL_ACTIONS_ENUM.READ, 'online_warehouse_view_list'),
  ONLINE_WAREHOUSE_EXPORT_DATA: castToString(CASL_ACTIONS_ENUM.READ, 'online_warehouse_export_data'),
  ONLINE_WAREHOUSE_IMPORT_DATA: castToString(CASL_ACTIONS_ENUM.READ, 'online_warehouse_import_data'),
  ONLINE_WAREHOUSE_ALERT: castToString(CASL_ACTIONS_ENUM.READ, 'online_warehouse_alert'),
  ONLINE_WAREHOUSE_CONFIG_DISTRIBUTION: castToString(CASL_ACTIONS_ENUM.READ, 'online_warehouse_config_distribution'),

  // Import slips
  IMPORT_SLIPS_VIEW_LIST: castToString(CASL_ACTIONS_ENUM.READ, 'import_slips_view_list'),
  IMPORT_SLIPS_VIEW_SLIP_DETAIL: castToString(CASL_ACTIONS_ENUM.READ, 'import_slips_view_slip_detail'),
  IMPORT_SLIPS_ADD_NOTE: castToString(CASL_ACTIONS_ENUM.READ, 'import_slips_add_note'),
  IMPORT_SLIPS_ADJUST_IMPORT_SLIP: castToString(CASL_ACTIONS_ENUM.READ, 'import_slips_adjust_import_slip'),
  IMPORT_SLIPS_CRUD_SLIP: castToString(CASL_ACTIONS_ENUM.READ, 'import_slips_crud_slip'),
  IMPORT_SLIPS_PERFORM_ACTION: castToString(CASL_ACTIONS_ENUM.READ, 'import_slips_perform_action'),

  // Adjust slips
  ADJUST_SLIPS_VIEW_LIST: castToString(CASL_ACTIONS_ENUM.READ, 'adjust_slips_view_list'),
  ADJUST_SLIPS_VIEW_SLIP_DETAIL: castToString(CASL_ACTIONS_ENUM.READ, 'adjust_slips_view_slip_detail'),
  ADJUST_SLIPS_ADD_NOTE: castToString(CASL_ACTIONS_ENUM.READ, 'adjust_slips_add_note'),
  ADJUST_SLIPS_CRUD_SLIP: castToString(CASL_ACTIONS_ENUM.READ, 'adjust_slips_crud_slip'),
  ADJUST_SLIPS_PERFORM_ACTION: castToString(CASL_ACTIONS_ENUM.READ, 'adjust_slips_perform_action'),

  // Export slips
  EXPORT_SLIPS_VIEW_LIST: castToString(CASL_ACTIONS_ENUM.READ, 'export_slips_view_list'),
  EXPORT_SLIPS_VIEW_SLIP_DETAIL: castToString(CASL_ACTIONS_ENUM.READ, 'export_slips_view_slip_detail'),
  EXPORT_SLIPS_ADD_NOTE: castToString(CASL_ACTIONS_ENUM.READ, 'export_slips_add_note'),
  EXPORT_SLIPS_CRUD_SLIP: castToString(CASL_ACTIONS_ENUM.READ, 'export_slips_crud_slip'),
  EXPORT_SLIPS_PERFORM_ACTION: castToString(CASL_ACTIONS_ENUM.READ, 'export_slips_perform_action'),

  // Return slips
  RETURN_SLIPS_VIEW_LIST: castToString(CASL_ACTIONS_ENUM.READ, 'return_slips_view_list'),
  RETURN_SLIPS_VIEW_SLIP_DETAIL: castToString(CASL_ACTIONS_ENUM.READ, 'return_slips_view_slip_list'),
  RETURN_SLIPS_ADD_NOTE: castToString(CASL_ACTIONS_ENUM.READ, 'return_slips_add_note'),
  RETURN_SLIPS_CRUD_SLIP: castToString(CASL_ACTIONS_ENUM.READ, 'return_slips_crud_note'),
  RETURN_SLIPS_PERFORM_ACTION: castToString(CASL_ACTIONS_ENUM.READ, 'return_slips_perform_action'),

  // Supplier
  SUPPLIERS_VIEW_LIST: castToString(CASL_ACTIONS_ENUM.READ, 'suppliers_view_list'),
  SUPPLIERS_CREATE: castToString(CASL_ACTIONS_ENUM.READ, 'suppliers_create'),
  SUPPLIERS_EDIT: castToString(CASL_ACTIONS_ENUM.READ, 'suppliers_edit'),

  // EzCloud
  EZCLOUD_GET_DATA: castToString(CASL_ACTIONS_ENUM.READ, 'ezcloud_get_data'),
  EZCLOUD_EXPORT_EXCEL: castToString(CASL_ACTIONS_ENUM.READ, 'ezcloud_export_excel'),

  // Ticket
  TICKET_ACCESS_AND_PERFORM_INSPECTATION: castToString(
    CASL_ACTIONS_ENUM.READ,
    'ticket_access_and_perform_inspectation',
  ),
  TICKET_LOOK_UP_TICKET: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_look_up_ticket'),
  TICKET_VIEW_HISTORY_SCAN: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_view_history_scan'),

  TICKET_VIEW_USERS: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_view_user'),
  TICKET_ADD_USER: castToString(CASL_ACTIONS_ENUM.CREATE, 'ticket_add_user'),
  TICKET_EDIT_USER: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_edit_user'),
  TICKET_DISABLE_ENABLE_USER: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_disable_enable_user'),
  TICKET_CHANGE_PASSWORD_USER: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_change_password_user'),
  TICKET_DELETE_USER: castToString(CASL_ACTIONS_ENUM.DELETE, 'ticket_delete_user'),

  // Ticket serivce and service price list
  TICKET_SERVICE_AND_SERVICE_PRICE_LIST_VIEW: castToString(
    CASL_ACTIONS_ENUM.READ,
    'ticket_service_and_service_price_list_view',
  ),
  TICKET_ADD_SERVICE: castToString(CASL_ACTIONS_ENUM.CREATE, 'ticket_add_service'),
  TICKET_DELETE_SERVICE: castToString(CASL_ACTIONS_ENUM.DELETE, 'ticket_delete_service'),
  TICKET_UPDATE_SERVICE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_update_service'),
  TICKET_DISABLE_AND_ENABLE_SERVICE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_disable_and_enable_service'),

  TICKET_ADD_SERVICE_PRICE_LIST: castToString(CASL_ACTIONS_ENUM.CREATE, 'ticket_price_list_create'),
  TICKET_DELETE_SERVICE_PRICE_LIST: castToString(CASL_ACTIONS_ENUM.DELETE, 'ticket_price_list_delete'),
  TICKET_UPDATE_SERVICE_PRICE_LIST: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_price_list_update'),

  TICKET_CONFIG_SERVICE_PRICE_VIEW: castToString(CASL_ACTIONS_ENUM.CREATE, 'ticket_config_service_price_view'),
  TICKET_CONFIG_SERVICE_PRICE_BY_DATE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_config_service_price_by_date'),

  // Customer Management
  TICKET_CUSTOMER_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_customer_view'),
  TICKET_CUSTOMER_VIEW_DETAIL: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_customer_view_detail'),
  TICKET_CUSTOMER_CREATE: castToString(CASL_ACTIONS_ENUM.CREATE, 'ticket_customer_create'),
  TICKET_CUSTOMER_UPDATE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_customer_update'),
  TICKET_CUSTOMER_TOGGLE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_customer_toggle'),
  TICKET_CUSTOMER_DELETE: castToString(CASL_ACTIONS_ENUM.DELETE, 'ticket_customer_delete'),
  TICKET_CUSTOMER_EXPORT: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_customer_export'),

  // Sale Channel Management
  TICKET_SALE_CHANNEL_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_sale_channel_view'),
  TICKET_SALE_CHANNEL_TOGGLE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_sale_channel_toggle'),

  // Ticket Warehouse Management
  TICKET_WAREHOUSE_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_warehouse_view'),
  TICKET_WAREHOUSE_UPDATE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_warehouse_update'),

  // Policy Management
  TICKET_TERM_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_term_view'),
  TICKET_TERM_UPDATE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_term_update'),

  // Issued Ticket
  TICKET_ISSUED_TICKET_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_issued_ticket_view'),
  TICKET_ISSUED_TICKET_VIEW_DETAIL: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_issued_ticket_view_detail'),
  TICKET_ISSUED_TICKET_HISTORY_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_issued_ticket_history_view'),
  TICKET_ISSUED_TICKET_PRINT: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_issued_ticket_print'),
  TICKET_ISSUED_TICKET_MARK_AS_USED: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_issued_ticket_mark_as_used'),
  TICKET_ISSUED_TICKET_DELETE: castToString(CASL_ACTIONS_ENUM.DELETE, 'ticket_issued_ticket_delete'),

  // Issue Invoice
  TICKET_ISSUE_INVOICE_CONFIG_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_issue_invoice_config_view'),
  TICKET_ISSUE_INVOICE_CONFIG_UPDATE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_issue_invoice_config_update'),

  // Order Management
  TICKET_ORDER_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_order_view'),
  TICKET_ORDER_BY_EMP_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_order_by_emp_view'),
  TICKET_ONLINE_ORDER_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_online_order_view'),
  TICKET_ORDER_VIEW_DETAIL: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_order_view_detail'),
  TICKET_ORDER_PRINT_TICKET: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_order_print_ticket'),
  TICKET_ORDER_RESEND_TICKET: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_order_resend_ticket'),
  TICKET_ORDER_EXPORT: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_order_export'),
  TICKET_ORDER_CANCEL_ORDER_NOT_ISSUE_INVOICE: castToString(
    CASL_ACTIONS_ENUM.READ,
    'ticket_order_cancel_order_not_issue_invoice',
  ),
  TICKET_ORDER_CANCEL_ORDER_ISSUED_INVOICE: castToString(
    CASL_ACTIONS_ENUM.READ,
    'ticket_order_cancel_order_issued_invoice',
  ),
  TICKET_ORDER_CANCEL_CASH_ORDER_PENDING_PAYMENT: castToString(
    CASL_ACTIONS_ENUM.READ,
    'ticket_order_cancel_cash_order_pending_payment',
  ),
  TICKET_ORDER_CANCEL_CASH_ORDER_COMPLETED_NO_VAT: castToString(
    CASL_ACTIONS_ENUM.READ,
    'ticket_order_cancel_cash_order_completed_no_vat',
  ),
  TICKET_ORDER_HISTORY_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_order_history_view'),

  // Dashboard
  TICKET_DASHBOARD_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_dashboard_view'),

  // Offline
  TICKET_OFFLINE_SALE_ACCESS: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_offline_sale_access'),
  TICKET_OFFLINE_SALE_ACCESS_DAY_ONLY: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_offline_sale_access_day_only'),
  TICKET_OFFLINE_CREATE_BOOKING_PAY_LATER: castToString(
    CASL_ACTIONS_ENUM.READ,
    'ticket_offline_create_booking_pay_later',
  ),

  // Pos terminal
  TICKET_POS_TERMINAL_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_pos_terminal_view'),
  TICKET_POS_TERMINAL_CREATE: castToString(CASL_ACTIONS_ENUM.CREATE, 'ticket_pos_terminal_create'),
  TICKET_POS_TERMINAL_UPDATE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_pos_terminal_update'),
  TICKET_POS_TERMINAL_DELETE: castToString(CASL_ACTIONS_ENUM.DELETE, 'ticket_pos_terminal_delete'),

  // Scanner terminal
  TICKET_SCANNER_TERMINAL_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_scanner_terminal_view'),
  TICKET_SCANNER_TERMINAL_CREATE: castToString(CASL_ACTIONS_ENUM.CREATE, 'ticket_scanner_terminal_create'),
  TICKET_SCANNER_TERMINAL_UPDATE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_scanner_terminal_update'),
  TICKET_SCANNER_TERMINAL_DELETE: castToString(CASL_ACTIONS_ENUM.DELETE, 'ticket_scanner_terminal_delete'),

  // Payment method
  TICKET_PAYMENT_METHOD_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_payment_method_view'),
  TICKET_PAYMENT_METHOD_TOGGLE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'ticket_payment_method_toggle'),
  TICKET_PAYMENT_METHOD_BANK_ACCOUNT_VIEW: castToString(
    CASL_ACTIONS_ENUM.READ,
    'ticket_payment_method_bank_account_view',
  ),
  TICKET_PAYMENT_METHOD_BANK_ACCOUNT_TOGGLE: castToString(
    CASL_ACTIONS_ENUM.UPDATE,
    'ticket_payment_method_bank_account_toggle',
  ),
  TICKET_PAYMENT_METHOD_BANK_ACCOUNT_CREATE: castToString(
    CASL_ACTIONS_ENUM.CREATE,
    'ticket_payment_method_bank_account_create',
  ),
  TICKET_PAYMENT_METHOD_BANK_ACCOUNT_UPDATE: castToString(
    CASL_ACTIONS_ENUM.UPDATE,
    'ticket_payment_method_bank_account_update',
  ),
  TICKET_PAYMENT_METHOD_BANK_ACCOUNT_DELETE: castToString(
    CASL_ACTIONS_ENUM.DELETE,
    'ticket_payment_method_bank_account_delete',
  ),

  // LFC partner
  LFC_PARTNER_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'lfc_partner_view'),
  LFC_PARTNER_VIEW_DETAIL: castToString(CASL_ACTIONS_ENUM.READ, 'lfc_partner_view_detail'),
  LFC_PARTNER_EXPORT_PARTNERS: castToString(CASL_ACTIONS_ENUM.CREATE, 'lfc_partner_export_partners'),
  LFC_PARTNER_EXPORT_PARTNER_DETAIL: castToString(CASL_ACTIONS_ENUM.READ, 'lfc_partner_export_partner_detail'),
  LFC_PARTNER_CREATE: castToString(CASL_ACTIONS_ENUM.CREATE, 'lfc_partner_create'),
  LFC_PARTNER_CHANGE_PASSWORD: castToString(CASL_ACTIONS_ENUM.UPDATE, 'lfc_partner_change_password'),
  LFC_PARTNER_ENABLE_DISABLE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'lfc_partner_enable_disable'),
  LFC_PARTNER_EDIT: castToString(CASL_ACTIONS_ENUM.UPDATE, 'lfc_partner_edit'),
  LFC_PARTNER_VIEW_HISTORY: castToString(CASL_ACTIONS_ENUM.READ, 'lfc_partner_view_history'),

  // LFC WH
  LFC_WH_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'lfc_wh_view'),
  LFC_WH_DISTRIBUTE: castToString(CASL_ACTIONS_ENUM.UPDATE, 'lfc_wh_distribute'),

  // LFC BOOKING
  LFC_BOOKING_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'lfc_booking_view'),
  LFC_BOOKING_EXPORT: castToString(CASL_ACTIONS_ENUM.READ, 'lfc_booking_export'),
  LFC_BOOKING_VIEW_DETAIL: castToString(CASL_ACTIONS_ENUM.READ, 'lfc_booking_view_detail'),
  LFC_BOOKING_IMPORT: castToString(CASL_ACTIONS_ENUM.READ, 'lfc_booking_import'),

  // Ticket Report Permissions
  TICKET_REPORT_REVENUE_BY_DATE_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_report_revenue_by_date'),
  TICKET_REPORT_REVENUE_BY_BOOKING_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_report_revenue_by_booking'),
  TICKET_REPORT_REVENUE_BY_SERVICE_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_report_revenue_by_service'),
  TICKET_REPORT_REVENUE_BY_BOOKING_AND_SERVICE_VIEW: castToString(
    CASL_ACTIONS_ENUM.READ,
    'ticket_report_revenue_by_booking_and_service',
  ),
  TICKET_REPORT_REVENUE_BY_CUSTOMER_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_report_revenue_by_customer'),
  TICKET_REPORT_REVENUE_BY_BOOKING_AND_CUSTOMER_VIEW: castToString(
    CASL_ACTIONS_ENUM.READ,
    'ticket_report_revenue_by_booking_and_customer',
  ),
  TICKET_REPORT_REVENUE_BY_USER_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_report_revenue_by_user'),
  TICKET_REPORT_REVENUE_BY_CHANNEL_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_report_revenue_by_channel'),
  TICKET_REPORT_DAILY_REPORT_POS_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_report_daily_report_pos'),
  TICKET_REPORT_DAILY_REPORT_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'ticket_report_daily_report'),

  ORDERS: castToString(CASL_ACTIONS_ENUM.PAGE_ACCESS, 'orders'),
  ORDERS_VIEW: castToString(CASL_ACTIONS_ENUM.READ, 'orders_view'),
}
