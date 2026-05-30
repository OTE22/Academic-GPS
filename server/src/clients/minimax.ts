import { extractJSON } from "./utils.js";
import { parseRoadmap } from "../schema.js";

export async function generateRoadmapMiniMax(prompt: string, returnFullRoadmap: boolean = false): Promise<unknown> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + (process.env.OPENROUTER_API_KEY || process.env.MINIMAX_API_KEY),
      "HTTP-Referer": "http://localhost:3001",
      "X-Title": "Academic GPS"
    },
    body: JSON.stringify({
      model: "minimax/minimax-m2.7",
      messages: [
        { role: "system", content: "You are an elite academic counselor. Return ONLY valid JSON. No markdown, no explanation." },
        { role: "user", content: prompt + "\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no explanation." }
      ],
      max_tokens: 4096,
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("OpenRouter API error " + response.status + ": " + errorText);
  }

  const data = await response.json();
  const message = data.choices?.[0]?.message;
  let content = message?.content;
  if (!content && message?.reasoning) {
    content = message.reasoning;
  }
  if (!content) {
    content = "{}";
  }
  const extracted = extractJSON(content);
  
  if (returnFullRoadmap) {
    return parseRoadmap(extracted);
  }
  
  return extracted;
}
