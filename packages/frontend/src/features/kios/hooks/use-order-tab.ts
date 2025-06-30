import { useQueryState } from "nuqs";

export const useOrderActivation = (defaultTab = "") => {
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: defaultTab,
  });

  return [activeTab, setActiveTab] as const;
};
