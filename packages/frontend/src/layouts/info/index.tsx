import { cn } from "@/lib/tw";
import { ComponentProps, PropsWithChildren } from "react";

const InfoContainer = ({
  children,
  title,
  className,
  ...props
}: PropsWithChildren<{ title?: string }> & ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 p-4 font-medium border border-low rounded-lg bg-neutral-white max-w-[500px] w-full flex-1",
        className
      )}
      {...props}
    >
      {title ? <h3 className="text-base font-medium">{title}</h3> : <></>}
      {children}
    </div>
  );
};

export default InfoContainer;
