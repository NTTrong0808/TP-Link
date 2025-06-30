import { Skeleton } from "@/components/ui/skeleton";

const ServicePriceListLoading = () => {
  return (
    <div className="flex flex-col gap-4 w-full overflow-auto p-6">
      <Skeleton className="w-full h-[160px]" />
      <Skeleton className="w-full h-[160px]" />
      <Skeleton className="w-full h-[160px]" />
      <Skeleton className="w-full h-[160px]" />
    </div>
  );
};

export default ServicePriceListLoading;
