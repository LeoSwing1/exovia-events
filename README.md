# Exovia Events — Structured Booking Website

Premium Exovia Events marketing site with WebGL hero, structured vendor/customer booking popup, stall-booking banner, call-now action, WhatsApp chat, SEO pages, blog content, analytics hooks and the existing Exovia branding.

## Vercel

This project is configured for Vercel + Vite.

- Framework Preset: **Vite**
- Build Command: **npm run build**
- Output Directory: **dist**
- Install Command: **npm install**
- Root Directory: **./**

The build script intentionally invokes Vite through Node:

```text
node ./node_modules/vite/bin/vite.js build
```

This avoids the Unix executable-permission problem that previously caused Vercel's `/node_modules/.bin/vite` or `/node_modules/.bin/tsc` command to exit with code 126.

## Local commands

```cmd
npm install
npm run build
npm run preview
```

Type checking separately:

```cmd
npm run typecheck
```

## Booking flow

The quick-entry popup is a structured lead capture layer. The full external form remains available for payment screenshot/file upload.

Default full-form URL:

`https://q.me-qr.com/g813gpxw`

The supplied stall banner is stored at:

(removed in V11; the old poster banner is no longer used)

Its QR was checked after packaging and decodes to the same form URL.

## Environment variables

Copy `.env.example` to `.env` for local configuration if needed. The site has safe defaults for the Exovia WhatsApp and call number, so the basic deployment does not require environment variables.


## SEO + AI-search integration (v8)
- Added crawlable service URLs under `/services/*/` instead of relying only on hash routes.
- Added `/events/` discovery hub.
- Added `/llms.txt` with a concise, factual Exovia brand/service source of truth for AI systems and other machine readers.
- Added Service JSON-LD to each service page and WebSite/Organization structured data to the homepage.
- Updated sitemap and robots.txt to expose the crawlable URLs.
- Real published events should get Event JSON-LD only when date, location and event details are actually available.
- This improves discoverability and machine understanding but does not guarantee search rankings or AI citations.

## Exovia Operations Center

The website now includes an internal `/admin` Operations Center. Public website forms no longer automatically send every submission to WhatsApp. Contact enquiries, vendor/stall registrations and customer registrations are stored in the browser CRM and appear in the admin dashboard.

Admin modules:
- Overview dashboard
- Leads / enquiries
- Vendors & stall records
- Customers / visitor registrations
- Events and event pipeline
- Payments / reconciliation register
- Tasks and follow-ups
- Search, status management and CSV/JSON export

Default demo PIN: `EXOVIA2026`. Set `VITE_ADMIN_PIN` for the local demo gate. **This PIN is a client-side convenience gate, not production authentication.** For a real multi-user production CRM, connect the included `supabase-schema.sql` (or another server-side database/API) and add proper authentication/RLS.

The marketplace section was redesigned without the previous poster/banner image. WhatsApp remains available only through explicit Chat buttons; form submissions are routed to the Operations Center instead of being auto-composed into WhatsApp.


## V10 Operations update
- Public admin card removed from the marketplace section; staff access remains at `/admin`.
- Booking/registration popup opens from marketplace CTAs and once for first-time visitors per session.
- Admin event creation defaults to LIVE and supports four Uttar Pradesh locations: Lucknow, Kanpur, Noida and Varanasi.
- Events marked LIVE are rendered in the public `Live Events` section from the shared browser CRM store.
- For true multi-device production sync, connect the included Supabase schema and authentication before treating browser storage as the source of truth.


## V11 performance and payments
- Hero WebGL shader is loaded during browser idle time, capped at 1.25x pixel ratio and paused when the tab is hidden.
- Removed the unused 2MB stall banner and unused large logo asset from the public bundle.
- Added the supplied Exovia UPI QR at `public/payment-method-exovia.jpg`.
- Vendor booking shows the QR and creates a pending payment record when a priced package is selected.
- CRM sync listens to both same-tab events and cross-tab `storage` events.
- Cross-device production sync still requires the planned Supabase backend; browser localStorage is not a shared cloud database.


## Payment UX
Vendor booking uses a gateway-style UPI panel. The selected stall package amount is embedded into Google Pay, PhonePe, Paytm and generic UPI deep links. Desktop/iPhone users can scan the QR or copy the UPI ID. App availability varies by device/browser; QR is the fallback.
