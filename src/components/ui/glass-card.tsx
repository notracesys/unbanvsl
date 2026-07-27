
import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl glass",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
