# share.david.app

A low-maintenance sharing shelf. The app and shared CSS/JS are deployed as a Render Static Site. Published HTML pages and the public index live in Wasabi, so publishing content does not trigger a deploy.

## Content layout

- `pages/<random-id>.html` — complete HTML documents, unlisted by default
- `assets/<random-id>/...` — page-specific files
- `index.json` — metadata for pages intentionally listed on the front page

Published documents can use the shared assets:

```html
<link rel="stylesheet" href="https://share.david.app/assets/app.v2.css">
<script defer src="https://share.david.app/assets/app.v1.js"></script>
```

### Summary components

Long-form summaries can compose the shared classes below rather than embedding page-specific CSS:

- `summary-document` — article wrapper
- `summary-lead`, `summary-callout`, `summary-takeaway` — emphasized text blocks
- `summary-stats` + `summary-stat` — quantitative highlights
- `summary-section`, `summary-kicker`, `summary-section-intro` — section hierarchy
- `summary-cards` + `summary-card` — one focused idea per card
- `summary-cards--compact` — optional two-column card layout
- `summary-quotes` + `summary-quote` — quote grid
- `summary-source` — source/footer treatment

These primitives are mobile-first and use the shared color variables, including dark mode.

## Render

- Build command: `npm run build`
- Publish directory: `dist`
- Rewrite: `/p/*` → Wasabi `pages/*.html`

## Development

```sh
npm run check
python -m http.server -d dist 8080
```
