"use client";

import { RecordCard } from "./RecordCard";
import { EmptyState } from "./ui";
import { parseDate, fmtDate } from "@/lib/format";
import type { Collection, Flight, Stay, TripData } from "@/lib/types";

type Entry = {
  date: string;
  sort: number;
  collection: Collection;
  item: Record<string, unknown>;
};

export function Timeline({
  data,
  onEdit,
  onDelete,
}: {
  data: TripData;
  onEdit: (collection: Collection, item: Record<string, unknown>) => void;
  onDelete: (collection: Collection, id: string) => void;
}) {
  const entries: Entry[] = [];

  for (const s of data.stays) {
    const d = parseDate((s as Stay).startDate);
    entries.push({
      date: (s as Stay).startDate,
      sort: d ? d.getTime() : Number.MAX_SAFE_INTEGER,
      collection: "stays",
      item: s as unknown as Record<string, unknown>,
    });
  }
  for (const f of data.flights) {
    const d = parseDate((f as Flight).date);
    entries.push({
      date: (f as Flight).date,
      sort: d ? d.getTime() : Number.MAX_SAFE_INTEGER,
      collection: "flights",
      item: f as unknown as Record<string, unknown>,
    });
  }

  entries.sort((a, b) => a.sort - b.sort);

  if (entries.length === 0) {
    return (
      <EmptyState
        icon="🗺️"
        title="Your trip starts here"
        hint="Add a flight or a stay and it'll show up on this timeline in date order."
      />
    );
  }

  return (
    <div className="relative space-y-4">
      {entries.map((e, i) => (
        <div key={i} className="flex gap-3 sm:gap-4">
          <div className="flex w-14 shrink-0 flex-col items-center pt-4 sm:w-16">
            <span
              className="text-center text-[11px] font-medium leading-tight"
              style={{ color: "var(--text-muted)" }}
            >
              {e.date ? fmtDate(e.date) : "TBC"}
            </span>
            <span
              className="mt-1 h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            {i < entries.length - 1 && (
              <span
                className="mt-1 w-px flex-1"
                style={{ background: "var(--border)" }}
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <RecordCard
              collection={e.collection}
              item={e.item}
              onEdit={() => onEdit(e.collection, e.item)}
              onDelete={() => onDelete(e.collection, String(e.item.id))}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
