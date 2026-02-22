import React from "react";
import { Link } from "react-router-dom";
import NeonButton from "@/components/NeonButton";
import NeonCard from "@/components/NeonCard";
import { BookOpen, Sparkles, Zap } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-[100dvh] neon-bg-grid flex flex-col items-center justify-center px-3 sm:px-4 pb-20 pt-6">
      {/* Floating orbs background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-5 w-24 sm:w-32 h-24 sm:h-32 bg-neon-cyan/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-5 w-28 sm:w-40 h-28 sm:h-40 bg-neon-pink/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/4 w-24 sm:w-36 h-24 sm:h-36 bg-neon-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 right-1/4 w-20 sm:w-28 h-20 sm:h-28 bg-neon-yellow/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Title */}
      <div className="text-center mb-6 sm:mb-10">
        <h1 className="font-display text-2xl sm:text-5xl font-bold neon-text-cyan animate-neon-pulse mb-2">
          Roman Hindi
        </h1>
        <h2 className="font-display text-lg sm:text-3xl font-semibold neon-text-pink mb-3">
          Study Helper
        </h2>
        <p className="text-muted-foreground max-w-xs sm:max-w-md mx-auto text-sm sm:text-lg leading-relaxed">
          Apne sawaal likho Hindi ya Urdu mein — jawab milega Roman Hindi mein, exam ke liye ready!
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid gap-3 w-full max-w-md mb-6 sm:mb-8">
        <NeonCard neonColor="cyan" className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="text-neon-cyan shrink-0" size={24} />
            <div>
              <h3 className="font-display text-base sm:text-lg font-semibold text-foreground">AI-Powered Answers</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Smart jawab jo exam mein kaam aayein</p>
            </div>
          </div>
        </NeonCard>

        <NeonCard neonColor="green" className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <BookOpen className="text-neon-green shrink-0" size={24} />
            <div>
              <h3 className="font-display text-base sm:text-lg font-semibold text-foreground">Roman Hindi Output</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">English alphabets mein Hindi jawab</p>
            </div>
          </div>
        </NeonCard>

        <NeonCard neonColor="pink" className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <Zap className="text-neon-pink shrink-0" size={24} />
            <div>
              <h3 className="font-display text-base sm:text-lg font-semibold text-foreground">Class 8, 10, 12</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Har class ke hisaab se answer level</p>
            </div>
          </div>
        </NeonCard>
      </div>

      {/* CTA */}
      <Link to="/study" className="w-full max-w-md px-2">
        <NeonButton neonColor="cyan" size="lg" className="w-full">
          Start Studying →
        </NeonButton>
      </Link>
    </div>
  );
};

export default HomePage;
