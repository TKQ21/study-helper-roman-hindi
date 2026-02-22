import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import NeonButton from "@/components/NeonButton";
import NeonCard from "@/components/NeonCard";
import { ArrowLeft, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type AnswerLength = "short" | "long";

const StudyPage: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [classLevel, setClassLevel] = useState("10");
  const [answerLength, setAnswerLength] = useState<AnswerLength>("short");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const answerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    setError("");
    setAnswer("");
    setIsLoading(true);

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/roman-hindi-answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ question, classLevel, answerLength }),
        }
      );

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullAnswer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullAnswer += content;
              setAnswer(fullAnswer);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Save to history
      const history = JSON.parse(localStorage.getItem("study-history") || "[]");
      history.unshift({
        question,
        answer: fullAnswer,
        classLevel,
        answerLength,
        timestamp: Date.now(),
      });
      localStorage.setItem("study-history", JSON.stringify(history.slice(0, 50)));

      // Scroll to answer
      setTimeout(() => answerRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen neon-bg-grid px-4 pb-24 pt-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/">
            <NeonButton neonColor="pink" size="sm">
              <ArrowLeft size={18} />
            </NeonButton>
          </Link>
          <h1 className="font-display text-2xl font-bold neon-text-cyan">Study Helper</h1>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Class selector */}
          <NeonCard neonColor="yellow" className="p-3">
            <label className="font-display text-xs tracking-wider text-neon-yellow block mb-2">
              Class
            </label>
            <div className="flex gap-2">
              {["8", "10", "12"].map((c) => (
                <button
                  key={c}
                  onClick={() => setClassLevel(c)}
                  className={`font-display text-sm px-3 py-1.5 rounded-md border transition-all ${
                    classLevel === c
                      ? "neon-border-yellow bg-neon-yellow/10 text-neon-yellow"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </NeonCard>

          {/* Length selector */}
          <NeonCard neonColor="green" className="p-3">
            <label className="font-display text-xs tracking-wider text-neon-green block mb-2">
              Length
            </label>
            <div className="flex gap-2">
              {(["short", "long"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setAnswerLength(l)}
                  className={`font-display text-sm px-3 py-1.5 rounded-md border transition-all capitalize ${
                    answerLength === l
                      ? "neon-border-green bg-neon-green/10 text-neon-green"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </NeonCard>
        </div>

        {/* Question input */}
        <NeonCard neonColor="cyan" className="mb-4">
          <label className="font-display text-xs tracking-wider neon-text-cyan block mb-2">
            Your Question (Hindi / Urdu / English)
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Yahan apna sawaal likho..."
            rows={4}
            className="w-full bg-background/50 border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan resize-none font-body text-lg"
          />
        </NeonCard>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-neon-red bg-neon-red/5 text-neon-red font-body text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <NeonButton
          neonColor="green"
          size="lg"
          className="w-full mb-6"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={20} />
              Soch raha hai...
            </span>
          ) : (
            "✨ Answer"
          )}
        </NeonButton>

        {/* Answer display */}
        {answer && (
          <div ref={answerRef}>
            <NeonCard neonColor="pink" className="mb-6">
              <h3 className="font-display text-sm tracking-wider neon-text-pink mb-3">
                Jawab (Roman Hindi)
              </h3>
              <div className="prose prose-invert prose-sm max-w-none font-body text-foreground leading-relaxed">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            </NeonCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPage;
