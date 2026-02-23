import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, History } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/study", label: "Study", icon: BookOpen },
  { to: "/history", label: "History", icon: History },
];

const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/10 safe-area-bottom">
      <div className="flex justify-around items-center py-2.5 px-4 max-w-lg mx-auto">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive ? "gradient-text" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={22} className={isActive ? "text-[#ff00cc]" : ""} />
              <span className="text-xs font-medium tracking-wider">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
