export const REGEX = {
  PHONE_NUMBER_VN: /((84|\+84|0)[3|5|7|8|9])+([0-9]{8})\b/g,
  LANDLINE_PHONE_NUMBER_VN: /((84|\+84|0)[2])+([0-9]{9})\b/g,
  ONLY_DIGITS: /^[0-9]+$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD_LEVEL_4: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
};
