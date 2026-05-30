import Anthropic from "@anthropic-ai/sdk";
import { extractJSON } from "./utils.js";
import { parseRoadmap } from "../schema.js";

const client = new Anthropic();

export async function generateRoadmapAnthropic(prompt: string, returnFullRoadmap: boolean = false): Promise<unknown> {
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 4096,
    messages: [
      { role: "user", content: prompt + "\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no explanation." }
    ]
  });

  const content = response.content[0].type === "text" ? response.content[0].text : "{}";
  const extracted = extractJSON(content);
  
  if (returnFullRoadmap) {
    return parseRoadmap(extracted);
  }
  
  return extracted;
}
