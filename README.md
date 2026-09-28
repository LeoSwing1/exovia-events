# Exovia Events

Premium event-management website for Exovia Events.

## Stack
- Vite + React + TypeScript
- Three.js custom fragment shader / WebGL hero
- Responsive mobile-first UI
- SEO metadata + Open Graph + Twitter metadata
- Organization structured data
- Google Analytics 4 hook
- Meta Pixel hook
- WhatsApp lead CTA
- Event enquiry tracking/dataLayer hooks
- Vendor-partner CTA
- Reduced-motion accessibility handling

## Run on Windows CMD

```cmd
npm install
npm run dev
```

Production build:

```cmd
npm run build
npm run preview
```

## Environment

Copy `.env.example` to `.env` and add the real values when available.

The site intentionally does not fake live credentials. Analytics, Meta Pixel, WhatsApp number and social URLs are integration hooks and become live when their real values are supplied.

## Deployment

The generated `dist` folder can be deployed to Vercel, Netlify, Cloudflare Pages or any static host.

## Next production integrations

Recommended next layer:
1. Real Web3Forms/contact endpoint or Exovia backend lead API
2. GA4 conversion events + Search Console
3. Meta Pixel + Conversions API
4. WhatsApp Business routing
5. CRM/vendor database
6. Google Business Profile + LocalBusiness schema per operating location
7. CMS for event portfolio/gallery
8. Sitemap + robots + city/service landing pages
9. Consent/privacy management
10. Booking/quotation workflow


## V2 additions
- WhatsApp number configured for Exovia: +91 88815 22092
- Fixed hero CTA / scroll-indicator overlap on mobile
- Vibrant purple/cyan/pink/orange visual system
- Food & hospitality quality section
- Event service SEO hub and service-detail views
- Exovia Journal/blog section
- Dynamic document title and meta description for service views
- Social profile environment hooks
