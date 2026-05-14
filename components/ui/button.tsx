import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg" | "icon";
  variant?: "primary" | "outline" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = "md", variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          size === "sm" && "px-3 py-1.5 text-xs",
          size === "md" && "px-4 py-2 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          size === "icon" && "p-2 text-sm",
          variant === "primary" && "bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700",
          variant === "outline" && "border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
          variant === "ghost" && "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
