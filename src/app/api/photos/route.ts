import { NextResponse } from "next/server";
import { readTrip, writeTrip, savePhoto } from "@/lib/storage";
import type { Photo } from "@/lib/types";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB per photo

// Upload a photo: multipart form with `file`, and optional `caption`, `city`.
export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  const caption = String(form.get("caption") ?? "");
  const city = String(form.get("city") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large (max 15 MB)" },
      { status: 413 },
    );
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only images are allowed" },
      { status: 415 },
    );
  }

  const id = crypto.randomUUID();
  const buffer = Buffer.from(await file.arrayBuffer());
  await savePhoto(id, buffer, file.type);

  const meta: Photo = {
    id,
    caption,
    city,
    filename: file.name,
    contentType: file.type,
    size: file.size,
    createdAt: new Date().toISOString(),
  };

  const data = await readTrip();
  data.photos.push(meta);
  await writeTrip(data);

  return NextResponse.json(data);
}
