import { generateRoadmapOpenAI } from "./openai.js";
import { generateRoadmapAnthropic } from "./anthropic.js";
import { generateRoadmapMiniMax } from "./minimax.js";

export async function callLLM(
  provider: "openai" | "anthropic" | "minimax",
  prompt: string,
  returnFullRoadmap: boolean = false
): Promise<unknown> {
  const result = await (provider === "openai" 
    ? generateRoadmapOpenAI(prompt, returnFullRoadmap)
    : provider === "anthropic"
      ? generateRoadmapAnthropic(prompt, returnFullRoadmap)
      : generateRoadmapMiniMax(prompt, returnFullRoadmap)
  );
  return result;
}
