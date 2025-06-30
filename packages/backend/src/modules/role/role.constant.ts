import { RoleCode, RolePermission } from "./role.enum";

export const RolePermissionsMap = {
  [RoleCode.Admin]: [
    RolePermission.All,
  ],
  [RoleCode.Manager]: [
    RolePermission.ManageStaff,
    RolePermission.ManageReports,
  ],
  [RoleCode.Accountant]: [
    RolePermission.ManageFinance,
    RolePermission.ReadFinance,
    RolePermission.WriteFinance,
  ],
  [RoleCode.Cashier]: [
    RolePermission.ManageTransactions,
    RolePermission.ReadTransactions,
    RolePermission.WriteTransactions,
  ],
  [RoleCode.Inspector]: [
    RolePermission.ReadInspection,
    RolePermission.WriteInspection,
  ],
}
