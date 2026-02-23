import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Mic, Languages, Target } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-[100dvh] px-4 pb-20">
      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#ff00cc20] rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-10 w-40 h-40 bg-[#3366ff20] rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/4 w-36 h-36 bg-[#ff00cc15] rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center pt-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2">
          <span className="gradient-text">Roman Hindi</span>
        </h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground/80 mb-3">
          Study Helper
        </h2>
        <p className="text-muted-foreground max-w-xs sm:max-w-lg mx-auto text-sm sm:text-base leading-relaxed mb-8">
          Get precise, exam-style answers to your academic questions in Roman Hindi. Perfect for NCERT and CBSE students — Class 1 to 12.
        </p>

        <Link to="/study" className="w-full max-w-xs">
          <button className="neon-btn w-full py-3.5 px-6 text-base font-semibold rounded-xl animate-glow">
            Start Asking Questions →
          </button>
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="max-w-lg mx-auto mb-10">
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Languages className="text-[#ff00cc] shrink-0" size={20} />
              <h3 className="text-sm font-semibold gradient-text">Multi-Language</h3>
            </div>
            <p className="text-muted-foreground text-xs">Hindi, Urdu, English mein sawaal poochho</p>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="text-[#3366ff] shrink-0" size={20} />
              <h3 className="text-sm font-semibold gradient-text">Voice Input</h3>
            </div>
            <p className="text-muted-foreground text-xs">Bol ke sawaal poochho, type karne ki zarurat nahi</p>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-[#ff00cc] shrink-0" size={20} />
              <h3 className="text-sm font-semibold gradient-text">Exam-Accurate</h3>
            </div>
            <p className="text-muted-foreground text-xs">NCERT/CBSE style answers jo exam mein kaam aayein</p>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-[#3366ff] shrink-0" size={20} />
              <h3 className="text-sm font-semibold gradient-text">Subject Detection</h3>
            </div>
            <p className="text-muted-foreground text-xs">Automatic subject aur topic identification</p>
          </div>
        </div>

        {/* How It Works */}
        <h2 className="text-xl sm:text-2xl font-bold gradient-text text-center mb-5">How It Works</h2>
        <div className="space-y-3 mb-8">
          {[
            { step: 1, text: "Study page pe jaao aur apna sawaal likho ya bolo" },
            { step: 2, text: "AI automatically subject aur class detect karega" },
            { step: 3, text: "Roman Hindi mein exam-ready jawab milega instantly" },
          ].map(({ step, text }) => (
            <div key={step} className="glass-card p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-full neon-btn flex items-center justify-center shrink-0 text-sm font-bold">
                {step}
              </div>
              <p className="text-foreground text-sm">{text}</p>
            </div>
          ))}
        </div>

        {/* Supported Subjects */}
        <div className="glass-card p-5 text-center">
          <h3 className="text-base font-semibold gradient-text mb-2">Supported Subjects</h3>
          <p className="text-muted-foreground text-xs mb-3">We cover all major NCERT/CBSE subjects</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["English", "Hindi", "Science", "Maths", "Social Studies", "Sanskrit"].map((s) => (
              <span key={s} className="text-xs px-3 py-1.5 rounded-full glass-card text-foreground font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
