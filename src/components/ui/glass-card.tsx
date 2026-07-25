
import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'light' | 'dark';
}

export function GlassCard({ children, className, variant = 'light', ...props }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "rounded-2xl p-6 transition-all duration-300 hover:shadow-xl",
        variant === 'light' ? "glass" : "glass-dark",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
