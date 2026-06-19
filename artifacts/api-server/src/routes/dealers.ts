import { Router } from "express";
import { db, dealersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  LocateDealersQueryParams,
  CreateDealerBody,
  UpdateDealerParams,
  UpdateDealerBody,
  DeleteDealerParams,
} from "@workspace/api-zod";

const router = Router();

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mapDealer(d: typeof dealersTable.$inferSelect) {
  return {
    id: d.id,
    firm_name: d.firmName,
    contact: d.contact,
    address: d.address,
    email: d.email,
    pincode: d.pincode,
    lat: d.lat,
    lng: d.lng,
    map_link: d.mapLink,
    created_at: d.createdAt.toISOString(),
  };
}

// Pincode → lat/lng lookup (sample Indian pincodes)
const PINCODE_COORDS: Record<string, [number, number]> = {
  "380001": [23.0225, 72.5714],
  "380006": [23.0395, 72.5481],
  "380009": [23.0474, 72.5520],
  "380015": [23.0009, 72.5359],
  "380058": [23.0625, 72.5082],
  "382010": [23.0308, 72.6022],
  "382325": [23.1167, 72.6333],
  "382424": [22.9925, 72.5999],
  "360001": [22.3039, 70.8022],
  "360002": [22.2976, 70.8150],
  "362001": [21.5222, 70.4579],
  "363001": [22.7196, 71.1854],
  "364001": [21.7645, 72.1519],
  "365601": [21.3350, 71.1820],
  "370001": [23.2420, 69.6669],
  "370201": [22.9667, 69.8500],
  "396001": [20.5992, 72.9342],
  "394001": [21.1702, 72.8311],
  "392001": [21.7051, 73.0050],
  "390001": [22.3072, 73.1812],
  "390002": [22.3119, 73.1723],
  "390007": [22.2768, 73.2054],
};

router.get("/locate", async (req, res) => {
  const parsed = LocateDealersQueryParams.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "pincode is required" });

  const pincode = parsed.data.pincode.trim();
  const coords = PINCODE_COORDS[pincode];

  if (!coords) {
    return res.status(404).json({ error: "Pincode not found in our coverage area" });
  }

  const [userLat, userLng] = coords;
  const all = await db.select().from(dealersTable);

  const withDist = all
    .map((d) => ({
      ...mapDealer(d),
      distance_km: Math.round(haversineKm(userLat, userLng, d.lat, d.lng) * 10) / 10,
    }))
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, 5);

  res.json(withDist);
});

router.get("/", async (_req, res) => {
  const dealers = await db.select().from(dealersTable).orderBy(dealersTable.firmName);
  res.json(dealers.map(mapDealer));
});

router.post("/", async (req, res) => {
  const parsed = CreateDealerBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const d = parsed.data;
  const [created] = await db
    .insert(dealersTable)
    .values({
      firmName: d.firm_name,
      contact: d.contact,
      address: d.address,
      email: d.email ?? null,
      pincode: d.pincode,
      lat: d.lat,
      lng: d.lng,
      mapLink: d.map_link ?? null,
    })
    .returning();

  res.status(201).json(mapDealer(created));
});

router.put("/:id", async (req, res) => {
  const paramParsed = UpdateDealerParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) return res.status(400).json({ error: "Invalid id" });

  const bodyParsed = UpdateDealerBody.safeParse(req.body);
  if (!bodyParsed.success) return res.status(400).json({ error: bodyParsed.error.message });

  const d = bodyParsed.data;
  const [updated] = await db
    .update(dealersTable)
    .set({
      firmName: d.firm_name,
      contact: d.contact,
      address: d.address,
      email: d.email ?? null,
      pincode: d.pincode,
      lat: d.lat,
      lng: d.lng,
      mapLink: d.map_link ?? null,
    })
    .where(eq(dealersTable.id, paramParsed.data.id))
    .returning();

  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(mapDealer(updated));
});

router.delete("/:id", async (req, res) => {
  const parsed = DeleteDealerParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });

  await db.delete(dealersTable).where(eq(dealersTable.id, parsed.data.id));
  res.json({ success: true });
});

export default router;
