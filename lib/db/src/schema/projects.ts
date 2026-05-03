import { pgTable, serial, text, numeric, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  developerName: text("developer_name").notNull(),
  location: text("location").notNull(),
  city: text("city"),
  state: text("state"),
  priceMin: numeric("price_min", { precision: 15, scale: 2 }),
  priceMax: numeric("price_max", { precision: 15, scale: 2 }),
  carpetAreaMin: numeric("carpet_area_min", { precision: 10, scale: 2 }),
  carpetAreaMax: numeric("carpet_area_max", { precision: 10, scale: 2 }),
  possessionDate: text("possession_date"),
  unitTypes: jsonb("unit_types").$type<Array<{
    type: string;
    count?: number;
    priceMin?: number;
    priceMax?: number;
    carpetAreaMin?: number;
    carpetAreaMax?: number;
  }>>().default([]),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  status: text("status", { enum: ["draft", "active", "archived"] }).notNull().default("draft"),
  valueScore: numeric("value_score", { precision: 5, scale: 2 }),
  locationScore: numeric("location_score", { precision: 5, scale: 2 }),
  trustScore: numeric("trust_score", { precision: 5, scale: 2 }),
  overallScore: numeric("overall_score", { precision: 5, scale: 2 }),
  aiSummary: text("ai_summary"),
  investmentAngle: text("investment_angle"),
  idealBuyerPersona: text("ideal_buyer_persona"),
  apiCallCount: integer("api_call_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  apiCallCount: true,
  overallScore: true,
  aiSummary: true,
  investmentAngle: true,
  idealBuyerPersona: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;
