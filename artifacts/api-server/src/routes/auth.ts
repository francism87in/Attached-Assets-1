import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  company: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/auth/register
router.post("/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", issues: parsed.error.issues });
    return;
  }

  const { name, email, password, company } = parsed.data;

  try {
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(usersTable).values({
      name,
      email,
      passwordHash,
      company: company ?? null,
      role: "developer",
    }).returning();

    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userName = user.name;
    req.session.userRole = user.role;

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
    });
  } catch (err) {
    req.log.error(err, "Failed to register user");
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid credentials format" });
    return;
  }

  const { email, password } = parsed.data;

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userName = user.name;
    req.session.userRole = user.role;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
    });
  } catch (err) {
    req.log.error(err, "Failed to login user");
    res.status(500).json({ error: "Login failed" });
  }
});

// PATCH /api/auth/profile
router.patch("/auth/profile", requireAuth, async (req, res) => {
  const schema = z.object({
    name: z.string().min(2).optional(),
    company: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data" });
    return;
  }
  const { name, company } = parsed.data;
  try {
    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (company !== undefined) updateData.company = company || null;

    const [updated] = await db.update(usersTable).set(updateData)
      .where(eq(usersTable.id, req.session.userId!)).returning();

    if (name) req.session.userName = updated.name;

    res.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      company: updated.company,
    });
  } catch (err) {
    req.log.error(err, "Failed to update profile");
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// PATCH /api/auth/password
router.patch("/auth/password", requireAuth, async (req, res) => {
  const schema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data" });
    return;
  }
  const { currentPassword, newPassword } = parsed.data;
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId!)).limit(1);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.update(usersTable).set({ passwordHash, updatedAt: new Date() })
      .where(eq(usersTable.id, req.session.userId!));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err, "Failed to change password");
    res.status(500).json({ error: "Failed to change password" });
  }
});

// POST /api/auth/logout
router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// GET /api/auth/me
router.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const [user] = await db.select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
      company: usersTable.company,
      createdAt: usersTable.createdAt,
    }).from(usersTable).where(eq(usersTable.id, req.session.userId!)).limit(1);

    if (!user) {
      req.session.destroy(() => {});
      res.status(401).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    req.log.error(err, "Failed to fetch current user");
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
