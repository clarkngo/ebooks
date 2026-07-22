# Agent notes — CityU Guides

This repo is a static gated ebook library for City University of Seattle.

## Brand

Follow [cityu.edu](https://cityu.edu/) branding:

| Token | Value |
|---|---|
| Dark blue | `#0a253f` / `#001321` |
| Teal | `#00a3af` |
| Light teal | `#8ad3d6` / `#c5e9eb` |
| Yellow | `#faa31b` |
| Pink | `#f05181` |
| Display font | **Oswald** (headings / brand) |
| Body font | **Avenir** / Avenir Next (web fallback: Nunito Sans) |

Do not put maintainer/dev instructions in the public UI (footer, hero, etc.). Keep those in `README.md` / this file.

## Add an ebook

1. Put the file in `site/ebooks/` (PDF preferred).
2. Optional cover under `site/ebooks/covers/` (valid SVG/PNG/JPG; keep SVG XML-safe — avoid broken Unicode).
3. Append an entry to `site/catalog.json`:

```json
{
  "id": "my-guide",
  "title": "My Guide Title",
  "subtitle": "Optional subtitle",
  "description": "One or two sentences.",
  "file": "ebooks/my-guide.pdf",
  "cover": "ebooks/covers/my-guide.svg",
  "format": "PDF",
  "audience": "Prospective students",
  "featured": false
}
```

Gate form embed is configured under `catalog.json` → `gate.formEmbedUrl`.

## Run locally

```bash
cd site && python3 -m http.server 8080
```
