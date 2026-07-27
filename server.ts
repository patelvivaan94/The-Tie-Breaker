import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Shared Gemini Client with telemetry User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summary: { type: Type.STRING },
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          tagline: { type: Type.STRING },
          pros: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                importance: { type: Type.INTEGER },
                category: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ["id", "text", "importance", "category"],
            },
          },
          cons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                severity: { type: Type.INTEGER },
                category: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ["id", "text", "severity", "category"],
            },
          },
          swot: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["strengths", "weaknesses", "opportunities", "threats"],
          },
        },
        required: ["id", "name", "tagline", "pros", "cons", "swot"],
      },
    },
    comparisonCriteria: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          key: { type: Type.STRING },
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          defaultWeight: { type: Type.INTEGER },
          scores: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                optionId: { type: Type.STRING },
                score: { type: Type.INTEGER },
                reasoning: { type: Type.STRING },
              },
              required: ["optionId", "score", "reasoning"],
            },
          },
        },
        required: ["key", "name", "description", "defaultWeight", "scores"],
      },
    },
    verdict: {
      type: Type.OBJECT,
      properties: {
        winnerOptionId: { type: Type.STRING },
        winnerName: { type: Type.STRING },
        confidencePercentage: { type: Type.INTEGER },
        headline: { type: Type.STRING },
        detailedRecommendation: { type: Type.STRING },
        whenToChooseOthers: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              optionId: { type: Type.STRING },
              condition: { type: Type.STRING },
            },
            required: ["optionId", "condition"],
          },
        },
        blindSpots: { type: Type.ARRAY, items: { type: Type.STRING } },
        diagnosticQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: [
        "winnerOptionId",
        "winnerName",
        "confidencePercentage",
        "headline",
        "detailedRecommendation",
        "whenToChooseOthers",
        "blindSpots",
        "diagnosticQuestions",
      ],
    },
  },
  required: ["title", "summary", "options", "comparisonCriteria", "verdict"],
};

app.post("/api/gemini/analyze-decision", async (req, res) => {
  try {
    const { prompt, options, context } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Decision prompt is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not configured.",
      });
    }

    let userInstruction = `You are "The Tie Breaker", an elite, objective decision strategist.
Analyze the following decision dilemma thoroughly.

User Decision Request: "${prompt.trim()}"`;

    if (options && Array.isArray(options) && options.filter(Boolean).length > 0) {
      userInstruction += `\nSpecified Options to compare: ${options.filter(Boolean).join(", ")}`;
    } else {
      userInstruction += `\n(If options were not explicitly provided, extract the 2 to 4 most logical choices or alternatives from the prompt).`;
    }

    if (context && typeof context === "string" && context.trim()) {
      userInstruction += `\nUser Preferences / Priorities / Context: "${context.trim()}"`;
    }

    userInstruction += `\n
Ensure each option has:
- A unique concise id (e.g., 'opt-1', 'opt-2')
- Name & a catchy tagline
- 3 to 5 realistic Pros with importance (1=minor, 5=critical) and a category (e.g. Financial, Career, Health, Effort, Personal, Long-term)
- 3 to 5 realistic Cons with severity (1=minor, 5=severe) and a category
- SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats - 3 items each)

Provide 4 to 6 Evaluation Criteria for the Comparison Matrix (e.g. Cost & Value, Growth Potential, Risk, Life Impact, Maintenance Effort).
For each criterion, assign scores (1 to 10) to each option with a 1-sentence reasoning.

Finally, break the tie in 'verdict':
- Name the best overall option (winnerOptionId)
- Provide a confidence score (60-95%)
- Write a clear, decisive headline and detailed recommendation
- Detail under what conditions someone should choose the other options instead ("whenToChooseOthers")
- Highlight 3 critical blind spots or hidden risks people overlook
- Give 3 diagnostic self-reflection questions to help the user finalize their choice.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userInstruction,
      config: {
        systemInstruction:
          "You are an expert decision scientist, behavioral strategist, and executive coach. Your analysis must be balanced, sharp, actionable, realistic, and non-generic. Avoid fluff.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error("No output generated by AI model.");
    }

    const data = JSON.parse(rawText);
    return res.json({ success: true, data });
  } catch (err: any) {
    console.error("Error in /api/gemini/analyze-decision:", err);
    return res.status(500).json({
      error: err.message || "Failed to analyze decision.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
