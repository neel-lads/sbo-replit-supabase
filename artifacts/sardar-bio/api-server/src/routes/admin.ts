import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import { AdminLoginBody, GetUploadUrlBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

function getAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Middleware: verify Supabase JWT
async function requireAuth(req: any, res: any, next: any) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = auth.slice(7);
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: "Invalid token" });
    req.user = data.user;
    next();
  } catch (err) {
    logger.error({ err }, "Auth error");
    res.status(401).json({ error: "Unauthorized" });
  }
}

router.post("/login", async (req, res) => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.session) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({
    access_token: data.session.access_token,
    user: { id: data.user!.id, email: data.user!.email! },
  });
});

router.post("/logout", requireAuth, async (req: any, res) => {
  const auth = req.headers.authorization!;
  const token = auth.slice(7);
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  await supabase.auth.admin.signOut(token);
  res.json({ success: true });
});

router.get("/me", requireAuth, async (req: any, res) => {
  res.json({ id: req.user.id, email: req.user.email });
});

router.post("/upload-url", requireAuth, async (req, res) => {
  const parsed = GetUploadUrlBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const { filename, content_type } = parsed.data;
  const adminClient = getAdminClient();

  const bucket = "product-images";
  const path = `products/${Date.now()}-${filename}`;

  const { data, error } = await adminClient.storage
    .from(bucket)
    .createSignedUploadUrl(path);

  if (error) {
    logger.error({ error }, "Failed to create signed URL");
    return res.status(500).json({ error: "Failed to generate upload URL" });
  }

  const publicUrl = adminClient.storage.from(bucket).getPublicUrl(path).data.publicUrl;

  res.json({
    upload_url: data.signedUrl,
    public_url: publicUrl,
  });
});

export { requireAuth };
export default router;
