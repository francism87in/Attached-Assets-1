import { Router } from "express";
import { db, projectsTable, activityTable } from "@workspace/db";
import { eq, desc, ilike, or, and } from "drizzle-orm";
import {
  CreateProjectBody,
  UpdateProjectBody,
  ListProjectsQueryParams,
  GetProjectParams,
  UpdateProjectParams,
  DeleteProjectParams,
  GenerateProjectSummaryParams,
  GetProjectScorecardParams,
  RecalculateScoresParams,
  GetProjectApiEndpointParams,
  GetPublicProjectParams,
} from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

function calcValueScore(priceMin?: string | null, priceMax?: string | null, carpetAreaMin?: string | null, carpetAreaMax?: string | null): number {
  const pm = parseFloat(priceMin ?? "0");
  const pa = parseFloat(priceMax ?? "0");
  const ca = parseFloat(carpetAreaMin ?? "0");
  const cb = parseFloat(carpetAreaMax ?? "0");

  if (!pm || !ca) return 50;

  const avgPrice = pa ? (pm + pa) / 2 : pm;
  const avgArea = cb ? (ca + cb) / 2 : ca;
  const pricePerSqft = avgPrice / avgArea;

  if (pricePerSqft < 5000) return 90;
  if (pricePerSqft < 8000) return 75;
  if (pricePerSqft < 12000) return 60;
  if (pricePerSqft < 18000) return 45;
  return 30;
}

function calcOverallScore(valueScore: number, locationScore: number, trustScore: number): number {
  return Math.round((valueScore * 0.4 + locationScore * 0.35 + trustScore * 0.25) * 10) / 10;
}

async function logActivity(projectId: number, projectName: string, action: string) {
  await db.insert(activityTable).values({ projectId, projectName, action });
}

function projectOut(p: typeof projectsTable.$inferSelect) {
  return {
    ...p,
    priceMin: p.priceMin ? parseFloat(p.priceMin) : undefined,
    priceMax: p.priceMax ? parseFloat(p.priceMax) : undefined,
    carpetAreaMin: p.carpetAreaMin ? parseFloat(p.carpetAreaMin) : undefined,
    carpetAreaMax: p.carpetAreaMax ? parseFloat(p.carpetAreaMax) : undefined,
    valueScore: p.valueScore ? parseFloat(p.valueScore) : undefined,
    locationScore: p.locationScore ? parseFloat(p.locationScore) : undefined,
    trustScore: p.trustScore ? parseFloat(p.trustScore) : undefined,
    overallScore: p.overallScore ? parseFloat(p.overallScore) : undefined,
    hasSummary: !!p.aiSummary,
    apiCallCount: p.apiCallCount,
  };
}

// List projects — scoped to current user
router.get("/projects", requireAuth, async (req, res) => {
  const parseResult = ListProjectsQueryParams.safeParse(req.query);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { search, status } = parseResult.data;
  const userId = req.session.userId!;

  let query = db.select().from(projectsTable)
    .where(eq(projectsTable.userId, userId))
    .orderBy(desc(projectsTable.createdAt))
    .$dynamic();

  if (status) {
    query = query.where(and(eq(projectsTable.userId, userId), eq(projectsTable.status, status)));
  }
  if (search) {
    query = query.where(
      and(
        eq(projectsTable.userId, userId),
        or(
          ilike(projectsTable.name, `%${search}%`),
          ilike(projectsTable.developerName, `%${search}%`),
          ilike(projectsTable.location, `%${search}%`)
        )
      )
    );
  }

  const projects = await query;
  res.json(projects.map(projectOut));
});

// Create project — associate with current user
router.post("/projects", requireAuth, async (req, res) => {
  const parseResult = CreateProjectBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid body", details: parseResult.error.issues });
    return;
  }

  const body = parseResult.data;
  const locationScore = body.locationScore ?? 50;
  const trustScore = body.trustScore ?? 50;
  const valueScore = calcValueScore(
    body.priceMin?.toString(),
    body.priceMax?.toString(),
    body.carpetAreaMin?.toString(),
    body.carpetAreaMax?.toString()
  );
  const overallScore = calcOverallScore(valueScore, locationScore, trustScore);

  const [project] = await db.insert(projectsTable).values({
    userId: req.session.userId,
    name: body.name,
    developerName: body.developerName,
    location: body.location,
    city: body.city,
    state: body.state,
    priceMin: body.priceMin?.toString(),
    priceMax: body.priceMax?.toString(),
    carpetAreaMin: body.carpetAreaMin?.toString(),
    carpetAreaMax: body.carpetAreaMax?.toString(),
    possessionDate: body.possessionDate,
    unitTypes: body.unitTypes ?? [],
    amenities: body.amenities ?? [],
    valueScore: valueScore.toString(),
    locationScore: locationScore.toString(),
    trustScore: trustScore.toString(),
    overallScore: overallScore.toString(),
  }).returning();

  await logActivity(project.id, project.name, "Project created");
  res.status(201).json(projectOut(project));
});

