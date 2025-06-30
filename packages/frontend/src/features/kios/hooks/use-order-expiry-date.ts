import { useQueryState } from "nuqs";

export const useOrderExpiryDate = (defaultExpiryDate = "") => {
  const [expiryDate, setExpiryDate] = useQueryState("expiryDate", {
    defaultValue: defaultExpiryDate,
  });

  return [expiryDate, setExpiryDate] as const;
};
