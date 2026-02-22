import React from "react";
import { cn } from "@/lib/utils";

interface NeonCardProps {
  neonColor?: "cyan" | "green" | "pink" | "yellow";
  children: React.ReactNode;
  className?: string;
}

const borderMap = {
  cyan: "neon-border-cyan",
  green: "neon-border-green",
  pink: "neon-border-pink",
  yellow: "neon-border-yellow",
};

const NeonCard: React.FC<NeonCardProps> = ({
  neonColor = "cyan",
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "border-2 rounded-xl bg-card/80 backdrop-blur-sm p-6",
        "transition-all duration-300",
        borderMap[neonColor],
        className
      )}
    >
      {children}
    </div>
  );
};

export default NeonCard;
