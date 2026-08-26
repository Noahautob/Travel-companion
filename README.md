# Trip Tracker

A private little webapp for tracking one trip: flights (and alternatives),
stays, lodging options, recommendations, and photos. Works on your phone and
laptop, syncs across both.

## What it does

- **Timeline** — flights and stays laid out in date order, the spine of the trip.
- **Flights** — airline, number, route, times, price, booking link, confirmation.
  Mark them `booked` or `considering` so alternatives sit next to the real thing.
- **Stays** — a stint in a city/neighbourhood with dates. `confirmed`, `tentative`, `idea`.
- **Lodging** — hotels, Airbnbs, staying with friends. Multiple options per city, grouped by city.
- **Recs** — places to eat/see/do, grouped by city, with links.
- **Photos** — upload booking screenshots, room shots, views. Captioned, tagged by city.

Everything lives behind one password.

## How it's built (the short version)

- **Next.js** app.
- **No database.** The whole trip is one JSON document; photos are separate files.
  In production both live in **Vercel Blob** (private). Locally they live in `./.data`
  on disk — so it just runs, no setup.
- **One password** gates everything. The photo files are streamed through that gate,
  so they're never publicly reachable.
- Trade-off worth knowing: saving is last-write-wins on the whole document. If you
  edit the same thing on two devices at the same moment, one can overwrite the other.
  For one person on one trip, a non-issue.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The dev password is `traveller` (change it via
`APP_PASSWORD` in `.env.local` — see `.env.example`).

## Deploy it (so it's on your phone)

You need two things: Vercel Blob turned on, and your two secrets set. About five minutes.

1. **Push this to GitHub**, then import the repo at [vercel.com/new](https://vercel.com/new).
   (Or run `vercel` from the CLI.)

2. **Add Blob storage.** In the Vercel project → **Storage** tab → **Create** →
   **Blob**. Connect it to this project. That automatically sets `BLOB_READ_WRITE_TOKEN`
   for you — you don't copy anything.

3. **Set your two secrets.** Project → **Settings** → **Environment Variables**, add:
   - `APP_PASSWORD` — the password you'll type to get in. Make it a good one.
   - `AUTH_SECRET` — any long random string. Generate one with:
     ```bash
     openssl rand -base64 32
     ```

4. **Redeploy** (Deployments tab → ⋯ → Redeploy) so the new env vars take effect.

That's it. Open the URL on your phone, enter your password, add it to your home screen.

## Notes

- Photos are capped at 15 MB each.
- To wipe local dev data and start fresh, delete the `.data` folder.
