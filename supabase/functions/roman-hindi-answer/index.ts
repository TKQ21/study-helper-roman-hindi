import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, classLevel, answerLength } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!question || question.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Please enter a question" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const lengthInstruction = answerLength === "long"
      ? "Give a detailed answer in 150-250 words."
      : "Give a short and concise answer in 50-80 words.";

    const classNum = classLevel || "10";

    const systemPrompt = `You are an expert NCERT textbook study helper for Indian students.

YOUR PRIMARY KNOWLEDGE SOURCE:
- You MUST answer strictly based on NCERT textbook content and CBSE syllabus.
- Your answers should match what is written in NCERT books for the given class.
- Use NCERT-style explanations, definitions, and examples.
- If the topic is from a specific NCERT chapter, mention the chapter name.

CLASS VALIDATION (VERY IMPORTANT):
- The student is studying in Class ${classNum}.
- NCERT classes range from Class 1 to Class 12.
- If the question belongs to a DIFFERENT class (not Class ${classNum}), DO NOT answer it.
- Instead, reply: "Yeh sawaal Class ${classNum} ka nahi hai. Yeh sawaal Class [correct class number] ke NCERT syllabus mein aata hai. Kripya apni class sahi select karein."
- For example, if a Class 10 student asks about integration (which is Class 12 Math), tell them it's a Class 12 topic.
- If the question is not part of any NCERT syllabus (Class 1-12), reply: "Yeh sawaal NCERT syllabus mein nahi aata. Kripya NCERT se related sawaal puchein."
- For lower classes (1-5), use very simple language suitable for young children.
- For middle classes (6-8), use moderate difficulty.
- For higher classes (9-12), use appropriate academic level.

LANGUAGE RULES:
- ALWAYS write your answer in Roman Hindi (Hindi language using English/Latin alphabets, also called Romanized Hindi).
- Do NOT use Devanagari script or Urdu/Arabic script.
- Keep the language simple, easy to understand for Class ${classNum} students.

ANSWER FORMAT:
- Focus on exam-style answers that are clear and to the point.
- Use bullet points or numbered lists when helpful.
- Include key terms and definitions as they appear in NCERT books.
- ${lengthInstruction}
- Start your answer directly, don't repeat the question.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
