import OpenAI from "openai";
import { extractJSON } from "./utils.js";
import { parseRoadmap } from "../schema.js";

const client = new OpenAI();

export async function generateRoadmapOpenAI(prompt: string, returnFullRoadmap: boolean = false): Promise<unknown> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an elite academic counselor. Return ONLY valid JSON. No markdown, no explanation." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content || "{}";
  const extracted = extractJSON(content);
  
  if (returnFullRoadmap) {
    return parseRoadmap(extracted);
  }
  
  return extracted;
}
