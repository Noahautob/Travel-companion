import { NextResponse } from "next/server";
import { readTrip, writeTrip, readPhoto, deletePhoto } from "@/lib/storage";

// Stream a photo's bytes. Middleware has already checked auth, so these bytes
// are only ever served to a logged-in session — the blob itself is private.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await readTrip();
  const meta = data.photos.find((p) => p.id === id);
  if (!meta) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await readPhoto(id);
  if (!buffer) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": meta.contentType || "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
    },
  });
}

// Delete a photo: remove the binary and its metadata together.
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deletePhoto(id);

  const data = await readTrip();
  data.photos = data.photos.filter((p) => p.id !== id);
  await writeTrip(data);

  return NextResponse.json(data);
}
