import { Skeleton } from "@/components/ui/skeleton";

const ServiceLoading = () => {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="w-full h-[64px]" />
      <Skeleton className="w-full h-[64px]" />
      <Skeleton className="w-full h-[64px]" />
      <Skeleton className="w-full h-[64px]" />
    </div>
  );
};

export default ServiceLoading;
