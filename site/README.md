# CityU Guides — gated ebook site

A static ebook library with Google Forms gating for [City University of Seattle](https://cityu.edu/).

**Maintainer note:** To add guides, drop files into `site/ebooks/` and list them in `site/catalog.json`. Do not surface that instruction in the public site UI — see also `/AGENTS.md`.

## Brand

Matches cityu.edu:

- Colors: dark blue `#0a253f`, teal `#00a3af`, yellow `#faa31b`
- Fonts: **Oswald** (brand/headings), **Avenir** body with Nunito Sans web fallback

## Google Form embed

**Yes — this form can be embedded.**

| | |
|---|---|
| Short link | https://forms.gle/LaEY1GUvLLZEyAtQ6 |
| Embed URL | `https://docs.google.com/forms/d/e/1FAIpQLSfePjI7Ugl6aEcTdF1L-RJe--2LShxpAJgROleGThBqZ3GkBg/viewform?embedded=true` |

The site uses the embed URL in an iframe. After submit, Google Forms loads a confirmation view in that iframe; the site treats the second iframe load as unlock (with a manual “unlock your download” fallback).

To copy the official embed snippet yourself: open the form → **Send** → **<> Embed HTML**.

## Run locally

```bash
cd site
python3 -m http.server 8080
```

Then open http://localhost:8080

(`file://` will not load `catalog.json` reliably because of browser fetch restrictions.)

## Add an ebook

1. Put the file in `site/ebooks/` (PDF recommended; Markdown works too).
2. Optional: add a cover image under `site/ebooks/covers/`.
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

Optional per-book form override: `"formEmbedUrl": "https://docs.google.com/forms/d/e/.../viewform?embedded=true"`.

## Unlock behavior

- Completing the embedded form unlocks downloads for the rest of the **browser session** (`sessionStorage`).
- After unlock, library buttons switch to direct download.
- Honor-system fallback: “unlock your download” if the iframe confirmation is not detected.

## Project layout

```
site/
  index.html
  catalog.json
  css/styles.css
  js/app.js
  ebooks/
    *.pdf
    covers/*.svg
```
