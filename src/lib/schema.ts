// Field definitions that drive the generic forms and cards. Add a field here
// and it shows up in the add/edit form and can be rendered on the card — no
// bespoke component needed per record type.

import type { Collection } from "./types";

export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "time"
  | "select"
  | "url"
  | "number";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  half?: boolean; // render two-per-row on wider screens
}

export interface CollectionMeta {
  key: Collection;
  label: string; // plural, for the tab
  singular: string;
  icon: string; // emoji
  addLabel: string;
  fields: Field[];
}

const CURRENCIES = ["CAD", "USD", "AUD", "EUR", "GBP"];

export const SCHEMA: Record<
  Exclude<Collection, "photos">,
  CollectionMeta
> = {
  stays: {
    key: "stays",
    label: "Stays",
    singular: "stay",
    icon: "📍",
    addLabel: "Add a stay",
    fields: [
      { key: "city", label: "City", type: "text", required: true, half: true, placeholder: "Vancouver" },
      { key: "neighbourhood", label: "Neighbourhood", type: "text", half: true, placeholder: "Mount Pleasant" },
      { key: "country", label: "Country", type: "select", options: ["Canada", "USA"], half: true },
      { key: "status", label: "Status", type: "select", options: ["confirmed", "tentative", "idea"], half: true },
      { key: "startDate", label: "Arrive", type: "date", half: true },
      { key: "endDate", label: "Leave", type: "date", half: true },
      { key: "notes", label: "Notes", type: "textarea", placeholder: "Staying with Sarah, close to the SkyTrain…" },
    ],
  },
  flights: {
    key: "flights",
    label: "Flights",
    singular: "flight",
    icon: "✈️",
    addLabel: "Add a flight",
    fields: [
      { key: "airline", label: "Airline", type: "text", half: true, placeholder: "Air Canada" },
      { key: "flightNumber", label: "Flight number", type: "text", half: true, placeholder: "AC123" },
      { key: "fromCity", label: "From (city)", type: "text", half: true, placeholder: "Vancouver" },
      { key: "fromAirport", label: "From (airport)", type: "text", half: true, placeholder: "YVR" },
      { key: "toCity", label: "To (city)", type: "text", half: true, placeholder: "Toronto" },
      { key: "toAirport", label: "To (airport)", type: "text", half: true, placeholder: "YYZ" },
      { key: "date", label: "Date", type: "date", half: true },
      { key: "status", label: "Status", type: "select", options: ["booked", "considering"], half: true },
      { key: "depTime", label: "Departs", type: "time", half: true },
      { key: "arrTime", label: "Arrives", type: "time", half: true },
      { key: "price", label: "Price", type: "text", half: true, placeholder: "480" },
      { key: "currency", label: "Currency", type: "select", options: CURRENCIES, half: true },
      { key: "confirmation", label: "Confirmation / PNR", type: "text", half: true, placeholder: "ABC123" },
      { key: "bookingLink", label: "Booking link", type: "url", placeholder: "https://…" },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
  },
  lodging: {
    key: "lodging",
    label: "Lodging",
    singular: "place",
    icon: "🛏️",
    addLabel: "Add a place",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "The Burrard Hotel" },
      { key: "type", label: "Type", type: "select", options: ["hotel", "airbnb", "friend", "other"], half: true },
      { key: "status", label: "Status", type: "select", options: ["booked", "considering", "staying"], half: true },
      { key: "city", label: "City", type: "text", half: true, placeholder: "Vancouver" },
      { key: "neighbourhood", label: "Neighbourhood", type: "text", half: true, placeholder: "Downtown" },
      { key: "checkIn", label: "Check in", type: "date", half: true },
      { key: "checkOut", label: "Check out", type: "date", half: true },
      { key: "price", label: "Price / night", type: "text", half: true, placeholder: "180" },
      { key: "currency", label: "Currency", type: "select", options: CURRENCIES, half: true },
      { key: "confirmation", label: "Confirmation", type: "text", half: true, placeholder: "Booking ref" },
      { key: "bookingLink", label: "Booking link", type: "url", placeholder: "https://…" },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
  },
  recommendations: {
    key: "recommendations",
    label: "Recs",
    singular: "recommendation",
    icon: "⭐",
    addLabel: "Add a rec",
    fields: [
      { key: "title", label: "Name", type: "text", required: true, half: true, placeholder: "Kissa Tanto" },
      { key: "category", label: "Category", type: "select", options: ["food", "drink", "sight", "activity", "shopping", "other"], half: true },
      { key: "city", label: "City", type: "text", half: true, placeholder: "Vancouver" },
      { key: "link", label: "Link", type: "url", placeholder: "https://…" },
      { key: "notes", label: "Notes", type: "textarea", placeholder: "Ben says the pasta is unreal — book ahead." },
    ],
  },
};

// Status → badge colour token (matches CSS vars in globals.css)
export const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  confirmed: { bg: "var(--green-soft)", fg: "var(--green)" },
  booked: { bg: "var(--green-soft)", fg: "var(--green)" },
  staying: { bg: "var(--accent-soft)", fg: "var(--accent-text)" },
  tentative: { bg: "var(--amber-soft)", fg: "var(--amber)" },
  considering: { bg: "var(--amber-soft)", fg: "var(--amber)" },
  idea: { bg: "var(--slate-soft)", fg: "var(--slate)" },
};

export const CATEGORY_ICON: Record<string, string> = {
  food: "🍜",
  drink: "🍸",
  sight: "🏔️",
  activity: "🎟️",
  shopping: "🛍️",
  other: "📌",
};
