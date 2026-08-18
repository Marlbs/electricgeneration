# Volt — electricgeneration.com

Static site generator for Volt, the electricity/energy magazine at electricgeneration.com,
including the geo-aware "Most Popular Electric Cars" comparison package.

## Build

```bash
npm install
npm run build          # downloads car photos, then generates the site into dist/
npm run build:nofetch  # generates the site without re-downloading photos
```

Deploy the `dist/` folder. On Netlify use build command `npm install && npm run build`,
publish directory `dist` (already set in `netlify.toml`).

## Structure

| Path | What it is |
|---|---|
| `data/posts/*.md` | Articles, Markdown + YAML frontmatter (slug, categories, headline, subhead, author, date) |
| `data/cars_uk.json` | 25 UK best-sellers — GBP pricing, miles, litres |
| `data/cars_eu.json` | 25 EU/EFTA best-sellers — EUR pricing, km, litres |
| `data/cars_americas.json` | 25 US best-sellers — USD pricing, miles, cu ft |
| `data/images.json` | Wikimedia Commons source list per car (file, license, author) |
| `data/images_manifest.json` | Generated at build — maps cars to downloaded local photos |
| `data/affiliates.json` | Affiliate / lead-gen partner config (see below) |
| `netlify/edge-functions/geo.js` | Detects visitor country, injects region hint |
| `generate.js` | Builds the whole static site into `dist/` |
| `fetch_car_images.js` | Downloads CC-licensed car photos into `car-images/` |
| `style.css` | Design system (colours, type, layout) |

## Regional detection

The compare page picks a region in this priority order:

1. `?region=UK|EU|Americas` in the URL
2. Previous manual choice (localStorage)
3. Netlify Edge geolocation (`netlify/edge-functions/geo.js`)
4. Browser language, then timezone
5. Falls back to EU

Visitors can always override with the region buttons, and the choice is remembered.
The Edge Function only runs on Netlify — locally the browser-side fallbacks handle it.

## Car photos

Photos come from Wikimedia Commons and are restricted to commercial-use-compatible
licences (CC0, CC BY, CC BY-SA, public domain). `fetch_car_images.js` resolves each file
through the Commons API at build time, downloads it into `car-images/`, and `generate.js`
copies it to `dist/assets/cars/` — so the site self-hosts its images rather than hotlinking.

**Attribution is rendered under every photo and is required by the licences. Do not remove it.**

To swap in manufacturer press-kit photography later: drop your files into `car-images/`
using the naming `<make-model-slug>-1.jpg`, `-2.jpg`, `-3.jpg` and update the matching
entry in `data/images_manifest.json` (or extend `data/images.json` with your own sources).

## Affiliate / pay-per-click setup

Edit `data/affiliates.json`. Each region has a list of partners:

```json
{
  "id": "carwow-uk",
  "label": "Compare new & lease deals",
  "urlTemplate": "https://…?q={makeModel}&utm_campaign={trackingId}",
  "trackingId": "",
  "enabled": false
}
```

1. Apply to the affiliate programme (most run via Awin, CJ Affiliate, Impact or Rakuten).
2. Paste your tracking ID into `trackingId`.
3. Set `enabled` to `true`.
4. Rebuild and deploy.

Until a partner is enabled, an inert "slot" button is shown so you can see the placement
(set `showPlaceholderCtas` to `false` to hide those entirely).

Every live affiliate link is rendered with `rel="sponsored nofollow noopener"`, which is what
Google requires for paid links, and each region carries the disclosure text from
`disclosureText`. Click events fire into `window.plausible` / `window.gtag` if either
analytics library is present, so per-car click-through is measurable.

## Adding an article

Create `data/posts/<slug>.md` with frontmatter matching an existing file, then add the slug
to `HOME_ORDER` in `generate.js` if it should appear on the homepage.
