import { Router } from "express";
import { db, contentTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetContentParams, UpsertContentParams, UpsertContentBody } from "@workspace/api-zod";

const router = Router();

function mapContent(c: typeof contentTable.$inferSelect) {
  return {
    id: c.id,
    key: c.key,
    value: c.value,
    updated_at: c.updatedAt.toISOString(),
  };
}

router.get("/", async (_req, res) => {
  const all = await db.select().from(contentTable).orderBy(contentTable.key);
  res.json(all.map(mapContent));
});

router.get("/:key", async (req, res) => {
  const parsed = GetContentParams.safeParse({ key: req.params.key });
  if (!parsed.success) return res.status(400).json({ error: "Invalid key" });

  const [block] = await db.select().from(contentTable).where(eq(contentTable.key, parsed.data.key));
  if (!block) return res.status(404).json({ error: "Not found" });
  res.json(mapContent(block));
});

router.put("/:key", async (req, res) => {
  const paramParsed = UpsertContentParams.safeParse({ key: req.params.key });
  if (!paramParsed.success) return res.status(400).json({ error: "Invalid key" });

  const bodyParsed = UpsertContentBody.safeParse(req.body);
  if (!bodyParsed.success) return res.status(400).json({ error: bodyParsed.error.message });

  const [existing] = await db.select().from(contentTable).where(eq(contentTable.key, paramParsed.data.key));

  if (existing) {
    const [updated] = await db
      .update(contentTable)
      .set({ value: bodyParsed.data.value })
      .where(eq(contentTable.key, paramParsed.data.key))
      .returning();
    return res.json(mapContent(updated));
  } else {
    const [created] = await db
      .insert(contentTable)
      .values({ key: paramParsed.data.key, value: bodyParsed.data.value })
      .returning();
    return res.json(mapContent(created));
  }
});

export default router;
