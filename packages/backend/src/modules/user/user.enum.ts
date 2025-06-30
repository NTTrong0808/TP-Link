export enum UserProvider {
  Ticket = 'ticket',
  Center = 'center',
  Ecom = 'ecom',
}

export enum UserStatus {
  NoAccount = 'NO_ACCOUNT',
  Activated = 'ACTIVATED',
  Deactivated = 'DEACTIVATED',
  UnActivated = 'UN_ACTIVATED',
}

export enum UserCognitoStatus {
  ForceChangePassword = 'FORCE_CHANGE_PASSWORD',
  Confirmed = 'CONFIRMED',
  Unconfirmed = 'UNCONFIRMED',
  NewPasswordRequired = 'NEW_PASSWORD_REQUIRED',
}
