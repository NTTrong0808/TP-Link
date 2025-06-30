export const AUTH_COOKIE = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

export const AUTH_ERROR = {
  "User is disabled.": "userDisabled",
  "User does not exist.": "userNotFound",
  "Incorrect username or password.": "incorrectUsernameOrPassword",
} as const;

export const getAuthError = (error: string) => {
  return AUTH_ERROR?.[error as keyof typeof AUTH_ERROR] || "userInvalid";
};
