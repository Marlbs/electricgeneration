// Build-time image fetcher.
// Resolves each Wikimedia Commons file to a real thumbnail URL via the Commons API,
// downloads it, and writes it into dist/assets/cars/ so the site self-hosts its images
// (no hotlinking). Safe to run offline: it simply skips what it cannot fetch and the
// templates fall back to a styled placeholder.

const fs = require('fs');
const path = require('path');

const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'VoltMagazine/1.0 (https://electricgeneration.com) image-build';
const OUT_DIR = path.join(__dirname, 'car-images');
const WIDTH = 900;

const sleep = ms => new Promise(r => setTimeout(r, ms));

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function apiJson(params) {
  const url = API + '?' + new URLSearchParams({ format: 'json', ...params });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('API HTTP ' + res.status);
  return res.json();
}

async function resolveThumbs(files) {
  // files: array of "Name.jpg" (no File: prefix). Returns Map name -> thumbUrl
  const map = new Map();
  for (let i = 0; i < files.length; i += 20) {
    const batch = files.slice(i, i + 20).map(f => 'File:' + f);
    try {
      const j = await apiJson({
        action: 'query', titles: batch.join('|'),
        prop: 'imageinfo', iiprop: 'url', iiurlwidth: String(WIDTH),
      });
      const pages = (j.query && j.query.pages) || {};
      for (const p of Object.values(pages)) {
        const ii = p.imageinfo && p.imageinfo[0];
        if (!ii) continue;
        map.set(p.title.replace(/^File:/, ''), ii.thumburl || ii.url);
      }
    } catch (e) {
      console.warn('  [images] api batch failed:', e.message);
    }
    await sleep(250);
  }
  return map;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) throw new Error('suspiciously small');
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function main() {
  const images = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/images.json'), 'utf8'));
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const allFiles = [];
  for (const list of Object.values(images)) for (const im of list) allFiles.push(im.file);
  console.log(`[images] resolving ${allFiles.length} Commons files...`);

  let thumbs = new Map();
  try {
    thumbs = await resolveThumbs([...new Set(allFiles)]);
  } catch (e) {
    console.warn('[images] could not reach Commons API:', e.message);
  }

  const manifest = {};
  let ok = 0, fail = 0;

  for (const [model, list] of Object.entries(images)) {
    manifest[model] = [];
    for (let i = 0; i < list.length; i++) {
      const im = list[i];
      const ext = (im.file.match(/\.(jpe?g|png)$/i) || ['.jpg'])[0].toLowerCase();
      const localName = `${slug(model)}-${i + 1}${ext === '.jpeg' ? '.jpg' : ext}`;
      const dest = path.join(OUT_DIR, localName);
      const entry = {
        src: `/assets/cars/${localName}`,
        kind: im.kind, license: im.license, licenseUrl: im.licenseUrl,
        author: im.author, source: im.source,
      };
      if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
        manifest[model].push(entry); ok++; continue;
      }
      const url = thumbs.get(im.file);
      if (!url) { fail++; continue; }
      try {
        await download(url, dest);
        manifest[model].push(entry);
        ok++;
      } catch (e) {
        console.warn(`  [images] ${model} #${i + 1} failed: ${e.message}`);
        fail++;
      }
      await sleep(120);
    }
  }

  fs.writeFileSync(path.join(__dirname, 'data/images_manifest.json'), JSON.stringify(manifest, null, 2));
  const covered = Object.values(manifest).filter(v => v.length).length;
  console.log(`[images] downloaded ${ok}, failed ${fail}; ${covered}/${Object.keys(images).length} models have photos.`);
}

main().catch(e => { console.error('[images] fatal:', e.message); process.exit(0); });
