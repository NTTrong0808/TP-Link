export const formatPhoneToE164 = (phone: string) => {
  return phone.replace(/^0/, "+84");
};

export const phoneFromE164ToLocal = (phone: string) => {
  return phone.replace(/^\+84/, "0");
};
