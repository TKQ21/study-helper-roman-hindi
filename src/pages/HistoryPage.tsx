import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NeonButton from "@/components/NeonButton";
import NeonCard from "@/components/NeonCard";
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
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen neon-bg-grid px-4 pb-24 pt-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/">
              <NeonButton neonColor="cyan" size="sm">
                <ArrowLeft size={18} />
              </NeonButton>
            </Link>
            <h1 className="font-display text-2xl font-bold neon-text-pink">History</h1>
          </div>
          {history.length > 0 && (
            <NeonButton neonColor="red" size="sm" onClick={clearHistory}>
              <Trash2 size={16} />
            </NeonButton>
          )}
        </div>

        {/* Selected detail */}
        {selected && (
          <NeonCard neonColor="cyan" className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-display text-sm neon-text-cyan">Full Answer</h3>
              <button onClick={() => setSelected(null)} className="text-muted-foreground text-xs hover:text-foreground">
                Close
              </button>
            </div>
            <p className="text-foreground font-semibold mb-2">{selected.question}</p>
            <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">{selected.answer}</p>
          </NeonCard>
        )}

        {/* History list */}
        {history.length === 0 ? (
          <NeonCard neonColor="yellow" className="text-center">
            <Clock className="mx-auto mb-3 text-neon-yellow" size={32} />
            <p className="text-muted-foreground">Koi history nahi hai abhi. Study page pe jaake sawaal poochho!</p>
            <Link to="/study" className="inline-block mt-4">
              <NeonButton neonColor="green" size="sm">Go to Study →</NeonButton>
            </Link>
          </NeonCard>
        ) : (
          <div className="space-y-3">
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => setSelected(item)}
                className="w-full text-left"
              >
                <NeonCard
                  neonColor={i % 3 === 0 ? "cyan" : i % 3 === 1 ? "green" : "pink"}
                  className="hover:scale-[1.01] transition-transform cursor-pointer p-4"
                >
                  <p className="text-foreground font-semibold text-sm line-clamp-2 mb-1">
                    {item.question}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Class {item.classLevel}</span>
                    <span>•</span>
                    <span className="capitalize">{item.answerLength}</span>
                    <span>•</span>
                    <span>{formatTime(item.timestamp)}</span>
                  </div>
                </NeonCard>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
