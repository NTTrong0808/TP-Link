"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/tw";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-13 [&>*]:h-13 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground gap-2",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  onClose?: () => void;
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "bg-neutral-white/80 border border-low",
      "inline-flex items-center justify-center whitespace-nowrap rounded-md",
      "px-4 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
      "disabled:opacity-50 data-[state=active]:bg-neutral-white data-[state=active]:text-foreground data-[state=active]:shadow",
      "shadow-[0px_1px_2px_0px_#09090B0D]",
      "[&>[data-close]]:hidden",
      "[&[data-state=active]>[data-close]]:block",
      "[&[data-state=active]>[data-close]]:text-neutral-grey-300 [&[data-state=active]>[data-close]]:ml-6",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "data-[state=inactive]:hidden data-[state=active]:block",
      "mt-2 ring-offset-background focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "rounded-lg bg-neutral-white border border-low shadow-[0px_1px_2px_0px_#09090B0D] p-4",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
