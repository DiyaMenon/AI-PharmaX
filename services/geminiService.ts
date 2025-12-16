import { PharmaAnalysisResult, AgentType, AgentStatus } from "../types";

/* =======================
   OpenRouter Config
======================= */

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

/* =======================
   MAIN FUNCTION
======================= */

export const analyzeDrug = async (query: string): Promise<PharmaAnalysisResult> => {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key missing");
  }

  const systemPrompt = `
You are AI-PharmaX, an enterprise-grade Agentic AI System.

You MUST return ONLY valid JSON.
Do NOT add explanations.
Do NOT add markdown.

Return JSON with EXACTLY this structure:

{
  "taskDecomposition": {
    "strategy": "string",
    "activatedAgents": ["Clinical Trials Agent", "Patent Landscape Agent", "IQVIA Market Insights Agent", "EXIM Trade Trends Agent", "Web Intelligence Agent"]
  },
  "decisionSupport": {
    "clinicalReadiness": "High | Medium | Low",
    "patentRisk": "Low | Medium | High",
    "commercialScore": number
  },
  "agentOutputs": [
    {
      "agentName": "string",
      "agentType": "${Object.values(AgentType).join(" | ")}",
      "description": "string",
      "findings": "string",
      "riskLevel": "LOW | MEDIUM | HIGH | CRITICAL | UNKNOWN",
      "outlook": "POSITIVE | NEUTRAL | NEGATIVE | MIXED | UNKNOWN",
      "status": "${AgentStatus.COMPLETED}"
    }
  ],
  "finalReport": {
    "executiveSummary": "string",
    "sections": [
      { "title": "string", "content": "string" }
    ],
    "recommendation": "string"
  }
}
`;

  try {
    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "AI-PharmaX"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze the drug: ${query}` }
        ],
        temperature: 0.4
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter error ${response.status}`);
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content;

    if (!raw) {
      throw new Error("No response content from OpenRouter");
    }

    return JSON.parse(raw) as PharmaAnalysisResult;

  } catch (error) {
    console.error("AI-PharmaX analysis failed:", error);
    throw error;
  }
};
