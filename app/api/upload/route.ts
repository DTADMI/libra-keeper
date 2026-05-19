// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { storageClient } from "@/lib/adapters/storage";
import { getServerAuth } from "@/lib/auth-utils";
import { logger } from "@/lib/logger";
import { withProtection } from "@/lib/security/protection";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const uploadBodySchema = z.object({
  file: z.instanceof(File, { message: "A file is required" }).refine(
    (f) => f.type.startsWith("image/"),
    { message: "Only image files are allowed (image/*)" },
  ).refine(
    (f) => f.size <= MAX_FILE_SIZE,
    { message: "File size must be less than 5MB" },
  ),
});

async function _POST(req: Request) {
  try {
    const session = await getServerAuth();
    if (!session?.user) {return new NextResponse("Unauthorized", { status: 401 });}

    const formData = await req.formData();
    const file = formData.get("file");

    const { file: validatedFile } = uploadBodySchema.parse({ file });

    const buffer = Buffer.from(await validatedFile.arrayBuffer());
    const fileName = `${Date.now()}-${validatedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const path = `items/${fileName}`;

    const result = await storageClient.upload("media", path, buffer, validatedFile.type);
    if (!result.success) {
      logger.error("Upload failed:", result.error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const publicUrl = storageClient.getPublicUrl("media", path);
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }
    logger.error("Upload error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export const POST = withProtection(_POST, { scope: "write", limit: 20, windowSeconds: 60 });
