import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  ListProductsQueryParams,
  CreateProductBody,
  GetProductParams,
  UpdateProductParams,
  UpdateProductBody,
  DeleteProductParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  const filters = parsed.success ? parsed.data : {};

  let query = db.select().from(productsTable).$dynamic();

  if (filters.featured !== undefined) {
    query = query.where(eq(productsTable.featured, filters.featured));
  }
  if (filters.form) {
    query = query.where(eq(productsTable.form, filters.form));
  }
  if (filters.category) {
    query = query.where(eq(productsTable.category, filters.category));
  }

  const products = await query.orderBy(productsTable.createdAt);
  res.json(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      content: p.content,
      benefits: p.benefits,
      application_method: p.applicationMethod,
      things_to_know: p.thingsToKnow,
      available_packaging: p.availablePackaging,
      category: p.category,
      form: p.form,
      featured: p.featured,
      images: p.images,
      created_at: p.createdAt.toISOString(),
    }))
  );
});

router.get("/stats/summary", async (_req, res) => {
  const [total] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable);
  const [featured] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(productsTable)
    .where(eq(productsTable.featured, true));

  const byCategory = await db
    .select({ label: productsTable.category, count: sql<number>`count(*)::int` })
    .from(productsTable)
    .groupBy(productsTable.category);

  const byForm = await db
    .select({ label: productsTable.form, count: sql<number>`count(*)::int` })
    .from(productsTable)
    .groupBy(productsTable.form);

  res.json({
    total: total.count,
    featured: featured.count,
    by_category: byCategory,
    by_form: byForm,
  });
});

router.get("/:id", async (req, res) => {
  const parsed = GetProductParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, parsed.data.id));
  if (!product) return res.status(404).json({ error: "Not found" });

  res.json({
    id: product.id,
    name: product.name,
    description: product.description,
    content: product.content,
    benefits: product.benefits,
    application_method: product.applicationMethod,
    things_to_know: product.thingsToKnow,
    available_packaging: product.availablePackaging,
    category: product.category,
    form: product.form,
    featured: product.featured,
    images: product.images,
    created_at: product.createdAt.toISOString(),
  });
});

router.post("/", async (req, res) => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const d = parsed.data;
  const [created] = await db
    .insert(productsTable)
    .values({
      name: d.name,
      description: d.description,
      content: d.content ?? null,
      benefits: d.benefits ?? null,
      applicationMethod: d.application_method ?? null,
      thingsToKnow: d.things_to_know ?? null,
      availablePackaging: d.available_packaging ?? null,
      category: d.category,
      form: d.form,
      featured: d.featured ?? false,
      images: d.images ?? [],
    })
    .returning();

  res.status(201).json({
    id: created.id,
    name: created.name,
    description: created.description,
    content: created.content,
    benefits: created.benefits,
    application_method: created.applicationMethod,
    things_to_know: created.thingsToKnow,
    available_packaging: created.availablePackaging,
    category: created.category,
    form: created.form,
    featured: created.featured,
    images: created.images,
    created_at: created.createdAt.toISOString(),
  });
});

router.put("/:id", async (req, res) => {
  const paramParsed = UpdateProductParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) return res.status(400).json({ error: "Invalid id" });

  const bodyParsed = UpdateProductBody.safeParse(req.body);
  if (!bodyParsed.success) return res.status(400).json({ error: bodyParsed.error.message });

  const d = bodyParsed.data;
  const [updated] = await db
    .update(productsTable)
    .set({
      name: d.name,
      description: d.description,
      content: d.content ?? null,
      benefits: d.benefits ?? null,
      applicationMethod: d.application_method ?? null,
      thingsToKnow: d.things_to_know ?? null,
      availablePackaging: d.available_packaging ?? null,
      category: d.category,
      form: d.form,
      featured: d.featured ?? false,
      images: d.images ?? [],
    })
    .where(eq(productsTable.id, paramParsed.data.id))
    .returning();

  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json({
    id: updated.id,
    name: updated.name,
    description: updated.description,
    content: updated.content,
    benefits: updated.benefits,
    application_method: updated.applicationMethod,
    things_to_know: updated.thingsToKnow,
    available_packaging: updated.availablePackaging,
    category: updated.category,
    form: updated.form,
    featured: updated.featured,
    images: updated.images,
    created_at: updated.createdAt.toISOString(),
  });
});

router.delete("/:id", async (req, res) => {
  const parsed = DeleteProductParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });

  await db.delete(productsTable).where(eq(productsTable.id, parsed.data.id));
  res.json({ success: true });
});

export default router;
