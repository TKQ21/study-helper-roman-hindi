import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, BookOpen, History } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home, color: "cyan" as const },
  { to: "/study", label: "Study", icon: BookOpen, color: "green" as const },
  { to: "/history", label: "History", icon: History, color: "pink" as const },
];

const activeColorMap = {
  cyan: "neon-text-cyan",
  green: "neon-text-green",
  pink: "neon-text-pink",
};

const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex justify-around items-center py-2.5 sm:py-3 px-4 max-w-lg mx-auto">
        {navItems.map(({ to, label, icon: Icon, color }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? activeColorMap[color] : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={22} />
              <span className="text-xs font-display tracking-wider">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
