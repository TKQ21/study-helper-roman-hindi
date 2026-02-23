import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join("");
      setQuestion(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => { setIsListening(false); setError("Voice input failed. Try again."); };
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const toggleSpeakAnswer = () => {
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
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
    return () => { window.speechSynthesis.cancel(); recognitionRef.current?.stop(); };
  }, []);

  const handleSubmit = async () => {
    if (!question.trim()) { setError("Please enter a question"); return; }
    setError(""); setAnswer(""); setIsLoading(true);
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
            if (content) { fullAnswer += content; setAnswer(fullAnswer); }
          } catch { buffer = line + "\n" + buffer; break; }
        }
      }
      const history = JSON.parse(localStorage.getItem("study-history") || "[]");
      history.unshift({ question, answer: fullAnswer, classLevel, answerLength, timestamp: Date.now() });
      localStorage.setItem("study-history", JSON.stringify(history.slice(0, 50)));
      setTimeout(() => answerRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setIsLoading(false); }
  };

  const classes = Array.from({ length: 12 }, (_, i) => String(i + 1));

  return (
    <div className="min-h-[100dvh] px-4 pb-20 pt-4 sm:pt-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <Link to="/">
            <button className="glass-card px-3 py-2 text-foreground hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold gradient-text">Ask Your Question</h1>
            <p className="text-muted-foreground text-xs">Type or speak your question in any language</p>
          </div>
        </div>

        {/* Class selector */}
        <div className="glass-card p-3 mb-3">
          <label className="text-xs font-semibold tracking-wider gradient-text block mb-2">
            Select Class (1-12)
          </label>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {classes.map((c) => (
              <button
                key={c}
                onClick={() => setClassLevel(c)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all shrink-0 min-w-[36px] font-medium ${
                  classLevel === c
                    ? "neon-btn text-white"
                    : "glass-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Length selector */}
        <div className="glass-card p-3 mb-3">
          <label className="text-xs font-semibold tracking-wider gradient-text block mb-2">
            Answer Length
          </label>
          <div className="flex gap-2">
            {(["short", "long"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setAnswerLength(l)}
                className={`text-sm px-4 py-2 rounded-lg transition-all capitalize flex-1 font-medium ${
                  answerLength === l
                    ? "neon-btn text-white"
                    : "glass-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Question input */}
        <div className="glass-card p-4 mb-3">
          <label className="text-xs font-semibold tracking-wider gradient-text block mb-2">
            Your Question (Hindi / Urdu / English)
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: Explain the main theme of 'The Lost Child' in 4-6 lines..."
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#ff00cc80] resize-none text-sm"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={toggleVoiceInput}
              className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isListening
                  ? "neon-btn text-white animate-pulse"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              {isListening ? "Stop" : "Voice Input"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl text-sm font-semibold neon-btn text-white"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin" size={16} /> Soch raha hai...</>
              ) : (
                <><Send size={16} /> Submit</>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-3 p-3 rounded-xl glass-card border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Answer */}
        {answer && (
          <div ref={answerRef}>
            <div className="glass-card p-4 mb-6 glow-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold gradient-text">Jawab (Roman Hindi)</h3>
                <button
                  onClick={toggleSpeakAnswer}
                  className={`p-2 rounded-lg transition-all ${
                    isSpeaking
                      ? "neon-btn text-white animate-pulse"
                      : "glass-card text-muted-foreground hover:text-foreground"
                  }`}
                  title={isSpeaking ? "Stop speaking" : "Listen to answer"}
                >
                  {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
              <div className="prose prose-invert prose-sm max-w-none text-foreground/90 leading-relaxed">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPage;
