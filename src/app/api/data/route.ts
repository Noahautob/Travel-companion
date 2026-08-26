import { NextResponse } from "next/server";
import { readTrip, writeTrip } from "@/lib/storage";
import type { Collection, TripData } from "@/lib/types";

export async function GET() {
  const data = await readTrip();
  return NextResponse.json(data);
}

type Mutation =
  | { op: "add"; collection: Collection; item: Record<string, unknown> }
  | { op: "update"; collection: Collection; item: Record<string, unknown> }
  | { op: "delete"; collection: Collection; id: string }
  | { op: "updateTrip"; trip: { name?: string; notes?: string } };

const COLLECTIONS: Collection[] = [
  "stays",
  "flights",
  "lodging",
  "recommendations",
  "photos",
];

function newId(): string {
  return crypto.randomUUID();
}

export async function POST(req: Request) {
  let body: Mutation;
  try {
    body = (await req.json()) as Mutation;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = await readTrip();

  if (body.op === "updateTrip") {
    if (typeof body.trip?.name === "string") data.trip.name = body.trip.name;
    if (typeof body.trip?.notes === "string") data.trip.notes = body.trip.notes;
    await writeTrip(data);
    return NextResponse.json(data);
  }

  if (!COLLECTIONS.includes(body.collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 400 });
  }

  // Note: photos are added/removed through /api/photos so their binary stays
  // in sync. This endpoint still allows updating photo captions.
  const list = data[body.collection] as unknown as Record<string, unknown>[];

  if (body.op === "add") {
    const item = {
      ...body.item,
      id: newId(),
      createdAt: new Date().toISOString(),
    };
    list.push(item);
    await writeTrip(data);
    return NextResponse.json(data);
  }

  if (body.op === "update") {
    const id = body.item?.id;
    const idx = list.findIndex((x) => x.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    list[idx] = { ...list[idx], ...body.item };
    await writeTrip(data);
    return NextResponse.json(data);
  }

  if (body.op === "delete") {
    const next = list.filter((x) => x.id !== body.id);
    (data[body.collection] as unknown[]) = next;
    await writeTrip(data);
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "Unknown op" }, { status: 400 });
}

export type { TripData };
