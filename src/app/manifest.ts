import type { MetadataRoute } from "next";

// Web app manifest — makes "Add to Home Screen" install a full-screen,
// standalone app (no browser chrome) with the travel icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Trip Tracker",
    short_name: "Trips",
    description: "Flights, stays, lodging, recs and photos for the next trip.",
    start_url: "/",
    display: "standalone",
    background_color: "#15304d",
    theme_color: "#0f766e",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
