# VUKA Blog (Next.js + Sanity)

This folder contains a dedicated Next.js app for SEO-first blog pages and a Sanity Studio authoring platform.

## Routes

- `/blog` - blog index page
- `/blog/[slug]` - post detail pages with metadata and JSON-LD
- `/studio` - embedded Sanity Studio
- `/api/revalidate` - webhook endpoint for ISR revalidation

## Environment

Copy `.env.example` to `.env.local` in this folder and fill:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_MAIN_SITE_URL` (optional, where Home/Flights/Holidays/Contact links should point)
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN` (optional for drafts/private dataset)
- `SANITY_REVALIDATE_SECRET` (required for webhook)

## Local run

```bash
npm install
npm run dev
```

By default this runs on `http://localhost:3001`.

## Sanity content workflow

1. Open `/studio` and create author/category/post documents.
2. Publish a post.
3. Configure a Sanity webhook to `POST /api/revalidate?secret=YOUR_SECRET` with payload including `slug`.
