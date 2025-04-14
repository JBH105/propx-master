import type React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const loaderVariants = cva("relative", {
  variants: {
    variant: {
      default: "text-primary",
      secondary: "text-secondary",
      destructive: "text-destructive",
      muted: "text-muted-foreground",
    },
    size: {
      sm: "h-4 w-4",
      default: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
  label?: string;
}

export function Loader({
  className,
  variant,
  size,
  label,
  ...props
}: LoaderProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(loaderVariants({ variant, size, className }))}
        {...props}
      >
        <div className="absolute inset-0">
          <div className="h-full w-full rounded-full border-2 border-current opacity-20"></div>
          <div className="absolute inset-0 h-full w-full rounded-full border-t-2 border-[#812AD8] animate-spin"></div>
        </div>
      </div>
      {label && (
        <span className="text-sm animate-pulse text-[#812AD8]">
          {label}
        </span>
      )}
    </div>
  );
}
