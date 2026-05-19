// src/app/api/upload/route.ts
import { NextResponse } from "next/server";

import { storageClient } from "@/lib/adapters/storage";
import { getServerAuth } from "@/lib/auth-utils";
import { logger } from "@/lib/logger";
import { withProtection } from "@/lib/security/protection";

async function _POST(req: Request) {
  try {
    const session = await getServerAuth();
    if (!session?.user) {return new NextResponse("Unauthorized", { status: 401 });}

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {return NextResponse.json({ error: "No file provided" }, { status: 400 });}

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const path = `items/${fileName}`;

    const result = await storageClient.upload("media", path, buffer, file.type);
    if (!result.success) {
      logger.error("Upload failed:", result.error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const publicUrl = storageClient.getPublicUrl("media", path);
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    logger.error("Upload error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export const POST = withProtection(_POST, { scope: "write", limit: 20, windowSeconds: 60 });
