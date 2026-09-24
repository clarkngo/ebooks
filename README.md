# Clark's Ebooks

Static ebook library — original fiction. Browse and download; no signup.

Live path (GitHub Pages project site): `https://<user>.github.io/ebooks/`

## What’s here

- Guide grid with covers and blurbs
- Instant download (local files or hosted URLs)
- Shelf: The Last Lithoi (Books 1–3) and Project Ouroboros

## Local preview

```bash
cd site && python3 -m http.server 8080
```

Open http://localhost:8080 — `file://` will not load `catalog.json` reliably.

## Add an ebook

1. Put the file in `site/ebooks/` (PDF preferred).
2. Optional cover under `site/ebooks/covers/`.
3. Append an entry to `site/catalog.json`.

## Deploy

Push to `main`. GitHub Actions deploys `site/` to Pages.
