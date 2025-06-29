import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Clients table
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  email: text("email").notNull(),
  industry: text("industry").notNull(),
  targetAudience: text("target_audience").notNull(),
  brandVoice: text("brand_voice").notNull(),
  communicationStyle: text("communication_style").notNull(),
  keyValues: text("key_values").notNull(),
  painPoints: text("pain_points").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Products/Services table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: text("price"),
  benefits: text("benefits").notNull(),
  features: text("features").notNull(),
  targetMarket: text("target_market").notNull(),
  competitorAdvantage: text("competitor_advantage"),
  productUrl: text("product_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Copywriters table
export const copywriters = pgTable("copywriters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  style: text("style").notNull(),
  description: text("description").notNull(),
  techniques: text("techniques").notNull(),
  bestFor: text("best_for").notNull(),
  tone: text("tone").notNull(),
  approach: text("approach").notNull(),
  examples: text("examples"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const clientsRelations = relations(clients, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  client: one(clients, {
    fields: [products.clientId],
    references: [clients.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertCopywriterSchema = createInsertSchema(copywriters).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Copywriter = typeof copywriters.$inferSelect;
export type InsertCopywriter = z.infer<typeof insertCopywriterSchema>;

// Email generation schemas
export const emailGenerationSchema = z.object({
  emailType: z.string().min(1, "Tipo de email es requerido"),
  clientTone: z.string().min(1, "Tono del mensaje es requerido"),
  productName: z.string().min(1, "Nombre del producto es requerido"),
  productDescription: z.string().min(1, "Descripción del producto es requerida"),
  productLink: z.string().url("Link del producto debe ser una URL válida"),
  targetAudience: z.string().min(1, "Público objetivo es requerido"),
  copywriterProfile: z.string().optional(),
  elementsToAvoid: z.string().optional(),
  includePreheader: z.boolean().default(false),
  aiProvider: z.string().default("gemini"),
});

export type EmailGenerationRequest = z.infer<typeof emailGenerationSchema>;

export const emailResponseSchema = z.object({
  subject: z.string(),
  preheader: z.string().optional(),
  body: z.string(),
  wordCount: z.number(),
  readingTime: z.string(),
  conversionScore: z.number(),
});

export type EmailResponse = z.infer<typeof emailResponseSchema>;
