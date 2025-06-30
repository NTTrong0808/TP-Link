export const USER_STATUS = {
  noAccount: "NO_ACCOUNT",
  activated: "ACTIVATED",
  deactivated: "DEACTIVATED",
  unActivated: "UN_ACTIVATED",
};

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
