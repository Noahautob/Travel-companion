// Storage abstraction with two backends, chosen automatically:
//   - Vercel Blob (private) when BLOB_READ_WRITE_TOKEN is set (production)
//   - Local filesystem under ./.data (local development)
//
// The whole trip is one JSON document. Photo binaries are stored separately,
// keyed by their id; their metadata lives inside the JSON document.

import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { put, get, del } from "@vercel/blob";
import { emptyTrip, type TripData } from "./types";

const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const DATA_PATH = "trip/data.json";
const photoPath = (id: string) => `trip/photos/${id}`;

// --- Local filesystem paths (dev only) ---
const localDir = path.join(process.cwd(), ".data");
const localDataFile = path.join(localDir, "data.json");
const localPhotoDir = path.join(localDir, "photos");
const localPhotoFile = (id: string) => path.join(localPhotoDir, id);

async function ensureLocalDirs() {
  await fs.mkdir(localPhotoDir, { recursive: true });
}

// --- Trip JSON document ---

export async function readTrip(): Promise<TripData> {
  if (useBlob) {
    try {
      const res = await get(DATA_PATH, { access: "private", useCache: false });
      if (!res) return emptyTrip();
      const text = await new Response(res.stream).text();
      return JSON.parse(text) as TripData;
    } catch {
      return emptyTrip();
    }
  }

  try {
    const text = await fs.readFile(localDataFile, "utf8");
    return JSON.parse(text) as TripData;
  } catch {
    return emptyTrip();
  }
}

export async function writeTrip(data: TripData): Promise<void> {
  data.trip.updatedAt = new Date().toISOString();
  const body = JSON.stringify(data, null, 2);

  if (useBlob) {
    await put(DATA_PATH, body, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  await ensureLocalDirs();
  await fs.writeFile(localDataFile, body, "utf8");
}

// --- Photo binaries ---

export async function savePhoto(
  id: string,
  data: Buffer,
  contentType: string,
): Promise<void> {
  if (useBlob) {
    await put(photoPath(id), data, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
    });
    return;
  }

  await ensureLocalDirs();
  await fs.writeFile(localPhotoFile(id), data);
}

export async function readPhoto(id: string): Promise<Buffer | null> {
  if (useBlob) {
    try {
      const res = await get(photoPath(id), {
        access: "private",
        useCache: false,
      });
      if (!res) return null;
      return Buffer.from(await new Response(res.stream).arrayBuffer());
    } catch {
      return null;
    }
  }

  try {
    return await fs.readFile(localPhotoFile(id));
  } catch {
    return null;
  }
}

export async function deletePhoto(id: string): Promise<void> {
  if (useBlob) {
    try {
      await del(photoPath(id));
    } catch {
      // already gone — fine
    }
    return;
  }

  try {
    await fs.unlink(localPhotoFile(id));
  } catch {
    // already gone — fine
  }
}
