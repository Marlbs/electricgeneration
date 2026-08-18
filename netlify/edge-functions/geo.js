// Netlify Edge Function: detect visitor country and set a region hint cookie/header
// so the compare page can open on the right regional list and currency.
// Uses Netlify's built-in geolocation — no third-party API, no IP stored.

const EU_EFTA = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU',
  'MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','CH',
]);

const AMERICAS = new Set([
  'US','CA','MX','BR','AR','CL','CO','PE','UY','PY','BO','EC','VE','CR','PA','GT','DO','PR',
]);

function regionFor(code) {
  if (!code) return 'EU';
  if (code === 'GB') return 'UK';
  if (EU_EFTA.has(code)) return 'EU';
  if (AMERICAS.has(code)) return 'Americas';
  return 'EU';
}

export default async (request, context) => {
  const country = context.geo?.country?.code || '';
  const region = regionFor(country);

  const response = await context.next();

  // Only decorate HTML responses
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;

  const html = await response.text();

  // Inject the detected region so the page can select it before first paint.
  const injected = html.replace(
    '</head>',
    `<script>window.__VOLT_REGION=${JSON.stringify(region)};window.__VOLT_COUNTRY=${JSON.stringify(country)};</script></head>`
  );

  const headers = new Headers(response.headers);
  headers.set('x-volt-region', region);
  headers.set('cache-control', 'public, max-age=0, must-revalidate');
  headers.append('vary', 'x-nf-country');

  return new Response(injected, { status: response.status, headers });
};

export const config = { path: ['/', '/compare'] };
