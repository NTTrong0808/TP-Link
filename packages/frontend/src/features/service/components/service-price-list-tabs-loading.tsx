import { Skeleton } from "@/components/ui/skeleton";

const ServicePriceListTabsLoading = () => {
  return (
    <>
      <Skeleton className="min-w-[120px] h-full rounded-sm" />
      <Skeleton className="min-w-[120px] h-full rounded-sm" />
      <Skeleton className="min-w-[120px] h-full rounded-sm" />
      <Skeleton className="min-w-[120px] h-full rounded-sm" />
    </>
  );
};

export default ServicePriceListTabsLoading;
