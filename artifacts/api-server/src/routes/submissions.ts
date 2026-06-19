import { Router } from "express";
import { db, contactSubmissionsTable, dealershipSubmissionsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { CreateContactSubmissionBody, CreateDealershipSubmissionBody } from "@workspace/api-zod";

const router = Router();

function mapContact(s: typeof contactSubmissionsTable.$inferSelect) {
  return {
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone,
    subject: s.subject,
    message: s.message,
    created_at: s.createdAt.toISOString(),
  };
}

function mapDealership(s: typeof dealershipSubmissionsTable.$inferSelect) {
  return {
    id: s.id,
    name: s.name,
    firm_name: s.firmName,
    email: s.email,
    phone: s.phone,
    gst_number: s.gstNumber,
    area_pincode: s.areaPincode,
    subject: s.subject,
    message: s.message,
    created_at: s.createdAt.toISOString(),
  };
}

router.get("/stats", async (_req, res) => {
  const [contactTotal] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(contactSubmissionsTable);
  const [dealershipTotal] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(dealershipSubmissionsTable);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [recentContact] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(contactSubmissionsTable)
    .where(sql`${contactSubmissionsTable.createdAt} >= ${sevenDaysAgo}`);
  const [recentDealership] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(dealershipSubmissionsTable)
    .where(sql`${dealershipSubmissionsTable.createdAt} >= ${sevenDaysAgo}`);

  res.json({
    contact_total: contactTotal.count,
    dealership_total: dealershipTotal.count,
    recent_contact: recentContact.count,
    recent_dealership: recentDealership.count,
  });
});

router.get("/contact", async (_req, res) => {
  const all = await db
    .select()
    .from(contactSubmissionsTable)
    .orderBy(sql`${contactSubmissionsTable.createdAt} desc`);
  res.json(all.map(mapContact));
});

router.post("/contact", async (req, res) => {
  const parsed = CreateContactSubmissionBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const [created] = await db
    .insert(contactSubmissionsTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(mapContact(created));
});

router.get("/dealership", async (_req, res) => {
  const all = await db
    .select()
    .from(dealershipSubmissionsTable)
    .orderBy(sql`${dealershipSubmissionsTable.createdAt} desc`);
  res.json(all.map(mapDealership));
});

router.post("/dealership", async (req, res) => {
  const parsed = CreateDealershipSubmissionBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const d = parsed.data;
  const [created] = await db
    .insert(dealershipSubmissionsTable)
    .values({
      name: d.name,
      firmName: d.firm_name,
      email: d.email,
      phone: d.phone,
      gstNumber: d.gst_number,
      areaPincode: d.area_pincode,
      subject: d.subject,
      message: d.message,
    })
    .returning();

  res.status(201).json(mapDealership(created));
});

export default router;
