import React from "react";
import { Link } from "react-router-dom";
import NeonButton from "@/components/NeonButton";
import NeonCard from "@/components/NeonCard";
import { BookOpen, Sparkles, Zap, Mic, Languages, Target, Shield, MessageSquare } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-[100dvh] neon-bg-grid px-3 sm:px-4 pb-20">
      {/* Floating orbs background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-5 w-24 sm:w-32 h-24 sm:h-32 bg-neon-cyan/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-5 w-28 sm:w-40 h-28 sm:h-40 bg-neon-pink/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/4 w-24 sm:w-36 h-24 sm:h-36 bg-neon-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center pt-6">
        <h1 className="font-display text-3xl sm:text-5xl font-bold mb-2">
          <span className="neon-text-cyan">Roman Hindi</span>
        </h1>
        <h2 className="font-display text-lg sm:text-2xl font-semibold neon-text-pink mb-3">
          Study Helper
        </h2>
        <p className="text-muted-foreground max-w-xs sm:max-w-lg mx-auto text-sm sm:text-lg leading-relaxed mb-6">
          Get precise, exam-style answers to your academic questions in Roman Hindi. Perfect for NCERT and CBSE students — Class 1 to 12.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-md">
          <Link to="/study" className="flex-1">
            <NeonButton neonColor="cyan" size="lg" className="w-full bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20">
              Start Asking Questions →
            </NeonButton>
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-lg mx-auto mb-10">
        <div className="grid grid-cols-2 gap-3 mb-8">
          <NeonCard neonColor="cyan" className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Languages className="text-neon-cyan shrink-0" size={20} />
              <h3 className="font-display text-sm font-semibold text-neon-cyan">Multi-Language</h3>
            </div>
            <p className="text-muted-foreground text-xs">Hindi, Urdu, English mein sawaal poochho</p>
          </NeonCard>

          <NeonCard neonColor="pink" className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="text-neon-pink shrink-0" size={20} />
              <h3 className="font-display text-sm font-semibold text-neon-pink">Voice Input</h3>
            </div>
            <p className="text-muted-foreground text-xs">Bol ke sawaal poochho, type karne ki zarurat nahi</p>
          </NeonCard>

          <NeonCard neonColor="green" className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-neon-green shrink-0" size={20} />
              <h3 className="font-display text-sm font-semibold text-neon-green">Exam-Accurate</h3>
            </div>
            <p className="text-muted-foreground text-xs">NCERT/CBSE style answers jo exam mein kaam aayein</p>
          </NeonCard>

          <NeonCard neonColor="yellow" className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-neon-yellow shrink-0" size={20} />
              <h3 className="font-display text-sm font-semibold text-neon-yellow">Subject Detection</h3>
            </div>
            <p className="text-muted-foreground text-xs">Automatic subject aur topic identification</p>
          </NeonCard>
        </div>

        {/* How It Works */}
        <h2 className="font-display text-xl sm:text-2xl font-bold neon-text-pink text-center mb-5">How It Works</h2>
        <div className="space-y-3 mb-8">
          {[
            { step: 1, text: "Study page pe jaao aur apna sawaal likho ya bolo" },
            { step: 2, text: "AI automatically subject aur class detect karega" },
            { step: 3, text: "Roman Hindi mein exam-ready jawab milega instantly" },
          ].map(({ step, text }) => (
            <NeonCard key={step} neonColor="cyan" className="p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-pink/30 flex items-center justify-center shrink-0">
                <span className="font-display text-sm font-bold text-neon-cyan">{step}</span>
              </div>
              <p className="text-foreground text-sm">{text}</p>
            </NeonCard>
          ))}
        </div>

        {/* Supported Subjects */}
        <NeonCard neonColor="pink" className="p-4 sm:p-6 text-center">
          <h3 className="font-display text-base font-semibold neon-text-pink mb-2">Supported Subjects</h3>
          <p className="text-muted-foreground text-xs mb-3">We cover all major NCERT/CBSE subjects</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["English", "Hindi", "Science", "Maths", "Social Studies", "Sanskrit"].map((s) => (
              <span key={s} className="font-display text-xs px-3 py-1.5 rounded-full border border-border text-foreground bg-card/50">
                {s}
              </span>
            ))}
          </div>
        </NeonCard>
      </div>
    </div>
  );
};

export default HomePage;