// Get project — must belong to current user
router.get("/projects/:id", requireAuth, async (req, res) => {
  const parseResult = GetProjectParams.safeParse({ id: parseInt(req.params.id) });
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [project] = await db.select().from(projectsTable).where(
    and(eq(projectsTable.id, parseResult.data.id), eq(projectsTable.userId, req.session.userId!))
  );
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(projectOut(project));
});

// Update project — ownership required
router.put("/projects/:id", requireAuth, async (req, res) => {
  const idParse = UpdateProjectParams.safeParse({ id: parseInt(req.params.id) });
  if (!idParse.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const bodyParse = UpdateProjectBody.safeParse(req.body);
  if (!bodyParse.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  const [existing] = await db.select().from(projectsTable).where(
    and(eq(projectsTable.id, idParse.data.id), eq(projectsTable.userId, req.session.userId!))
  );
  if (!existing) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const body = bodyParse.data;
  const locationScore = body.locationScore ?? parseFloat(existing.locationScore ?? "50");
  const trustScore = body.trustScore ?? parseFloat(existing.trustScore ?? "50");
  const valueScore = calcValueScore(
    (body.priceMin ?? existing.priceMin)?.toString(),
    (body.priceMax ?? existing.priceMax)?.toString(),
    (body.carpetAreaMin ?? existing.carpetAreaMin)?.toString(),
    (body.carpetAreaMax ?? existing.carpetAreaMax)?.toString()
  );
  const overallScore = calcOverallScore(valueScore, locationScore, trustScore);

  const updateData: Partial<typeof projectsTable.$inferInsert> = {
    updatedAt: new Date(),
    valueScore: valueScore.toString(),
    locationScore: locationScore.toString(),
    trustScore: trustScore.toString(),
    overallScore: overallScore.toString(),
  };

  if (body.name !== undefined) updateData.name = body.name;
  if (body.developerName !== undefined) updateData.developerName = body.developerName;
  if (body.location !== undefined) updateData.location = body.location;
  if (body.city !== undefined) updateData.city = body.city;
  if (body.state !== undefined) updateData.state = body.state;
  if (body.priceMin !== undefined) updateData.priceMin = body.priceMin.toString();
  if (body.priceMax !== undefined) updateData.priceMax = body.priceMax.toString();
  if (body.carpetAreaMin !== undefined) updateData.carpetAreaMin = body.carpetAreaMin.toString();
  if (body.carpetAreaMax !== undefined) updateData.carpetAreaMax = body.carpetAreaMax.toString();
  if (body.possessionDate !== undefined) updateData.possessionDate = body.possessionDate;
  if (body.unitTypes !== undefined) updateData.unitTypes = body.unitTypes;
  if (body.amenities !== undefined) updateData.amenities = body.amenities;
  if (body.status !== undefined) updateData.status = body.status;

  const [updated] = await db.update(projectsTable).set(updateData)
    .where(and(eq(projectsTable.id, idParse.data.id), eq(projectsTable.userId, req.session.userId!)))
    .returning();

  await logActivity(updated.id, updated.name, "Project updated");
  res.json(projectOut(updated));
});

// Delete project — ownership required
router.delete("/projects/:id", requireAuth, async (req, res) => {
  const parseResult = DeleteProjectParams.safeParse({ id: parseInt(req.params.id) });
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [existing] = await db.select().from(projectsTable).where(
    and(eq(projectsTable.id, parseResult.data.id), eq(projectsTable.userId, req.session.userId!))
  );
  if (!existing) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  await db.delete(projectsTable).where(
    and(eq(projectsTable.id, parseResult.data.id), eq(projectsTable.userId, req.session.userId!))
  );
  res.status(204).send();
});

// Generate AI summary — ownership required
router.post("/projects/:id/generate-summary", requireAuth, async (req, res) => {
  const parseResult = GenerateProjectSummaryParams.safeParse({ id: parseInt(req.params.id) });
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [project] = await db.select().from(projectsTable).where(
    and(eq(projectsTable.id, parseResult.data.id), eq(projectsTable.userId, req.session.userId!))
  );
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const prompt = `You are an AI assistant analyzing Indian real estate projects. Generate a concise analysis for this project:

Project: ${project.name}
Developer: ${project.developerName}
Location: ${project.location}${project.city ? `, ${project.city}` : ""}${project.state ? `, ${project.state}` : ""}
Price Range: ${project.priceMin && project.priceMax ? `₹${Number(project.priceMin).toLocaleString("en-IN")} - ₹${Number(project.priceMax).toLocaleString("en-IN")}` : "Not specified"}
Carpet Area: ${project.carpetAreaMin && project.carpetAreaMax ? `${project.carpetAreaMin} - ${project.carpetAreaMax} sq ft` : "Not specified"}
Unit Types: ${project.unitTypes && (project.unitTypes as any[]).length > 0 ? (project.unitTypes as any[]).map((u: any) => u.type).join(", ") : "Not specified"}
Amenities: ${project.amenities && (project.amenities as string[]).length > 0 ? (project.amenities as string[]).join(", ") : "None listed"}
Possession Date: ${project.possessionDate ?? "Not specified"}
Scores: Value ${project.valueScore ?? "N/A"}/100, Location ${project.locationScore ?? "N/A"}/100, Trust ${project.trustScore ?? "N/A"}/100, Overall ${project.overallScore ?? "N/A"}/100

Return ONLY a JSON object with these three fields (no markdown, no extra text):
{
  "summary": "A 2-3 sentence summary of the project for AI tools and potential buyers",
  "investmentAngle": "1-2 sentences on the investment opportunity and potential returns",
  "idealBuyerPersona": "1-2 sentences describing the ideal buyer for this project"
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_completion_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const rawContent = completion.choices[0]?.message?.content ?? "{}";
  let parsed: { summary: string; investmentAngle: string; idealBuyerPersona: string };

  try {
    parsed = JSON.parse(rawContent);
  } catch {
    parsed = {
      summary: `${project.name} is a premium real estate development by ${project.developerName} located in ${project.location}.`,
      investmentAngle: "This project offers strong investment potential in a growing market.",
      idealBuyerPersona: "Ideal for mid to high income buyers seeking quality residential spaces.",
    };
  }

  await db.update(projectsTable).set({
    aiSummary: parsed.summary,
    investmentAngle: parsed.investmentAngle,
    idealBuyerPersona: parsed.idealBuyerPersona,
    updatedAt: new Date(),
  }).where(and(eq(projectsTable.id, parseResult.data.id), eq(projectsTable.userId, req.session.userId!)));

  await logActivity(project.id, project.name, "AI summary generated");
  res.json(parsed);
});

// Get scorecard — ownership required
router.get("/projects/:id/scorecard", requireAuth, async (req, res) => {
  const parseResult = GetProjectScorecardParams.safeParse({ id: parseInt(req.params.id) });
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [project] = await db.select().from(projectsTable).where(
    and(eq(projectsTable.id, parseResult.data.id), eq(projectsTable.userId, req.session.userId!))
  );
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const valueScore = parseFloat(project.valueScore ?? "50");
  const locationScore = parseFloat(project.locationScore ?? "50");
  const trustScore = parseFloat(project.trustScore ?? "50");
  const overallScore = parseFloat(project.overallScore ?? "50");

  const pricePerSqft = project.priceMin && project.carpetAreaMin
    ? parseFloat(project.priceMin) / parseFloat(project.carpetAreaMin)
    : null;

  res.json({
    projectId: project.id,
    valueScore,
    locationScore,
    trustScore,
    overallScore,
    breakdown: {
      valueExplanation: pricePerSqft
        ? `Price per sq ft: ₹${Math.round(pricePerSqft).toLocaleString("en-IN")} — ${valueScore >= 75 ? "Excellent value" : valueScore >= 60 ? "Good value" : valueScore >= 45 ? "Fair value" : "Premium pricing"} relative to market benchmarks`
        : "Insufficient price or area data to compute value score",
      locationExplanation: `Location score of ${locationScore}/100 — ${locationScore >= 80 ? "Prime location with excellent connectivity" : locationScore >= 60 ? "Good location with decent infrastructure" : locationScore >= 40 ? "Developing area with growth potential" : "Emerging location — verify amenities and connectivity"}`,
      trustExplanation: `Trust score of ${trustScore}/100 — ${trustScore >= 80 ? "Highly reputable developer with strong track record" : trustScore >= 60 ? "Established developer with reasonable project history" : trustScore >= 40 ? "Developer with moderate track record" : "Limited verifiable information available"}`,
    },
  });
});

// Recalculate scores — ownership required
router.post("/projects/:id/recalculate-scores", requireAuth, async (req, res) => {
  const parseResult = RecalculateScoresParams.safeParse({ id: parseInt(req.params.id) });
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [project] = await db.select().from(projectsTable).where(
    and(eq(projectsTable.id, parseResult.data.id), eq(projectsTable.userId, req.session.userId!))
  );
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const locationScore = parseFloat(project.locationScore ?? "50");
  const trustScore = parseFloat(project.trustScore ?? "50");
  const valueScore = calcValueScore(project.priceMin, project.priceMax, project.carpetAreaMin, project.carpetAreaMax);
  const overallScore = calcOverallScore(valueScore, locationScore, trustScore);

  await db.update(projectsTable).set({
    valueScore: valueScore.toString(),
    overallScore: overallScore.toString(),
    updatedAt: new Date(),
  }).where(and(eq(projectsTable.id, parseResult.data.id), eq(projectsTable.userId, req.session.userId!)));

  const pricePerSqft = project.priceMin && project.carpetAreaMin
    ? parseFloat(project.priceMin) / parseFloat(project.carpetAreaMin)
    : null;

  res.json({
    projectId: project.id,
    valueScore,
    locationScore,
    trustScore,
    overallScore,
    breakdown: {
      valueExplanation: pricePerSqft
        ? `Price per sq ft: ₹${Math.round(pricePerSqft).toLocaleString("en-IN")} — ${valueScore >= 75 ? "Excellent value" : valueScore >= 60 ? "Good value" : valueScore >= 45 ? "Fair value" : "Premium pricing"}`
        : "Insufficient data to compute value score",
      locationExplanation: `Location score: ${locationScore}/100`,
      trustExplanation: `Trust score: ${trustScore}/100`,
    },
  });
});

// Get API endpoint info — ownership required
router.get("/projects/:id/api-endpoint", requireAuth, async (req, res) => {
  const parseResult = GetProjectApiEndpointParams.safeParse({ id: parseInt(req.params.id) });
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [project] = await db.select().from(projectsTable).where(
    and(eq(projectsTable.id, parseResult.data.id), eq(projectsTable.userId, req.session.userId!))
  );
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const domain = process.env.REPLIT_DOMAINS?.split(",")[0] ?? "localhost:80";
  const protocol = domain.includes("localhost") ? "http" : "https";
  const endpointUrl = `${protocol}://${domain}/api/public/projects/${project.id}`;

  res.json({
    projectId: project.id,
    endpointUrl,
    callCount: project.apiCallCount,
    sampleResponse: {
      id: project.id,
      name: project.name,
      developerName: project.developerName,
      location: project.location,
      priceRange: { min: project.priceMin, max: project.priceMax },
      scorecard: {
        overallScore: project.overallScore,
        valueScore: project.valueScore,
        locationScore: project.locationScore,
        trustScore: project.trustScore,
      },
    },
  });
});

// Public AI-ready endpoint — open, no auth
router.get("/public/projects/:id", async (req, res) => {
  const parseResult = GetPublicProjectParams.safeParse({ id: parseInt(req.params.id) });
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, parseResult.data.id));
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  await db.update(projectsTable).set({
    apiCallCount: project.apiCallCount + 1,
  }).where(eq(projectsTable.id, parseResult.data.id));

  const valueScore = parseFloat(project.valueScore ?? "50");
  const locationScore = parseFloat(project.locationScore ?? "50");
  const trustScore = parseFloat(project.trustScore ?? "50");
  const overallScore = parseFloat(project.overallScore ?? "50");

  res.json({
    id: project.id,
    name: project.name,
    developerName: project.developerName,
    location: project.location,
    priceRange: {
      min: project.priceMin ? parseFloat(project.priceMin) : 0,
      max: project.priceMax ? parseFloat(project.priceMax) : 0,
    },
    carpetArea: {
      min: project.carpetAreaMin ? parseFloat(project.carpetAreaMin) : 0,
      max: project.carpetAreaMax ? parseFloat(project.carpetAreaMax) : 0,
    },
    unitTypes: project.unitTypes ?? [],
    amenities: project.amenities ?? [],
    possessionDate: project.possessionDate ?? "",
    scorecard: {
      projectId: project.id,
      valueScore,
      locationScore,
      trustScore,
      overallScore,
      breakdown: {
        valueExplanation: `Value score based on price-per-sqft analysis`,
        locationExplanation: `Location score: ${locationScore}/100`,
        trustExplanation: `Trust score: ${trustScore}/100`,
      },
    },
    aiSummary: project.aiSummary
      ? {
          summary: project.aiSummary,
          investmentAngle: project.investmentAngle ?? "",
          idealBuyerPersona: project.idealBuyerPersona ?? "",
        }
      : undefined,
    generatedAt: new Date().toISOString(),
  });
});

export default router;
