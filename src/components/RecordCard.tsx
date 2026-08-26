"use client";

import type { ReactNode } from "react";
import { Badge } from "./ui";
import { STATUS_STYLE, CATEGORY_ICON } from "@/lib/schema";
import { fmtDate, fmtRange, nights } from "@/lib/format";
import type {
  Collection,
  Flight,
  Lodging,
  Recommendation,
  Stay,
} from "@/lib/types";

function StatusBadge({ status }: { status: string }) {
  if (!status) return null;
  const s = STATUS_STYLE[status];
  return (
    <Badge bg={s?.bg} fg={s?.fg}>
      {status}
    </Badge>
  );
}

function LinkButton({ href, label }: { href: string; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition hover:opacity-80"
      style={{ background: "var(--accent-soft)", color: "var(--accent-text)" }}
    >
      {label} ↗
    </a>
  );
}

function Confirmation({ value }: { value: string }) {
  if (!value) return null;
  return (
    <span
      className="rounded-md px-2 py-0.5 font-mono text-xs"
      style={{ background: "var(--surface-2)", color: "var(--text)" }}
    >
      {value}
    </span>
  );
}

function Shell({
  children,
  onEdit,
  onDelete,
}: {
  children: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="group relative rounded-2xl border p-4"
      style={{ background: "var(--surface)", boxShadow: "var(--shadow)" }}
    >
      <div className="absolute right-3 top-3 flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
        <button
          onClick={onEdit}
          className="grid h-7 w-7 place-items-center rounded-lg text-xs transition hover:bg-[var(--surface-2)]"
          aria-label="Edit"
          title="Edit"
        >
          ✎
        </button>
        <button
          onClick={onDelete}
          className="grid h-7 w-7 place-items-center rounded-lg text-xs transition hover:bg-[var(--surface-2)]"
          style={{ color: "var(--red)" }}
          aria-label="Delete"
          title="Delete"
        >
          🗑
        </button>
      </div>
      {children}
    </div>
  );
}

function Notes({ text }: { text: string }) {
  if (!text) return null;
  return (
    <p className="mt-2 text-sm whitespace-pre-wrap break-words" style={{ color: "var(--text-muted)" }}>
      {text}
    </p>
  );
}

export function RecordCard({
  collection,
  item,
  onEdit,
  onDelete,
}: {
  collection: Collection;
  item: Record<string, unknown>;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (collection === "stays") {
    const s = item as unknown as Stay;
    const n = nights(s.startDate, s.endDate);
    return (
      <Shell onEdit={onEdit} onDelete={onDelete}>
        <div className="flex items-start gap-3 pr-14">
          <span className="text-xl leading-none">📍</span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{s.city || "Untitled"}</h3>
              <StatusBadge status={s.status} />
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {[s.neighbourhood, s.country].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span>{fmtRange(s.startDate, s.endDate)}</span>
          {n && (
            <span style={{ color: "var(--text-muted)" }}>
              · {n} night{n > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <Notes text={s.notes} />
      </Shell>
    );
  }

  if (collection === "flights") {
    const f = item as unknown as Flight;
    return (
      <Shell onEdit={onEdit} onDelete={onDelete}>
        <div className="flex items-center justify-between gap-2 pr-14">
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <span>✈️</span>
            <span>
              {[f.airline, f.flightNumber].filter(Boolean).join(" ") || "Flight"}
            </span>
          </div>
          <StatusBadge status={f.status} />
        </div>
        <div className="mt-1 flex items-baseline gap-2 text-lg font-semibold">
          <span>{f.fromAirport || f.fromCity || "?"}</span>
          <span style={{ color: "var(--accent)" }}>→</span>
          <span>{f.toAirport || f.toCity || "?"}</span>
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {[f.fromCity, f.toCity].filter(Boolean).join(" → ")}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          {f.date && <span>{fmtDate(f.date)}</span>}
          {(f.depTime || f.arrTime) && (
            <span style={{ color: "var(--text-muted)" }}>
              {[f.depTime, f.arrTime].filter(Boolean).join("–")}
            </span>
          )}
          {f.price && (
            <span className="font-medium">
              {f.price} {f.currency}
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Confirmation value={f.confirmation} />
          <LinkButton href={f.bookingLink} label="Booking" />
        </div>
        <Notes text={f.notes} />
      </Shell>
    );
  }

  if (collection === "lodging") {
    const l = item as unknown as Lodging;
    const n = nights(l.checkIn, l.checkOut);
    return (
      <Shell onEdit={onEdit} onDelete={onDelete}>
        <div className="flex items-start gap-3 pr-14">
          <span className="text-xl leading-none">🛏️</span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{l.name || "Untitled"}</h3>
              <StatusBadge status={l.status} />
              {l.type && <Badge>{l.type}</Badge>}
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {[l.neighbourhood, l.city].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          {(l.checkIn || l.checkOut) && (
            <span>{fmtRange(l.checkIn, l.checkOut)}</span>
          )}
          {n && (
            <span style={{ color: "var(--text-muted)" }}>
              · {n} night{n > 1 ? "s" : ""}
            </span>
          )}
          {l.price && (
            <span className="font-medium">
              {l.price} {l.currency}/night
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Confirmation value={l.confirmation} />
          <LinkButton href={l.bookingLink} label="Booking" />
        </div>
        <Notes text={l.notes} />
      </Shell>
    );
  }

  // recommendations
  const r = item as unknown as Recommendation;
  return (
    <Shell onEdit={onEdit} onDelete={onDelete}>
      <div className="flex items-start gap-3 pr-14">
        <span className="text-xl leading-none">
          {CATEGORY_ICON[r.category] || "⭐"}
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold">{r.title || "Untitled"}</h3>
          <p className="text-sm capitalize" style={{ color: "var(--text-muted)" }}>
            {[r.category, r.city].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
      <Notes text={r.notes} />
      {r.link && (
        <div className="mt-2">
          <LinkButton href={r.link} label="Open" />
        </div>
      )}
    </Shell>
  );
}
