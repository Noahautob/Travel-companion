"use client";

import { useState } from "react";
import type { Field } from "@/lib/schema";

const inputClass =
  "w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]";

export function EntityForm({
  fields,
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  fields: Field[];
  initial?: Record<string, unknown>;
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => Promise<void> | void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    for (const f of fields) {
      const initVal = initial?.[f.key];
      v[f.key] =
        initVal === undefined || initVal === null ? "" : String(initVal);
      if (f.type === "select" && !v[f.key] && f.options?.length) {
        v[f.key] = f.options[0];
      }
    }
    return v;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    for (const f of fields) {
      if (f.required && !values[f.key]?.trim()) {
        setError(`${f.label} is required`);
        return;
      }
    }
    setError("");
    setSaving(true);
    try {
      await onSubmit(values);
    } catch {
      setError("Something went wrong saving that. Try again?");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((f) => (
          <div
            key={f.key}
            className={f.half ? "sm:col-span-1" : "sm:col-span-2"}
          >
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              {f.label}
              {f.required && <span style={{ color: "var(--red)" }}> *</span>}
            </label>

            {f.type === "textarea" ? (
              <textarea
                className={inputClass + " min-h-[72px] resize-y"}
                style={{ background: "var(--surface-2)" }}
                value={values[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => set(f.key, e.target.value)}
              />
            ) : f.type === "select" ? (
              <select
                className={inputClass + " capitalize"}
                style={{ background: "var(--surface-2)" }}
                value={values[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
              >
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className={inputClass}
                style={{ background: "var(--surface-2)" }}
                type={
                  f.type === "url"
                    ? "url"
                    : f.type === "number"
                      ? "number"
                      : f.type
                }
                value={values[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => set(f.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm" style={{ color: "var(--red)" }}>
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-[var(--surface-2)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
          style={{ background: "var(--accent)" }}
        >
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
