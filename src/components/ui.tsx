"use client";

import { useEffect, type ReactNode } from "react";

export function Badge({
  children,
  bg,
  fg,
}: {
  children: ReactNode;
  bg?: string;
  fg?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize"
      style={{
        background: bg ?? "var(--surface-2)",
        color: fg ?? "var(--text-muted)",
      }}
    >
      {children}
    </span>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4"
      style={{ background: "rgba(10, 12, 16, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
        style={{ background: "var(--surface)", boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 flex items-center justify-between px-5 py-4 border-b"
          style={{ background: "var(--surface)" }}
        >
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-lg leading-none transition hover:bg-[var(--surface-2)]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  hint,
}: {
  icon: string;
  title: string;
  hint: string;
}) {
  return (
    <div
      className="rounded-2xl border border-dashed py-12 px-6 text-center"
      style={{ background: "var(--surface)" }}
    >
      <div className="text-3xl">{icon}</div>
      <p className="mt-3 font-medium">{title}</p>
      <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
        {hint}
      </p>
    </div>
  );
}
