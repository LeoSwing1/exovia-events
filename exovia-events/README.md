# Exovia Events

Premium event-management website for Exovia Events.

## Stack

- React 19 + TypeScript
- Vite 7
- Three.js WebGL shader hero
- Responsive CSS
- WhatsApp lead flow
- Instagram CTA
- SEO metadata, sitemap, robots and structured data
- Exovia transparent logo + favicon/PWA assets

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Type-check separately with:

```bash
npm run typecheck
```

The production build intentionally uses Vite directly so a type-checking issue cannot prevent the static Vite site from being deployed. Type-checking remains available as a separate CI/development command.

## Vercel

Import the GitHub repository and use:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

`vercel.json` is included with these settings.

## Lead contact

Website enquiry forms open WhatsApp with the submitted name, phone, event type and details. The configured business WhatsApp number is supplied through `VITE_WHATSAPP_NUMBER` or defaults to the project contact number.
