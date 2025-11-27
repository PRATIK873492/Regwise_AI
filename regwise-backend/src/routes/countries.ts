import { Router, Request, Response } from "express";
import CountryModel from "../models/Country";

const router = Router();

// GET /api/countries
router.get("/", async (_req, res) => {
  try {
    const countries = await CountryModel.find()
      .select(
        "code name region currency population onboarding workflow regulators laws"
      )
      .lean();
    res.json(countries);
  } catch (err) {
    console.error("Get countries error:", err);
    res.status(500).json({ message: "Failed to fetch countries" });
  }
});

// GET /api/country/:code/onboarding
router.get("/:code/onboarding", async (req, res) => {
  try {
    const code = req.params.code;
    const country = await CountryModel.findOne({
      $or: [{ code }, { name: code }],
    }).lean();
    if (!country) return res.status(404).json({ message: "Country not found" });
    // Prefer onboarding array (legacy) but fall back to the workflow object
    if (country.onboarding && country.onboarding.length) {
      res.json({
        country: country.name,
        steps: country.onboarding,
        estimatedTime:
          country.onboarding
            ?.map((s) => s.estimatedTime)
            .filter(Boolean)
            .join(", ") || "N/A",
        complianceLevel: "Standard",
        lastUpdated: new Date(),
      });
    } else if (country.workflow) {
      // Transform workflow object into a set of onboarding steps
      const steps = [] as any[];
      let stepCount = 1;

      if (country.workflow.kyc_steps && country.workflow.kyc_steps.length) {
        for (const stepTitle of country.workflow.kyc_steps) {
          steps.push({
            id: `${code}-kyc-${stepCount}`,
            stepNumber: stepCount,
            title: stepTitle,
            description: stepTitle,
            required: true,
            documents: [],
          });
          stepCount++;
        }
      }

      if (country.workflow.documents && country.workflow.documents.length) {
        steps.push({
          id: `${code}-docs-1`,
          stepNumber: stepCount,
          title: "Document Submission",
          description: "Provide required documentation",
          required: true,
          documents: country.workflow.documents,
        });
        stepCount++;
      }

      if (country.workflow.aml_checks && country.workflow.aml_checks.length) {
        steps.push({
          id: `${code}-aml-1`,
          stepNumber: stepCount,
          title: "AML Checks",
          description: country.workflow.aml_checks.join("; "),
          required: true,
          documents: [],
        });
        stepCount++;
      }

      res.json({
        country: country.name,
        steps,
        estimatedTime: "N/A",
        complianceLevel: "Standard",
        lastUpdated: new Date(),
      });
    } else {
      res.json({
        country: country.name,
        steps: [],
        estimatedTime: "N/A",
        complianceLevel: "Standard",
        lastUpdated: new Date(),
      });
    }
  } catch (err) {
    console.error("Get onboarding error:", err);
    res.status(500).json({ message: "Failed to fetch onboarding workflow" });
  }
});

// GET /api/countries/:code/summaries
router.get("/:code/summaries", async (req, res) => {
  try {
    const code = req.params.code;
    const country = await CountryModel.findOne({
      $or: [{ code }, { name: code }],
    }).lean();
    if (!country) return res.status(404).json({ message: "Country not found" });

    // Create a small set of summaries derived from the workflow
    const summaries = [
      {
        id: `${country.code}-aml`,
        country: country.name,
        category: "AML/CTF",
        title: "AML Requirements",
        summary:
          country.workflow?.aml_checks?.slice(0, 3).join("; ") ||
          "AML/CTF requirements include risk based KYC, transaction monitoring.",
        citations: [],
        lastUpdated: new Date(),
        riskLevel: "high",
      },
      {
        id: `${country.code}-kyc`,
        country: country.name,
        category: "KYC",
        title: "Customer Identification",
        summary:
          country.workflow?.kyc_steps?.slice(0, 3).join("; ") ||
          "Standard KYC steps",
        citations: [],
        lastUpdated: new Date(),
        riskLevel: "medium",
      },
    ];

    return res.json(summaries);
  } catch (err) {
    console.error("Get summaries error:", err);
    res.status(500).json({ message: "Failed to fetch summaries" });
  }
});

// GET /api/countries/:code/onboarding/export
router.get("/:code/onboarding/export", async (req, res) => {
  try {
    const code = req.params.code;
    const format = (req.query.format as string) || "json";
    const country = await CountryModel.findOne({
      $or: [{ code }, { name: code }],
    }).lean();
    if (!country) return res.status(404).json({ message: "Country not found" });

    // Build a simple payload for export
    const payload = {
      country: country.name,
      steps:
        country.onboarding && country.onboarding.length
          ? country.onboarding
          : [],
      workflow: country.workflow || {},
    } as any;

    if (format === "json") {
      const data = JSON.stringify(payload, null, 2);
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="onboarding-${country.code}.json"`
      );
      return res.send(data);
    }

    // PDF generation could be added here if needed. For now, return JSON as blob.
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(payload));
  } catch (err) {
    console.error("Export onboarding error:", err);
    res.status(500).json({ message: "Failed to export onboarding" });
  }
});

// export default router; // moved to bottom after all routes

// PUT /api/countries/:code/onboarding
router.put("/:code/onboarding", async (req: Request, res: Response) => {
  try {
    const code = req.params.code;
    const { steps, estimatedTime, complianceLevel } = req.body;
    if (!steps || !Array.isArray(steps)) {
      return res.status(400).json({ message: "Invalid steps payload" });
    }

    const country = await CountryModel.findOneAndUpdate(
      { $or: [{ code }, { name: code }] },
      { $set: { onboarding: steps, updatedAt: new Date() } },
      { new: true }
    ).lean();

    if (!country) return res.status(404).json({ message: "Country not found" });

    res.json({ country: country.name, steps: country.onboarding || [] });
  } catch (err) {
    console.error("Save onboarding error:", err);
    res.status(500).json({ message: "Failed to save onboarding" });
  }
});

export default router;
