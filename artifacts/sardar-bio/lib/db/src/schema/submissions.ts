import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contactSubmissionsTable = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissionsTable).omit({ id: true, createdAt: true });
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissionsTable.$inferSelect;

export const dealershipSubmissionsTable = pgTable("dealership_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  firmName: text("firm_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  gstNumber: text("gst_number").notNull(),
  areaPincode: text("area_pincode").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDealershipSubmissionSchema = createInsertSchema(dealershipSubmissionsTable).omit({ id: true, createdAt: true });
export type InsertDealershipSubmission = z.infer<typeof insertDealershipSubmissionSchema>;
export type DealershipSubmission = typeof dealershipSubmissionsTable.$inferSelect;
