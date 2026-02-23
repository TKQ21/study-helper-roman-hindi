import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Clock } from "lucide-react";

interface HistoryItem {
  question: string;
  answer: string;
  classLevel: string;
  answerLength: string;
  timestamp: number;
}

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selected, setSelected] = useState<HistoryItem | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("study-history") || "[]");
    setHistory(data);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("study-history");
    setHistory([]);
    setSelected(null);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-[100dvh] px-4 pb-20 pt-4 sm:pt-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Link to="/">
              <button className="glass-card px-3 py-2 text-foreground hover:text-white transition-colors">
                <ArrowLeft size={18} />
              </button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold gradient-text">History</h1>
          </div>
          {history.length > 0 && (
            <button onClick={clearHistory} className="glass-card px-3 py-2 text-red-400 hover:text-red-300 transition-colors">
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {/* Selected detail */}
        {selected && (
          <div className="glass-card glow-border p-4 mb-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-semibold gradient-text">Full Answer</h3>
              <button onClick={() => setSelected(null)} className="text-muted-foreground text-xs hover:text-foreground">Close</button>
            </div>
            <p className="text-foreground font-semibold mb-2 text-sm">{selected.question}</p>
            <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">{selected.answer}</p>
          </div>
        )}

        {/* History list */}
        {history.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <Clock className="mx-auto mb-3 text-[#ff00cc]" size={32} />
            <p className="text-muted-foreground mb-4">Koi history nahi hai abhi. Study page pe jaake sawaal poochho!</p>
            <Link to="/study">
              <button className="neon-btn px-5 py-2 text-sm font-semibold">Go to Study →</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, i) => (
              <button key={i} onClick={() => setSelected(item)} className="w-full text-left">
                <div className="glass-card p-4 hover:scale-[1.01] transition-transform cursor-pointer glow-border">
                  <p className="text-foreground font-semibold text-sm line-clamp-2 mb-1">{item.question}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Class {item.classLevel}</span>
                    <span>•</span>
                    <span className="capitalize">{item.answerLength}</span>
                    <span>•</span>
                    <span>{formatTime(item.timestamp)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
