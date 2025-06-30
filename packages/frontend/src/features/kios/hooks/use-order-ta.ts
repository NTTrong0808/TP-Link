import { useQueryState } from "nuqs";

export const useOrderTA = (defaultTa = "") => {
  const [ta, setTa] = useQueryState("ta", {
    defaultValue: defaultTa,
  });

  return [ta, setTa] as const;
};
