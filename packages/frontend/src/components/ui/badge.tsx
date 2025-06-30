import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/tw";

const badgeVariants = tv({
  base: [
    "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold",
    "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ],
  variants: {
    variant: {
      default:
        "border-transparent bg-semantic-success-100 text-semantic-success-400 hover:bg-semantic-success-100/80",
      secondary:
        "border-transparent bg-neutral-grey-100 text-neutral-grey-600 hover:bg-neutral-grey-100/80",
      destructive:
        "border-transparent bg-rose-100 text-secondary-strawberry-300 hover:bg-rose-100/80",
      warning:
        "border-transparent bg-secondary-banana-100 text-primary-orange-300 hover:bg-secondary-banana-100/80",
      info: "border-transparent bg-blue-100 text-blue-400 hover:bg-blue-100/80",
    },
    corner: {
      default: "rounded-md",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    variant: "default",
    corner: "default",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, corner, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, corner }), className, "")}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
