import { cn } from "@/lib/tw";
import { Ellipsis } from "lucide-react";
import { HTMLAttributes, ReactNode, useEffect, useRef } from "react";

export interface InfinityScrollProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onScrollEnd?: () => void;
  loading: boolean;
  hasMore: boolean;
}

const createInfiniteScroll = (props: {
  hasMore: boolean;
  onScrollEnd?: () => void;
  loading: boolean;
}) => {
  const io = new IntersectionObserver((entries) => {
    if (
      entries &&
      entries?.length > 0 &&
      entries?.[0]?.isIntersecting &&
      props?.hasMore &&
      !props?.loading &&
      props?.onScrollEnd
    ) {
      props?.onScrollEnd?.();
    }
  });

  return {
    observe: (el: Element) => io.observe(el),
    disconnect: () => io.disconnect(),
  };
};

const InfinityScroll = (props: InfinityScrollProps) => {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = createInfiniteScroll(props);
    observer.observe(target);

    return () => observer.disconnect();
  }, [props?.hasMore, props?.loading, props?.onScrollEnd]);

  return (
    <div className={cn(props?.className)}>
      {props?.children}

      {props?.hasMore && (
        <div
          className={cn("block", props?.loading ? "h-fit" : "h-[5px]")}
          ref={targetRef}
        >
          <div className="flex items-center justify-center py-3">
            <Ellipsis className="animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

export default InfinityScroll;
