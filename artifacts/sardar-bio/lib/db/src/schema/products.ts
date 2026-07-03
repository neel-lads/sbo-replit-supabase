import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  benefits: text("benefits"),
  applicationMethod: text("application_method"),
  thingsToKnow: text("things_to_know"),
  availablePackaging: text("available_packaging"),
  category: text("category").notNull().default("bio-pesticide"),
  form: text("form").notNull().default("liquid"),
  featured: boolean("featured").notNull().default(false),
  images: text("images").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
