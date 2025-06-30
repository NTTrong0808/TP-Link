"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/tw";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  classNames?: {
    [K in keyof React.ComponentProps<
      typeof DayPicker
    >["classNames"]]?: React.HTMLAttributes<"div">["className"];
  } & {
    nav_button_variant?: ButtonProps["variant"];
  };
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        ...classNames,

        months: cn(
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          classNames?.months
        ),
        month: cn("space-y-4", classNames?.month),
        caption: cn(
          "flex justify-center pt-1 relative items-center",
          classNames?.caption
        ),
        caption_label: cn(
          "text-sm font-medium text-center",
          classNames?.caption_label
        ),
        nav: cn("space-x-1 flex items-center", classNames?.nav),
        nav_button: cn(
          buttonVariants({
            variant: classNames?.nav_button_variant ?? "outline",
          }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          classNames?.nav_button
        ),
        nav_button_previous: cn(
          "absolute left-1",
          classNames?.nav_button_previous
        ),
        nav_button_next: cn("absolute right-1", classNames?.nav_button_next),
        table: cn("w-full border-collapse space-y-1", classNames?.table),
        head_row: cn("flex", classNames?.head_row),
        head_cell: cn(
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          classNames?.head_cell
        ),
        row: cn("flex w-full mt-2", classNames?.row),
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-start)]:rounded-r-2xl [&:has([aria-selected].day-range-end)]:rounded-r-2xl",
          props.mode === "range"
            ? cn(
                "[&:has(>.day-range-end)]:rounded-r-2xl",
                "[&:has(>.day-range-start)]:rounded-l-2xl",
                "first:[&:has([aria-selected])]:rounded-l-2xl",
                "last:[&:has([aria-selected])]:rounded-r-2xl"
              )
            : "[&:has([aria-selected])]:rounded-2xl",
          classNames?.cell
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
          classNames?.day
        ),
        day_range_start: cn(
          "day-range-start",
          props.mode === "range" ? "rounded-none rounded-l-2xl" : null,
          classNames?.day_range_start
        ),
        day_range_end: cn(
          "day-range-end",
          props.mode === "range" ? "rounded-none rounded-r-2xl" : null,
          classNames?.day_range_end
        ),
        day_selected: cn(
          "bg-primary text-neutral-white hover:bg-primary hover:text-neutral-white focus:bg-primary focus:text-neutral-white",
          classNames?.day_selected
        ),
        day_today: cn("border-[1px] border-green-200", classNames?.day_today),
        day_outside: cn(
          "day-outside text-neutral-grey-300 aria-selected:bg-green-500 aria-selected:text-neutral-grey-100",
          classNames?.day_outside
        ),
        day_disabled: cn(
          "text-muted-foreground opacity-50",
          classNames?.day_disabled
        ),
        day_range_middle: cn(
          "aria-selected:bg-green-50 aria-selected:text-green-500 aria-selected:rounded-none",
          classNames?.day_range_middle
        ),
        day_hidden: cn("invisible", classNames?.day_hidden),
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ArrowLeftIcon className={cn("h-6 w-6", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ArrowRightIcon className={cn("h-6 w-6", className)} {...props} />
        ),
      }}
      weekStartsOn={props.weekStartsOn ?? 1}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
