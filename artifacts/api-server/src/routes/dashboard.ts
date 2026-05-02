import { Router } from "express";
import { db, projectsTable, activityTable } from "@workspace/db";
import { eq, count, avg, sum, desc } from "drizzle-orm";

const router = Router();

// Dashboard stats
router.get("/dashboard/stats", async (req, res) => {
  const [totals] = await db
    .select({
      totalProjects: count(),
      avgOverallScore: avg(projectsTable.overallScore),
      totalApiCalls: sum(projectsTable.apiCallCount),
    })
    .from(projectsTable);

  const [activeCount] = await db
    .select({ count: count() })
    .from(projectsTable)
    .where(eq(projectsTable.status, "active"));

  const withSummaryResult = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.status, "active"));

  const projectsWithSummary = withSummaryResult.filter((p) => !!p.aiSummary).length;

  // Top scoring project
  const [topProject] = await db
    .select()
    .from(projectsTable)
    .orderBy(desc(projectsTable.overallScore))
    .limit(1);

  const topScoringProject = topProject
    ? {
        ...topProject,
        priceMin: topProject.priceMin ? parseFloat(topProject.priceMin) : undefined,
        priceMax: topProject.priceMax ? parseFloat(topProject.priceMax) : undefined,
        carpetAreaMin: topProject.carpetAreaMin ? parseFloat(topProject.carpetAreaMin) : undefined,
        carpetAreaMax: topProject.carpetAreaMax ? parseFloat(topProject.carpetAreaMax) : undefined,
        valueScore: topProject.valueScore ? parseFloat(topProject.valueScore) : undefined,
        locationScore: topProject.locationScore ? parseFloat(topProject.locationScore) : undefined,
        trustScore: topProject.trustScore ? parseFloat(topProject.trustScore) : undefined,
        overallScore: topProject.overallScore ? parseFloat(topProject.overallScore) : undefined,
        hasSummary: !!topProject.aiSummary,
      }
    : null;

  res.json({
    totalProjects: Number(totals.totalProjects) || 0,
    activeProjects: Number(activeCount.count) || 0,
    totalApiCalls: Number(totals.totalApiCalls) || 0,
    avgOverallScore: totals.avgOverallScore ? Math.round(parseFloat(totals.avgOverallScore) * 10) / 10 : 0,
    projectsWithSummary,
    topScoringProject,
  });
});

// Recent activity
router.get("/dashboard/recent-activity", async (req, res) => {
  const activity = await db
    .select()
    .from(activityTable)
    .orderBy(desc(activityTable.timestamp))
    .limit(20);

  res.json(
    activity.map((a) => ({
      id: a.id,
      projectId: a.projectId,
      projectName: a.projectName,
      action: a.action,
      timestamp: a.timestamp.toISOString(),
    }))
  );
});

export default router;
