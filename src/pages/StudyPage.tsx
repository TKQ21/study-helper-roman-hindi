import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import NeonButton from "@/components/NeonButton";
import NeonCard from "@/components/NeonCard";
import { ArrowLeft, Loader2, Mic, MicOff, Volume2, VolumeX, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

type AnswerLength = "short" | "long";

const StudyPage: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [classLevel, setClassLevel] = useState("10");
  const [answerLength, setAnswerLength] = useState<AnswerLength>("short");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Voice input using Web Speech API
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setQuestion(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setError("Voice input failed. Try again.");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  // TTS for answer
  const toggleSpeakAnswer = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if (!answer) return;

    const utterance = new SpeechSynthesisUtterance(answer.replace(/[#*_`]/g, ""));
    utterance.lang = "hi-IN";
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

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

      const history = JSON.parse(localStorage.getItem("study-history") || "[]");
      history.unshift({
        question,
        answer: fullAnswer,
        classLevel,
        answerLength,
        timestamp: Date.now(),
      });
      localStorage.setItem("study-history", JSON.stringify(history.slice(0, 50)));

      setTimeout(() => answerRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const classes = Array.from({ length: 12 }, (_, i) => String(i + 1));

  return (
    <div className="min-h-[100dvh] neon-bg-grid px-3 sm:px-4 pb-20 pt-4 sm:pt-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <Link to="/">
            <NeonButton neonColor="pink" size="sm">
              <ArrowLeft size={16} />
            </NeonButton>
          </Link>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold neon-text-cyan">Ask Your Question</h1>
            <p className="text-muted-foreground text-xs">Type or speak your question in any language</p>
          </div>
        </div>

        {/* Class selector - scrollable */}
        <NeonCard neonColor="yellow" className="p-2.5 sm:p-3 mb-3">
          <label className="font-display text-[10px] sm:text-xs tracking-wider text-neon-yellow block mb-1.5">
            Select Class (1-12)
          </label>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {classes.map((c) => (
              <button
                key={c}
                onClick={() => setClassLevel(c)}
                className={`font-display text-xs px-2.5 py-1.5 rounded-md border transition-all shrink-0 min-w-[36px] ${
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
        <NeonCard neonColor="green" className="p-2.5 sm:p-3 mb-3">
          <label className="font-display text-[10px] sm:text-xs tracking-wider text-neon-green block mb-1.5">
            Answer Length
          </label>
          <div className="flex gap-2">
            {(["short", "long"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setAnswerLength(l)}
                className={`font-display text-xs sm:text-sm px-3 py-1.5 rounded-md border transition-all capitalize flex-1 ${
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

        {/* Question input */}
        <NeonCard neonColor="cyan" className="mb-3 p-3 sm:p-4">
          <label className="font-display text-[10px] sm:text-xs tracking-wider neon-text-cyan block mb-1.5">
            Your Question (Hindi / Urdu / English)
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: Explain the main theme of 'The Lost Child' in 4-6 lines..."
            rows={4}
            className="w-full bg-background/50 border border-border rounded-lg p-2.5 sm:p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan resize-none font-body text-sm sm:text-base"
          />

          {/* Action buttons row */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={toggleVoiceInput}
              className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-lg border text-sm font-display transition-all ${
                isListening
                  ? "neon-border-pink bg-neon-pink/10 text-neon-pink animate-pulse"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-neon-cyan"
              }`}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              {isListening ? "Stop" : "Voice Input"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-lg border text-sm font-display transition-all bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 neon-border-cyan text-neon-cyan disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Soch raha hai...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit
                </>
              )}
            </button>
          </div>
        </NeonCard>

        {/* Error */}
        {error && (
          <div className="mb-3 p-3 rounded-lg border border-neon-red bg-neon-red/5 text-neon-red font-body text-sm">
            {error}
          </div>
        )}

        {/* Answer display */}
        {answer && (
          <div ref={answerRef}>
            <NeonCard neonColor="pink" className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-sm tracking-wider neon-text-pink">
                  Jawab (Roman Hindi)
                </h3>
                <button
                  onClick={toggleSpeakAnswer}
                  className={`p-2 rounded-lg border transition-all ${
                    isSpeaking
                      ? "neon-border-pink text-neon-pink animate-pulse"
                      : "border-border text-muted-foreground hover:text-neon-pink"
                  }`}
                  title={isSpeaking ? "Stop speaking" : "Listen to answer"}
                >
                  {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
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
