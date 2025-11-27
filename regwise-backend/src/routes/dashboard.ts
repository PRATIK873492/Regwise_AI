import { Router } from "express";
const router = Router();

// GET /api/dashboard/metrics
router.get("/metrics", async (_req, res) => {
  try {
    const metrics = {
      totalCountries: 50,
      activeAlerts: 12,
      complianceScore: 87,
      lastUpdated: new Date().toISOString(),
      riskBreakdown: { low: 45, medium: 35, high: 20 },
      recentActivity: [
        {
          id: "1",
          type: "search",
          description: "Searched compliance requirements for United States",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          country: "United States",
        },
        {
          id: "2",
          type: "alert",
          description: "New regulatory alert for Singapore",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          country: "Singapore",
        },
        {
          id: "3",
          type: "update",
          description: "Onboarding workflow updated for Germany",
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          country: "Germany",
        },
      ],
    };
    res.json(metrics);
  } catch (err) {
    console.error("Dashboard metrics error:", err);
    res.status(500).json({ message: "Failed to fetch metrics" });
  }
});

export default router;
