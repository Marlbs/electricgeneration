const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://electricgeneration.com';

// ---------- load data ----------
const postsDir = path.join(ROOT, 'data/posts');
const posts = fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).map(f => {
  const raw = fs.readFileSync(path.join(postsDir, f), 'utf8');
  const { data, content } = matter(raw);
  return {
    slug: data.slug,
    categories: String(data.categories).split(',').map(s => s.trim()),
    headline: data.headline,
    subhead: data.subhead,
    author: data.author,
    date: data.date,
    bodyHtml: marked.parse(content),
  };
});

const REGIONS = [
  { key: 'UK', file: 'cars_uk.json', label: 'United Kingdom', currency: 'GBP', symbol: '£',
    note: 'Ranked by approximate 2025 UK registrations (SMMT). Prices are UK RRP in pounds.' },
  { key: 'EU', file: 'cars_eu.json', label: 'Europe (EU / EFTA)', currency: 'EUR', symbol: '€',
    note: 'Ranked by approximate 2025 EU/EFTA registrations. Prices are German-market list in euros.' },
  { key: 'Americas', file: 'cars_americas.json', label: 'Americas', currency: 'USD', symbol: '$',
    note: 'Ranked by approximate 2025 US sales. Prices are US MSRP in dollars.' },
];

for (const r of REGIONS) r.cars = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', r.file), 'utf8'));

const affiliates = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/affiliates.json'), 'utf8'));

