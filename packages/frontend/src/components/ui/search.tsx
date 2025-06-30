import { cn } from "@/lib/tw";
import { ComponentProps } from "react";
import { tv, VariantProps } from "tailwind-variants";
import SearchIcon from "../widgets/icons/search-icon";
import { inputVariants } from "./input";

export const searchVariants = tv({
  extend: inputVariants,
  base: ["pl-9"],
  variants: {
    size: {
      sm: "h-8",
      default: "h-9",
      lg: "h-10",
      xl: "h-12",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface SearchProps
  extends Omit<ComponentProps<"input">, "size">,
    VariantProps<typeof searchVariants> {
  containerClassName?: string;
}

const Search = ({
  className,
  containerClassName,
  type,
  ref,
  size,
  ...props
}: SearchProps) => {
  return (
    <div className={cn("relative", containerClassName)}>
      <SearchIcon className="size-6 absolute top-1/2 left-2 -translate-y-1/2 text-neutral-grey-300" />
      <input
        {...props}
        type={type}
        className={cn(searchVariants({ size, className }))}
        ref={ref}
      />
    </div>
  );
};
Search.displayName = "Input";

export { Search };
