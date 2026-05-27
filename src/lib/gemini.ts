// Server-only. AI summarizer + sentiment tagger.
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface AISummary {
  tldr: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
}

const SYSTEM_PROMPT = `You are a financial news analyst. Given a news article description, respond ONLY with valid JSON in this exact shape:
{"tldr":"one sentence summary under 20 words","sentiment":"Bullish"|"Bearish"|"Neutral"}
No markdown. No explanation. JSON only.`;

export async function summarizeArticle(description: string): Promise<AISummary> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(description.slice(0, 800));
    const text = result.response.text().trim();

    // Strip accidental markdown fences
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean) as AISummary;
  } catch {
    return { tldr: "Summary unavailable.", sentiment: "Neutral" };
  }
}

// Batch — summarize up to N articles, respects Gemini rate limits
export async function summarizeArticles(
  descriptions: string[],
  limit = 5
): Promise<AISummary[]> {
  const slice = descriptions.slice(0, limit);

  // Sequential with small delay — avoid 429s on free tier
  const results: AISummary[] = [];
  for (const desc of slice) {
    results.push(await summarizeArticle(desc));
    await new Promise((r) => setTimeout(r, 200));
  }
  return results;
}