"use client";

import { useRef, useState } from "react";
import { Modal, EmptyState } from "./ui";
import type { Photo, TripData } from "@/lib/types";

export function PhotosPanel({
  photos,
  onData,
}: {
  photos: Photo[];
  onData: (data: TripData) => void;
}) {
  const [caption, setCaption] = useState("");
  const [city, setCity] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList) {
    setError("");
    setUploading(true);
    try {
      let latest: TripData | null = null;
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("caption", caption);
        fd.append("city", city);
        const res = await fetch("/api/photos", { method: "POST", body: fd });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || "Upload failed");
        }
        latest = await res.json();
      }
      if (latest) onData(latest);
      setCaption("");
      setCity("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this photo?")) return;
    const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });
    if (res.ok) {
      onData(await res.json());
      setLightbox(null);
    }
  }

  const inputClass =
    "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]";

  return (
    <div className="space-y-5">
      <div
        className="rounded-2xl border p-4"
        style={{ background: "var(--surface)", boxShadow: "var(--shadow)" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className={inputClass}
            style={{ background: "var(--surface-2)" }}
            placeholder="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <input
            className={inputClass}
            style={{ background: "var(--surface-2)" }}
            placeholder="City (optional)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && upload(e.target.files)}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
            style={{ background: "var(--accent)" }}
          >
            {uploading ? "Uploading…" : "📷 Upload photos"}
          </button>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Caption &amp; city apply to this batch. Max 15&nbsp;MB each.
          </span>
        </div>
        {error && (
          <p className="mt-2 text-sm" style={{ color: "var(--red)" }}>
            {error}
          </p>
        )}
      </div>

      {photos.length === 0 ? (
        <EmptyState
          icon="🖼️"
          title="No photos yet"
          hint="Booking screenshots, room shots, that view — drop them in above."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos
            .slice()
            .reverse()
            .map((p) => (
              <button
                key={p.id}
                onClick={() => setLightbox(p)}
                className="group relative overflow-hidden rounded-xl border text-left"
                style={{ background: "var(--surface)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/photos/${p.id}`}
                  alt={p.caption || p.filename}
                  className="aspect-square w-full object-cover transition group-hover:scale-[1.03]"
                  loading="lazy"
                />
                {(p.caption || p.city) && (
                  <div className="px-2.5 py-1.5">
                    {p.caption && (
                      <p className="truncate text-xs font-medium">{p.caption}</p>
                    )}
                    {p.city && (
                      <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
                        {p.city}
                      </p>
                    )}
                  </div>
                )}
              </button>
            ))}
        </div>
      )}

      <Modal
        open={!!lightbox}
        onClose={() => setLightbox(null)}
        title={lightbox?.caption || lightbox?.filename || "Photo"}
      >
        {lightbox && (
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/photos/${lightbox.id}`}
              alt={lightbox.caption || lightbox.filename}
              className="w-full rounded-lg"
            />
            {lightbox.city && (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                📍 {lightbox.city}
              </p>
            )}
            <button
              onClick={() => remove(lightbox.id)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium"
              style={{ color: "var(--red)", background: "var(--surface-2)" }}
            >
              Delete photo
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
