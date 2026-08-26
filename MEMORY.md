# MEMORY.md — Trip Tracker decision log

## 2026-08-26 — Initial build

**Decided: full webapp on Next.js, deployed to Vercel.**
Why: Noah's moving around a lot and wants it on phone + laptop with sync.
Rejected: single-file local app (no cross-device sync, data trapped in one
browser); Notion (wanted something bespoke).

**Decided: no database — one JSON document + photo files in Vercel Blob (private).**
Why: single-user personal tracker. A real Postgres is overkill to run and
maintain. Blob gives cross-device sync with nothing to administer.
Rejected: Neon/Postgres (operational overhead for no real benefit at this scale).
Trade-off accepted: saving is last-write-wins on the whole document. Fine for
one person; would not hold up for concurrent multi-user editing.

**Decided: single shared password + HMAC-signed cookie, no accounts.**
Why: holds booking confirmations with names/PNRs, so it can't be open to the
web — but it's just Noah, so full auth/user tables are unnecessary.
Photos are streamed through the same gate (private blobs), never public URLs.

**Decided: storage layer auto-switches — local filesystem (./.data) in dev,
Blob in production, based on presence of BLOB_READ_WRITE_TOKEN.**
Why: app runs locally with zero setup; production uses Blob automatically.

**Decided: forms/cards driven by a field schema (src/lib/schema.ts).**
Why: five record types, one generic form + tailored cards. Less code, consistent.

**Next-version notes / not done yet:**
- No CSV/PDF export.
- No sharing with travel companions (would need real accounts).
- Photo captions are per-batch on upload, not editable per-photo in the UI yet
  (the delete + re-add path works; editing caption would be a small add).
