import type { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
  arrow?: boolean;
}

export function Button({
  variant = "primary",
  children,
  arrow,
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gold text-white hover:bg-gold-dark shadow-sm",
    secondary:
      "border-2 border-gold text-gold bg-transparent hover:bg-gold/5",
    ghost: "text-navy hover:text-gold bg-transparent",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
      {arrow && <span aria-hidden="true">→</span>}
    </button>
  );
}
