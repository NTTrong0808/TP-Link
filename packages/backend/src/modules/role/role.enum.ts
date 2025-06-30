export enum RoleProvider {
  Ticket = 'ticket',
  Center = 'center',
  Ecom = 'ecom',
}

export enum RoleCode {
  Inspector = 'inspector',
  Admin = 'admin',
  Manager = 'manager',
  Accountant = 'accountant',
  Cashier = 'cashier',
}

export enum RoleName {
  inspector = 'Người kiểm duyệt',
  admin = 'Quản trị viên',
  manager = 'Quản lý',
  accountant = 'Nhân viên kế toán',
  cashier = 'Nhân viên đứng quầy',
}

export enum RolePermission {
  // General permissions
  All = 'manage:all',
  ReadAll = 'read:all',
  WriteAll = 'write:all',

  // Inspector permissions
  ReadInspection = 'read:inspection',
  WriteInspection = 'write:inspection',

  // Admin permissions
  ManageUsers = 'manage:users',
  ManageRoles = 'manage:roles',
  ManageSettings = 'manage:settings',

  // Manager permissions
  ManageStaff = 'manage:staff',
  ManageReports = 'manage:reports',

  // Accountant permissions
  ManageFinance = 'manage:finance',
  ReadFinance = 'read:finance',
  WriteFinance = 'write:finance',

  // Cashier permissions
  ManageTransactions = 'manage:transactions',
  ReadTransactions = 'read:transactions',
  WriteTransactions = 'write:transactions',

  // Ticket sales page permissions
  ManageTicketSales = 'manage:ticket-sales',
  ReadTicketSales = 'read:ticket-sales',
  WriteTicketSales = 'write:ticket-sales',

  // Ticket inspection page permissions
  ManageTicketInspection = 'manage:ticket-inspection',
  ReadTicketInspection = 'read:ticket-inspection',
  ScanTicket = 'scan:ticket',
  ViewScanHistory = 'read:scan-history',

  // Staff management permissions
  ReadStaff = 'read:staff',
  WriteStaff = 'write:staff',
  DeleteStaff = 'delete:staff',
  ResetStaffPassword = 'reset:staff-password',
  ToggleStaffStatus = 'toggle:staff-status',

  // Service and pricing management permissions
  ManageServices = 'manage:services',
  ReadServices = 'read:services',
  WriteServices = 'write:services',
  DeleteServices = 'delete:services',
  ToggleServiceStatus = 'toggle:service-status',
  ManagePricing = 'manage:pricing',
  ReadPricing = 'read:pricing',
  WritePricing = 'write:pricing',
  DeletePricing = 'delete:pricing',

  // Daily pricing management permissions
  ManageDailyPricing = 'manage:daily-pricing',
  ReadDailyPricing = 'read:daily-pricing',
  WriteDailyPricing = 'write:daily-pricing',

  // Customer management permissions
  ManageCustomers = 'manage:customers',
  ReadCustomers = 'read:customers',
  WriteCustomers = 'write:customers',
  DeleteCustomers = 'delete:customers',
  ToggleCustomerStatus = 'toggle:customer-status',
  ExportCustomers = 'export:customers',

  // Sales channel management permissions
  ManageChannels = 'manage:channels',
  ReadChannels = 'read:channels',
  ToggleChannelStatus = 'toggle:channel-status',

  // Ticket inventory management permissions
  ManageInventory = 'manage:inventory',
  ReadInventory = 'read:inventory',
  WriteInventory = 'write:inventory',

  // Policy management permissions
  ManagePolicy = 'manage:policy',
  ReadPolicy = 'read:policy',
  WritePolicy = 'write:policy',

  // Order management permissions
  ManageOrders = 'manage:orders',
  ReadOrders = 'read:orders',
  ReprintTicket = 'reprint:ticket',
  ResendTicket = 'resend:ticket',
  ExportOrders = 'export:orders',

  // Dashboard viewing permissions
  ReadDashboard = 'read:dashboard',
}
