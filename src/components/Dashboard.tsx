"use client";

import { useEffect, useMemo, useState } from "react";
import { SCHEMA } from "@/lib/schema";
import { fmtDateLong } from "@/lib/format";
import type { Collection, TripData } from "@/lib/types";
import { emptyTrip } from "@/lib/types";
import { RecordCard } from "./RecordCard";
import { EntityForm } from "./EntityForm";
import { Timeline } from "./Timeline";
import { PhotosPanel } from "./PhotosPanel";
import { Modal, EmptyState } from "./ui";

type TabKey = Collection | "timeline";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "timeline", label: "Timeline", icon: "🗺️" },
  { key: "flights", label: "Flights", icon: "✈️" },
  { key: "stays", label: "Stays", icon: "📍" },
  { key: "lodging", label: "Lodging", icon: "🛏️" },
  { key: "recommendations", label: "Recs", icon: "⭐" },
  { key: "photos", label: "Photos", icon: "📷" },
];

function groupByCity(items: Record<string, unknown>[]) {
  const groups = new Map<string, Record<string, unknown>[]>();
  for (const it of items) {
    const city = String(it.city || "Unsorted");
    if (!groups.has(city)) groups.set(city, []);
    groups.get(city)!.push(it);
  }
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

export function Dashboard() {
  const [data, setData] = useState<TripData>(emptyTrip());
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("timeline");
  const [adding, setAdding] = useState<Collection | null>(null);
  const [editing, setEditing] = useState<{
    collection: Collection;
    item: Record<string, unknown>;
  } | null>(null);
  const [tripModal, setTripModal] = useState(false);

  useEffect(() => {
    fetch("/api/data")
      .then((r) => r.json())
      .then((d: TripData) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function mutate(body: Record<string, unknown>) {
    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("mutation failed");
    setData(await res.json());
  }

  async function handleAdd(collection: Collection, values: Record<string, string>) {
    await mutate({ op: "add", collection, item: values });
    setAdding(null);
  }

  async function handleEdit(
    collection: Collection,
    values: Record<string, string>,
  ) {
    await mutate({
      op: "update",
      collection,
      item: { ...values, id: editing?.item.id },
    });
    setEditing(null);
  }

  async function handleDelete(collection: Collection, id: string) {
    if (!window.confirm("Delete this? Can't be undone.")) return;
    await mutate({ op: "delete", collection, id });
  }

  const counts = useMemo(
    () => ({
      timeline: data.stays.length + data.flights.length,
      flights: data.flights.length,
      stays: data.stays.length,
      lodging: data.lodging.length,
      recommendations: data.recommendations.length,
      photos: data.photos.length,
    }),
    [data],
  );

  function CollectionGrid({ collection }: { collection: Collection }) {
    const items = data[collection] as unknown as Record<string, unknown>[];
    const meta = SCHEMA[collection as Exclude<Collection, "photos">];

    if (items.length === 0) {
      return (
        <EmptyState
          icon={meta.icon}
          title={`No ${meta.label.toLowerCase()} yet`}
          hint={`Hit "${meta.addLabel}" to add your first one.`}
        />
      );
    }

    // Lodging and recs read best grouped by city; flights/stays as a flat grid.
    if (collection === "lodging" || collection === "recommendations") {
      return (
        <div className="space-y-6">
          {groupByCity(items).map(([city, group]) => (
            <div key={city}>
              <h3 className="mb-2 text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
                {city}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {group.map((it) => (
                  <RecordCard
                    key={String(it.id)}
                    collection={collection}
                    item={it}
                    onEdit={() => setEditing({ collection, item: it })}
                    onDelete={() => handleDelete(collection, String(it.id))}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {items.map((it) => (
          <RecordCard
            key={String(it.id)}
            collection={collection}
            item={it}
            onEdit={() => setEditing({ collection, item: it })}
            onDelete={() => handleDelete(collection, String(it.id))}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-6 sm:pt-10">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <button
              onClick={() => setTripModal(true)}
              className="group flex items-center gap-2 text-left"
            >
              <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                {data.trip.name}
              </h1>
              <span className="text-sm opacity-0 transition group-hover:opacity-60">
                ✎
              </span>
            </button>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {loading
                ? "Loading…"
                : `Updated ${fmtDateLong(data.trip.updatedAt.slice(0, 10))}`}
            </p>
          </div>
          <button
            onClick={async () => {
              await fetch("/api/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition hover:bg-[var(--surface-2)]"
            style={{ color: "var(--text-muted)" }}
          >
            Log out
          </button>
        </div>
        {data.trip.notes && (
          <p className="mt-3 whitespace-pre-wrap text-sm" style={{ color: "var(--text-muted)" }}>
            {data.trip.notes}
          </p>
        )}
      </header>

      {/* Tabs */}
      <div className="sticky top-0 z-10 -mx-4 mb-5 border-b px-4 py-2 backdrop-blur" style={{ background: "color-mix(in srgb, var(--bg) 85%, transparent)" }}>
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition"
                style={{
                  background: active ? "var(--accent)" : "transparent",
                  color: active ? "#fff" : "var(--text-muted)",
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {counts[t.key] > 0 && (
                  <span
                    className="rounded-full px-1.5 text-xs"
                    style={{
                      background: active
                        ? "rgba(255,255,255,0.2)"
                        : "var(--surface-2)",
                    }}
                  >
                    {counts[t.key]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add button (not on timeline/photos) */}
      {tab !== "timeline" && tab !== "photos" && (
        <div className="mb-4">
          <button
            onClick={() => setAdding(tab as Collection)}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition"
            style={{ background: "var(--accent)" }}
          >
            + {SCHEMA[tab as Exclude<Collection, "photos">].addLabel}
          </button>
        </div>
      )}

      {/* Panels */}
      {tab === "timeline" && (
        <Timeline
          data={data}
          onEdit={(collection, item) => setEditing({ collection, item })}
          onDelete={handleDelete}
        />
      )}
      {tab === "photos" && <PhotosPanel photos={data.photos} onData={setData} />}
      {tab !== "timeline" && tab !== "photos" && (
        <CollectionGrid collection={tab as Collection} />
      )}

      {/* Add modal */}
      <Modal
        open={adding !== null}
        onClose={() => setAdding(null)}
        title={adding ? SCHEMA[adding as Exclude<Collection, "photos">].addLabel : ""}
      >
        {adding && (
          <EntityForm
            fields={SCHEMA[adding as Exclude<Collection, "photos">].fields}
            submitLabel="Add"
            onSubmit={(values) => handleAdd(adding, values)}
            onCancel={() => setAdding(null)}
          />
        )}
      </Modal>

      {/* Edit modal */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={
          editing
            ? `Edit ${SCHEMA[editing.collection as Exclude<Collection, "photos">].singular}`
            : ""
        }
      >
        {editing && (
          <EntityForm
            fields={SCHEMA[editing.collection as Exclude<Collection, "photos">].fields}
            initial={editing.item}
            submitLabel="Save"
            onSubmit={(values) => handleEdit(editing.collection, values)}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Trip settings modal */}
      <Modal open={tripModal} onClose={() => setTripModal(false)} title="Trip details">
        <EntityForm
          fields={[
            { key: "name", label: "Trip name", type: "text", required: true },
            { key: "notes", label: "Notes", type: "textarea", placeholder: "Rough plan, who's coming, anything…" },
          ]}
          initial={{ name: data.trip.name, notes: data.trip.notes }}
          submitLabel="Save"
          onSubmit={async (values) => {
            await mutate({ op: "updateTrip", trip: values });
            setTripModal(false);
          }}
          onCancel={() => setTripModal(false)}
        />
      </Modal>
    </div>
  );
}
