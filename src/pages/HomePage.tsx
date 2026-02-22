import React from "react";
import { Link } from "react-router-dom";
import NeonButton from "@/components/NeonButton";
import NeonCard from "@/components/NeonCard";
import { BookOpen, Sparkles, Zap } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen neon-bg-grid flex flex-col items-center justify-center px-4 pb-24 pt-8">
      {/* Floating orbs background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-neon-cyan/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-10 w-40 h-40 bg-neon-pink/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/4 w-36 h-36 bg-neon-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 right-1/4 w-28 h-28 bg-neon-yellow/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl sm:text-5xl font-bold neon-text-cyan animate-neon-pulse mb-3">
          Roman Hindi
        </h1>
        <h2 className="font-display text-xl sm:text-3xl font-semibold neon-text-pink mb-4">
          Study Helper
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-lg">
          Apne sawaal likho Hindi ya Urdu mein — jawab milega Roman Hindi mein, exam ke liye ready!
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid gap-4 w-full max-w-md mb-8">
        <NeonCard neonColor="cyan">
          <div className="flex items-center gap-4">
            <Sparkles className="text-neon-cyan shrink-0" size={28} />
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">AI-Powered Answers</h3>
              <p className="text-muted-foreground text-sm">Smart jawab jo exam mein kaam aayein</p>
            </div>
          </div>
        </NeonCard>

        <NeonCard neonColor="green">
          <div className="flex items-center gap-4">
            <BookOpen className="text-neon-green shrink-0" size={28} />
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">Roman Hindi Output</h3>
              <p className="text-muted-foreground text-sm">English alphabets mein Hindi jawab</p>
            </div>
          </div>
        </NeonCard>

        <NeonCard neonColor="pink">
          <div className="flex items-center gap-4">
            <Zap className="text-neon-pink shrink-0" size={28} />
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">Class 8, 10, 12</h3>
              <p className="text-muted-foreground text-sm">Har class ke hisaab se answer level</p>
            </div>
          </div>
        </NeonCard>
      </div>

      {/* CTA */}
      <Link to="/study">
        <NeonButton neonColor="cyan" size="lg">
          Start Studying →
        </NeonButton>
      </Link>
    </div>
  );
};

export default HomePage;
