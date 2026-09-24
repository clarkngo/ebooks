# Waymark Library

Static gated ebook library for **Waymark** — practical playbooks for builders, independents, and team leads.

Live path (GitHub Pages project site): `https://<user>.github.io/ebooks/`

## What’s here

- Browse a guide grid with original covers and blurbs
- Short embedded form gate (swap for Google Forms when you want hosted lead capture)
- On-page download unlock after submit (session-scoped)
- Shelf includes Project Lithos (Books 1–3 PDFs via hosted URLs) and Project Ouroboros (EPUB)

## Local preview

```bash
cd site && python3 -m http.server 8080
```

Open http://localhost:8080 — `file://` will not load `catalog.json` reliably.

## Add a guide

1. Put the file in `site/ebooks/` (PDF preferred).
2. Optional cover under `site/ebooks/covers/`.
3. Append an entry to `site/catalog.json`.

## Gate form

Default embed is the static form at `site/gate/form.html` (submit → `thanks.html` triggers unlock).

To use Google Forms instead:

1. Form → **Send** → **<> Embed HTML**
2. Copy the `src` URL ending in `viewform?embedded=true`
3. Set `gate.formEmbedUrl` (and optionally `gate.formShareUrl`) in `catalog.json`

Unlock treats the iframe’s second load as confirmation; a manual “unlock your download” control remains as fallback.

## Deploy

Push to `main`. GitHub Actions deploys `site/` to Pages.
