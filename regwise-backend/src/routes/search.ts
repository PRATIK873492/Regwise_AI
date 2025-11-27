import { Router } from "express";
import { Request, Response } from "express";
import CountryModel from "../models/Country";

const router = Router();

/**
 * POST /api/search
 * body: { country, query }
 * NOTE: The backend can return a mock result or call an AI API if configured.
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { country, query } = req.body as { country?: string; query?: string };
    if (!query) return res.status(400).json({ message: "query required" });

    // Optionally, fetch country details for context
    const countryObj = country
      ? await CountryModel.findOne({
          $or: [{ code: country }, { name: country }],
        }).lean()
      : null;

    const summary = `Based on ${
      countryObj?.name || country || "the country"
    }'s regulatory framework, ${query.toLowerCase()} requires compliance measures such as KYC, transaction monitoring, and reporting to authorities.`;
    const response = {
      query,
      country: countryObj?.name || country || "",
      summary,
      citations: [
        {
          id: "1",
          title: "Sample Regulation",
          url: "https://example.com",
          source: "Regulator",
          date: new Date().toISOString(),
        },
      ],
      relatedTopics: ["KYC", "AML/CTF", "Transaction Monitoring"],
    };

    return res.json(response);
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ message: "Internal error" });
  }
});

export default router;
