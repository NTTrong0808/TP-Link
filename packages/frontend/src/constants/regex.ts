export const phoneRegex = /^\+?[0-9]{10,14}$/
export const passwordSecure1 = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,32}$/

export const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*(),.?":{}|<>_+-]).{8,}$/

export const icNumberRegex = /^\d{12}$/

export const taxCodeRegex = /^(0|\d{10}(-\d{3})?)$/
export const noVietnameseRegex = /^[a-zA-Z0-9\s]*$/
