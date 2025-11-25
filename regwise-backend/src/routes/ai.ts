import { Router } from "express";
import axios from "axios";

const router = Router();

/**
 * POST /api/ai/prompt
 * body: { prompt: string }
 * Proxies to OpenAI (if OPENAI_API_KEY is set). Use carefully.
 */
router.post("/prompt", async (req, res) => {
  try {
    const { prompt } = req.body as { prompt?: string };
    if (!prompt) return res.status(400).json({ message: "prompt is required" });

    const key = process.env.OPENAI_API_KEY;
    if (!key) return res.status(500).json({ message: "OPENAI_API_KEY not configured" });

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`
        }
      }
    );

    return res.json(response.data);
  } catch (err) {
    console.error("AI proxy error:", err);
    return res.status(500).json({ message: "AI proxy error", error: (err as Error).message });
  }
});

export default router;