let imagesManifest = {};
const manifestPath = path.join(ROOT, 'data/images_manifest.json');
if (fs.existsSync(manifestPath)) {
  imagesManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

const NAV_CATEGORIES = ['Power Generation', 'EV Revolution', 'Grid Technology', 'Home Energy', 'Science'];
const HERO_SLUG = 'elon-musk-electric-earth-orbital-future';
const HOME_ORDER = [
  'special-report-musk-tesla-spacex-project-tracker',
  'solid-state-battery-revolution',
  'worlds-largest-offshore-wind-farm',
  'hidden-physics-of-electrical-panel',
  'virtual-power-plants-changing-grid',
  'what-is-electricity-really',
  'heat-pumps-are-not-magic',
  'testing-americas-ev-charging-network',
  'nuclear-smr-second-act',
  'hvdc-invisible-highway',
];

const findPost = slug => posts.find(p => p.slug === slug);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function fmtDate(d) {
  return new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

// ---------- chrome ----------
function header(activeCategory) {
  const navLinks = NAV_CATEGORIES.map(c =>
    `<a href="/category/${encodeURIComponent(c)}/"${c === activeCategory ? ' class="active"' : ''}>${c}</a>`
  ).join('\n      ');
  return `<header class="site-header">
  <div class="wrap eyebrow-row">
    <span>The Future Runs on Electrons</span>
    <span>Issue No. 14 &middot; June 2026</span>
  </div>
  <div class="wrap masthead">
    <a href="/">
      <div class="logo display">VOLT<span class="accent">.</span></div>
      <div class="tagline">The Electricity Magazine</div>
    </a>
  </div>
  <nav class="primary-nav wrap">
      ${navLinks}
      <a href="/compare/" class="compare-link">EV Comparison &rarr;</a>
  </nav>
</header>`;
}

function footer() {
  const sectionLinks = NAV_CATEGORIES.map(c => `<li><a href="/category/${encodeURIComponent(c)}/">${c}</a></li>`).join('\n        ');
  return `<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <div class="logo display">VOLT</div>
      <p>In-depth journalism covering energy, power systems, and the electric future of our world.</p>
    </div>
    <div>
      <h4>Sections</h4>
      <ul>
        ${sectionLinks}
        <li><a href="/compare/">EV Comparison</a></li>
      </ul>
    </div>
    <div>
      <h4>About</h4>
      <p>Volt publishes science-backed reporting on electricity generation, storage, transmission, and the technologies reshaping how humanity produces and consumes power.</p>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <span>&copy; 2026 Volt Magazine. All rights reserved.</span>
    <span>Powered by renewable energy &middot; Zero-emission hosting</span>
  </div>
</footer>`;
}

function page({ title, description, activeCategory, bodyHtml, extraHead = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="stylesheet" href="/assets/style.css">
${extraHead}
</head>
<body class="grain">
${header(activeCategory)}
${bodyHtml}
${footer()}
</body>
</html>`;
}

function articleCard(p) {
  return `<a class="card" href="/posts/${p.slug}/">
  <div>
    <span class="tag">${p.categories[0]}</span>
    <h3>${esc(p.headline)}</h3>
    <p>${esc(p.subhead)}</p>
  </div>
  <div class="meta">${fmtDate(p.date)}</div>
</a>`;
}

// ---------- compare page ----------
function stars(v) {
  return `<span class="stars" aria-label="${v} out of 5"><span class="stars-bg">&#9733;&#9733;&#9733;&#9733;&#9733;</span><span class="stars-fg" style="width:${(v / 5) * 100}%">&#9733;&#9733;&#9733;&#9733;&#9733;</span></span>`;
}

const RATING_LABELS = [
  ['comfort', 'Comfort'], ['performance', 'Performance'], ['range', 'Range'],
  ['speed_to_charge', 'Speed to Charge'], ['cost', 'Cost / Value'], ['luggage_space', 'Luggage Space'],
];

function ctaButtons(car, regionKey) {
  const all = affiliates.regions[regionKey] || [];
  const partners = all.filter(p => p.enabled);
  // Nothing configured yet: render inert placeholder slots so the layout is visible
  // and it is obvious where live affiliate buttons will sit once IDs are added.
  if (!partners.length) {
    if (!affiliates.showPlaceholderCtas || !all.length) return '';
    const ph = all.map(p =>
      `<span class="cta-btn placeholder" title="Add your ${esc(p.network)} tracking ID in data/affiliates.json to activate">${esc(p.label)} &rarr;</span>`
    ).join('\n      ');
    return `<div class="cta-row placeholder-row">
      ${ph}
      <span class="cta-disclosure">Slot</span>
    </div>`;
  }
  const makeModel = `${car.make} ${car.model}`;
  const btns = partners.map(p => {
    const url = p.urlTemplate
      .replace(/\{makeModel\}/g, encodeURIComponent(makeModel))
      .replace(/\{make\}/g, encodeURIComponent(car.make.toLowerCase()))
      .replace(/\{model\}/g, encodeURIComponent(car.model.toLowerCase().replace(/\s+/g, '-')))
      .replace(/\{trackingId\}/g, encodeURIComponent(p.trackingId || ''));
    return `<a class="cta-btn" href="${esc(url)}" rel="sponsored nofollow noopener" target="_blank" data-car="${esc(makeModel)}" data-partner="${esc(p.id)}">${esc(p.label)} &rarr;</a>`;
  }).join('\n      ');
  return `<div class="cta-row">
      ${btns}
      <span class="cta-disclosure">Ad</span>
    </div>`;
}

function gallery(car) {
  const imgs = imagesManifest[`${car.make} ${car.model}`] || [];
  if (!imgs.length) {
    return `<div class="car-gallery empty"><div class="ph">${esc(car.make)}<span>${esc(car.model)}</span></div></div>`;
  }
  const main = imgs[0];
  const thumbs = imgs.slice(1);
  const credit = im => `${im.author} / Wikimedia Commons, <a href="${esc(im.licenseUrl)}" rel="nofollow noopener" target="_blank">${esc(im.license)}</a>`;
  return `<div class="car-gallery">
    <figure class="shot main">
      <img src="${esc(main.src)}" alt="${esc(car.make + ' ' + car.model)} — ${esc(main.kind)}" loading="lazy" decoding="async">
      <figcaption>Photo: ${credit(main)}</figcaption>
    </figure>
    ${thumbs.length ? `<div class="shot-row">${thumbs.map(t => `<figure class="shot">
      <img src="${esc(t.src)}" alt="${esc(car.make + ' ' + car.model)} — ${esc(t.kind)}" loading="lazy" decoding="async">
      <figcaption>${credit(t)}</figcaption>
    </figure>`).join('')}</div>` : ''}
  </div>`;
}

function carCard(car, regionKey) {
  const ratingsHtml = RATING_LABELS.map(([k, label]) => `<div class="rating-row">
        <span class="rating-label">${label}</span>
        ${stars(car.ratings[k])}
        <span class="rating-num">${car.ratings[k].toFixed(1)}</span>
      </div>`).join('\n      ');
  return `<div class="car-card" data-region="${regionKey}" data-name="${esc((car.make + ' ' + car.model).toLowerCase())}">
  ${gallery(car)}
  <div class="car-main">
    <div class="car-head">
      <span class="car-rank">#${car.rank}</span>
      <h3>${esc(car.make)} ${esc(car.model)}</h3>
    </div>
    <div class="car-price">${esc(car.price)}</div>
    <div class="spec-row">
      <div>Range<span>${esc(car.range)}</span></div>
      <div>Battery<span>${esc(car.battery)}</span></div>
      <div>Acceleration<span>${esc(car.accel)}</span></div>
      <div>Fast Charge<span>${esc(car.charge)}</span></div>
      <div>Luggage<span>${esc(car.cargo)}</span></div>
    </div>
    <p class="review-text">${esc(car.review)}</p>
    ${ctaButtons(car, regionKey)}
  </div>
  <div class="ratings">
    ${ratingsHtml}
  </div>
</div>`;
}

function buildCompare() {
  const tabs = REGIONS.map(r =>
    `<button data-region-btn="${r.key}">${r.label} <span class="cur">${r.symbol}</span></button>`
  ).join('\n  ');

  const sections = REGIONS.map(r => `<section class="region-block wrap" data-region-section="${r.key}" hidden>
  <div class="region-head">
    <h2 class="region-title">${r.label}</h2>
    <p class="region-sub">${r.note}</p>
  </div>
  <div class="car-grid">
    ${r.cars.map(c => carCard(c, r.key)).join('\n    ')}
  </div>
</section>`).join('\n');

  const anyAffiliates = Object.values(affiliates.regions).some(list => list.some(p => p.enabled));

  const body = `<section class="wrap compare-hero">
  <div class="hero-issue">EV Revolution &middot; Special Package</div>
  <h1>The Most Popular Electric Cars, Rated &amp; Compared</h1>
  <p class="dek">Twenty-five best-sellers each for the UK, the EU and the Americas &mdash; seventy-five cars in all, each priced in its own market's currency and scored on the six things buyers actually argue about: Comfort, Performance, Range, Speed to Charge, Cost and Luggage Space.</p>
  <div class="methodology"><strong>How we did this:</strong> rankings follow 2025 registration and sales volume in each market (SMMT for the UK, EU/EFTA registrations for Europe, US sales for the Americas). Specs are for a representative trim and vary by configuration. Every verdict and star rating is Volt's own editorial judgment, synthesised from multiple independent published reviews rather than reproduced from any single source.${anyAffiliates ? ` <span class="aff-note">${esc(affiliates.disclosureText)}</span>` : ''}</div>
</section>
<div class="region-nav-wrap">
  <div class="region-nav wrap">
    <span class="region-nav-label" id="regionAuto">Showing prices for</span>
    ${tabs}
  </div>
</div>
${sections}
<script>
(function(){
  var VALID = ['UK','EU','Americas'];
  function pick(){
    var q = new URLSearchParams(location.search).get('region');
    if (q && VALID.indexOf(q) > -1) return q;
    try { var s = localStorage.getItem('voltRegion'); if (s && VALID.indexOf(s) > -1) return s; } catch(e){}
    if (window.__VOLT_REGION && VALID.indexOf(window.__VOLT_REGION) > -1) return window.__VOLT_REGION;
    var lang = (navigator.language || '').toLowerCase();
    if (lang.indexOf('en-gb') === 0) return 'UK';
    if (lang.indexOf('en-us') === 0 || lang.indexOf('en-ca') === 0 || lang.indexOf('es-') === 0 || lang.indexOf('pt-br') === 0) return 'Americas';
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz === 'Europe/London') return 'UK';
      if (tz.indexOf('America/') === 0) return 'Americas';
      if (tz.indexOf('Europe/') === 0) return 'EU';
    } catch(e){}
    return 'EU';
  }
  function show(region, remember){
    VALID.forEach(function(r){
      var sec = document.querySelector('[data-region-section="'+r+'"]');
      var btn = document.querySelector('[data-region-btn="'+r+'"]');
      if (sec) sec.hidden = (r !== region);
      if (btn) btn.classList.toggle('active', r === region);
    });
    if (remember) { try { localStorage.setItem('voltRegion', region); } catch(e){} }
    document.documentElement.setAttribute('data-volt-region', region);
  }
  var initial = pick();
  show(initial, false);
  var lbl = document.getElementById('regionAuto');
  if (lbl && window.__VOLT_COUNTRY) lbl.textContent = 'Detected ' + window.__VOLT_COUNTRY + ' — showing';
  VALID.forEach(function(r){
    var btn = document.querySelector('[data-region-btn="'+r+'"]');
    if (btn) btn.addEventListener('click', function(){ show(r, true); });
  });
  // Affiliate click tracking hook (no-op until an analytics provider is added)
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a.cta-btn');
    if (!a) return;
    var payload = { car: a.dataset.car, partner: a.dataset.partner, region: document.documentElement.getAttribute('data-volt-region') };
    if (window.plausible) window.plausible('Affiliate Click', { props: payload });
    if (window.gtag) window.gtag('event', 'affiliate_click', payload);
  });
})();
</script>`;

  return page({
    title: 'The Most Popular Electric Cars, Rated & Compared — Volt Magazine',
    description: 'Seventy-five best-selling EVs across the UK, EU and Americas, each priced in local currency and rated on comfort, performance, range, charging speed, cost and luggage space.',
    bodyHtml: body,
  });
}

// ---------- other pages ----------
function buildHome() {
  const hero = findPost(HERO_SLUG);
  const rest = HOME_ORDER.map(findPost).filter(Boolean);
  const body = `<section class="wrap hero">
  <div class="hero-issue">${hero.categories[0]}</div>
  <a href="/posts/${hero.slug}/"><h1>${esc(hero.headline)}</h1></a>
  <p class="dek">${esc(hero.subhead)}</p>
  <div class="meta">${fmtDate(hero.date)} &middot; ${hero.author}</div>
</section>
<section class="wrap grid-section">
  <div class="section-title">Latest Reporting</div>
  <div class="card-grid">
    <a class="card compare-teaser-card" href="/compare/">
      <div>
        <span class="tag arc">EV Revolution &middot; New</span>
        <h3>The Most Popular Electric Cars, Rated and Compared</h3>
        <p>Seventy-five best-sellers across the UK, EU and Americas &mdash; priced in your currency and scored on Comfort, Performance, Range, Speed to Charge, Cost and Luggage Space.</p>
      </div>
      <span class="cta">Explore the comparison &rarr;</span>
    </a>
    ${rest.map(articleCard).join('\n    ')}
  </div>
</section>`;
  return page({
    title: 'Volt — The Electricity Magazine',
    description: 'In-depth journalism covering energy, power systems, and the electric future of our world.',
    bodyHtml: body,
  });
}

function buildCategory(cat) {
  const items = posts.filter(p => p.categories.includes(cat)).sort((a, b) => new Date(b.date) - new Date(a.date));
  const body = `<section class="wrap grid-section">
  <div class="hero-issue" style="margin-top:24px">Section</div>
  <h1 style="font-size:2.2rem;margin-bottom:28px">${cat}</h1>
  <div class="card-grid">
    ${items.map(articleCard).join('\n    ')}
  </div>
</section>`;
  return page({ title: `${cat} — Volt Magazine`, description: `Volt Magazine reporting on ${cat}.`, activeCategory: cat, bodyHtml: body });
}

function buildPost(p) {
  const body = `<article class="wrap">
  <header class="article-header">
    <span class="tag">${p.categories[0]}</span>
    <h1>${esc(p.headline)}</h1>
    <p class="dek">${esc(p.subhead)}</p>
    <div class="byline">By ${p.author} &middot; ${fmtDate(p.date)}</div>
  </header>
  <div class="article-prose">
    ${p.bodyHtml}
  </div>
  <a class="back-link" href="/">&larr; Back to Volt</a>
</article>`;
  return page({
    title: `${p.headline} — Volt Magazine`,
    description: p.subhead,
    activeCategory: p.categories.find(c => NAV_CATEGORIES.includes(c)),
    bodyHtml: body,
  });
}

// ---------- write ----------
function write(rel, content) {
  const full = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// car photos are downloaded into car-images/ by fetch_car_images.js (build step)
const carsSrc = path.join(ROOT, 'car-images');
if (fs.existsSync(carsSrc)) {
  const carsDest = path.join(DIST, 'assets/cars');
  fs.mkdirSync(carsDest, { recursive: true });
  fs.cpSync(carsSrc, carsDest, { recursive: true });
}

write('index.html', buildHome());
write('compare/index.html', buildCompare());
NAV_CATEGORIES.forEach(cat => write(`category/${cat}/index.html`, buildCategory(cat)));
posts.forEach(p => write(`posts/${p.slug}/index.html`, buildPost(p)));
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
fs.copyFileSync(path.join(ROOT, 'style.css'), path.join(DIST, 'assets/style.css'));
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

const urls = ['/', '/compare/', ...NAV_CATEGORIES.map(c => `/category/${encodeURIComponent(c)}/`), ...posts.map(p => `/posts/${p.slug}/`)];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n</urlset>\n`);

const totalCars = REGIONS.reduce((a, r) => a + r.cars.length, 0);
const photoCount = Object.values(imagesManifest).reduce((a, v) => a + v.length, 0);
console.log(`Built ${posts.length} posts, ${NAV_CATEGORIES.length} categories, ${REGIONS.length} regions / ${totalCars} cars, ${photoCount} photos.`);
