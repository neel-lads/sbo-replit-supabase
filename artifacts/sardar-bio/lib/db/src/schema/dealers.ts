import { pgTable, text, serial, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const dealersTable = pgTable("dealers", {
  id: serial("id").primaryKey(),
  firmName: text("firm_name").notNull(),
  contact: text("contact").notNull(),
  address: text("address").notNull(),
  email: text("email"),
  pincode: text("pincode").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  mapLink: text("map_link"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDealerSchema = createInsertSchema(dealersTable).omit({ id: true, createdAt: true });
export type InsertDealer = z.infer<typeof insertDealerSchema>;
export type Dealer = typeof dealersTable.$inferSelect;
