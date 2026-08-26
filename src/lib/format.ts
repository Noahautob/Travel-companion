// Small display helpers. Dates are stored as plain "YYYY-MM-DD" strings, so we
// parse them as local dates (no timezone surprises).

export function parseDate(iso: string): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function fmtDate(iso: string): string {
  const d = parseDate(iso);
  if (!d) return "";
  return `${DAY[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`;
}

export function fmtDateLong(iso: string): string {
  const d = parseDate(iso);
  if (!d) return "";
  return `${DAY[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`;
}

export function fmtRange(start: string, end: string): string {
  const a = fmtDate(start);
  const b = fmtDate(end);
  if (a && b) return `${a} → ${b}`;
  return a || b || "Dates TBC";
}

export function nights(start: string, end: string): number | null {
  const a = parseDate(start);
  const b = parseDate(end);
  if (!a || !b) return null;
  const diff = Math.round((b.getTime() - a.getTime()) / 86400000);
  return diff > 0 ? diff : null;
}
