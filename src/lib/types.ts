// The shape of everything the trip tracker stores.
// One JSON document holds the whole trip. Photo binaries live separately
// (in Blob or on disk); only their metadata lives here.

export type StayStatus = "confirmed" | "tentative" | "idea";
export type FlightStatus = "booked" | "considering";
export type LodgingStatus = "booked" | "considering" | "staying";
export type LodgingType = "hotel" | "airbnb" | "friend" | "other";
export type RecCategory =
  | "food"
  | "drink"
  | "sight"
  | "activity"
  | "shopping"
  | "other";

export interface Stay {
  id: string;
  city: string;
  neighbourhood: string;
  country: string; // free text, e.g. "Canada", "USA"
  startDate: string; // ISO date, e.g. "2026-09-14"
  endDate: string;
  status: StayStatus;
  notes: string;
  createdAt: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  fromCity: string;
  fromAirport: string; // e.g. "YVR"
  toCity: string;
  toAirport: string;
  date: string; // ISO date of departure
  depTime: string; // "14:35"
  arrTime: string;
  confirmation: string; // booking reference / PNR
  bookingLink: string;
  price: string;
  currency: string;
  status: FlightStatus;
  notes: string;
  createdAt: string;
}

export interface Lodging {
  id: string;
  name: string;
  type: LodgingType;
  city: string;
  neighbourhood: string;
  checkIn: string; // ISO date
  checkOut: string;
  bookingLink: string;
  confirmation: string;
  price: string;
  currency: string;
  status: LodgingStatus;
  notes: string;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  title: string;
  city: string;
  category: RecCategory;
  link: string;
  notes: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  caption: string;
  city: string;
  filename: string;
  contentType: string;
  size: number;
  createdAt: string;
}

export interface TripData {
  trip: {
    name: string;
    notes: string;
    updatedAt: string;
  };
  stays: Stay[];
  flights: Flight[];
  lodging: Lodging[];
  recommendations: Recommendation[];
  photos: Photo[];
}

export type Collection =
  | "stays"
  | "flights"
  | "lodging"
  | "recommendations"
  | "photos";

export function emptyTrip(): TripData {
  return {
    trip: {
      name: "Canada & US Trip",
      notes: "",
      updatedAt: new Date().toISOString(),
    },
    stays: [],
    flights: [],
    lodging: [],
    recommendations: [],
    photos: [],
  };
}
