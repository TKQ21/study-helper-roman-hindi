import React from "react";
import { cn } from "@/lib/utils";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  neonColor?: "cyan" | "green" | "pink" | "yellow" | "red";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const colorMap = {
  cyan: "neon-border-cyan neon-text-cyan hover:bg-neon-cyan/10",
  green: "neon-border-green neon-text-green hover:bg-neon-green/10",
  pink: "neon-border-pink neon-text-pink hover:bg-neon-pink/10",
  yellow: "neon-border-yellow neon-text-yellow hover:bg-neon-yellow/10",
  red: "neon-border-red text-neon-red hover:bg-neon-red/10",
};

const sizeMap = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const NeonButton: React.FC<NeonButtonProps> = ({
  neonColor = "cyan",
  size = "md",
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        "font-display font-semibold uppercase tracking-wider border-2 rounded-lg",
        "transition-all duration-300 ease-out",
        "active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed",
        colorMap[neonColor],
        sizeMap[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default NeonButton;
