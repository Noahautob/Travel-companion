"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = "/";
    } else {
      setError("That's not the password.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div
        className="w-full max-w-sm rounded-2xl border p-6"
        style={{ background: "var(--surface)", boxShadow: "var(--shadow-lg)" }}
      >
        <div className="mb-5 text-center">
          <div className="text-4xl">🧭</div>
          <h1 className="mt-2 text-xl font-bold">Trip Tracker</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Enter your password to open the trip.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            style={{ background: "var(--surface-2)" }}
          />
          {error && (
            <p className="text-sm" style={{ color: "var(--red)" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60"
            style={{ background: "var(--accent)" }}
          >
            {busy ? "Checking…" : "Open trip"}
          </button>
        </form>
      </div>
    </div>
  );
}
