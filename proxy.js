import express from 'express';
import { readFileSync } from 'node:fs';

const app = express();
const PORT = Number(process.env.PORT || 10000);
const EDGE_BASE = process.env.EDGE_BASE || 'https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa';
const EDGE_PATH = '/functions/v1/tuconis-preventa';
const RECEIPTS_BASE = 'https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-receipts';

const LOGO_SVG = `<svg class="logo" width="220" height="84" viewBox="0 0 380 145" role="img" aria-label="Club Tuconi's" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="glow"><feGaussianBlur stdDeviation="2.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <text x="190" y="48" text-anchor="middle" font-family="cursive" font-size="48" font-style="italic" font-weight="700" fill="#d93a3a" stroke="#ff765f" stroke-width="1.7" filter="url(#glow)">Club</text>
  <text x="190" y="118" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="62" font-weight="900" letter-spacing="1" fill="none" stroke="#d93a3a" stroke-width="5" filter="url(#glow)">TUCONI'S</text>
</svg>`;

app.get('/health', (_req,res)=>res.json({ok:true,service:'tuconis-render-proxy-v5'}));
app.get('/theme.css', (_req,res)=>{
  res.type('text/css').setHeader('Cache-Control','no-store');
  res.send(readFileSync(new URL('./theme.css', import.meta.url),'utf8'));
});

app.use(async (req,res) => {
  try {
    const publicBase = `${req.protocol}://${req.get('host')}`;
    const parsed = new URL(req.originalUrl || '/', publicBase);
    let pathname = parsed.pathname || '/';
    if (pathname.startsWith(EDGE_PATH)) pathname = pathname.slice(EDGE_PATH.length) || '/';

    // Todas las pantallas /order/ pasan por el flujo de comprobantes. Para
    // transferencias, la compra no se considera finalizada hasta adjuntar uno.
    const isOrderRoute = pathname.startsWith('/order/');
    const orderNumber = isOrderRoute ? pathname.slice('/order/'.length) : '';
    const target = isOrderRoute
      ? `${RECEIPTS_BASE}/${encodeURIComponent(orderNumber)}${parsed.search || ''}`
      : EDGE_BASE + (pathname === '/' ? (parsed.search || '') : pathname + (parsed.search || ''));

    const headers = new Headers();
    for (const [k,v] of Object.entries(req.headers)) {
      if (v == null) continue;
      const key = k.toLowerCase();
      if (['host','content-length','connection','accept-encoding'].includes(key)) continue;
      headers.set(k, Array.isArray(v) ? v.join(',') : String(v));
    }

    const init = { method:req.method, headers, redirect:'manual' };
    if (!['GET','HEAD'].includes(req.method)) { init.body=req; init.duplex='half'; }

    const upstream = await fetch(target, init);
    const upstreamType = upstream.headers.get('content-type') || '';

    upstream.headers.forEach((value,key)=>{
      const lower = key.toLowerCase();
      if (['content-length','content-encoding','transfer-encoding','connection','content-type','content-security-policy','content-security-policy-report-only','x-content-type-options'].includes(lower)) return;
      if (lower === 'location') {
        value = value
          .replaceAll(EDGE_BASE,publicBase)
          .replaceAll(RECEIPTS_BASE,`${publicBase}/order`)
          .replaceAll(EDGE_PATH,'');
      }
      res.setHeader(key,value);
    });

    const isHtml = pathname==='/' || pathname==='/checkout' || pathname==='/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/order/') || upstreamType.includes('text/html');

    if (isHtml) {
      let body = await upstream.text();
      body = body
        .replaceAll(EDGE_BASE,publicBase)
        .replaceAll(RECEIPTS_BASE,`${publicBase}/order`)
        .replaceAll('https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa',publicBase)
        .replaceAll(EDGE_PATH + '/admin','/admin')
        .replaceAll(EDGE_PATH,'/')
        .replaceAll('Retiro / punto de entrega','Retiro')
        .replace(/<option value=["']shipping["']>Envío<\/option>/gi,'')
        .replace(/<label>Dirección si corresponde<\/label>\s*<input[^>]*name=["']delivery_address["'][^>]*>/gi,'')
        .replace(/<label>DIRECCIÓN SI CORRESPONDE<\/label>\s*<input[^>]*name=["']delivery_address["'][^>]*>/gi,'');

      body = body.replace(/<a([^>]*?)href=["'][^"']*["']([^>]*?)>\s*Ver tienda\s*<\/a>/i,'<a$1href="/"$2>Ver tienda</a>');

      // Logo visible en las pantallas del storefront y checkout.
      body = body.replace(/<img[^>]*class=["'][^"']*\blogo\b[^"']*["'][^>]*>/gi, LOGO_SVG);
      if (!body.includes('aria-label="Club Tuconi\'s"') && body.includes('class="top"') && !body.includes('class="brand"')) {
        body = body.replace(/<div class="top">/i, `<div class="top">${LOGO_SVG}`);
      }

      // Sólo retiro: sin punto de entrega, dirección ni envíos.
      body = body.replace(/<h2>Entrega<\/h2>[\s\S]*?<label>Modalidad<\/label>[\s\S]*?<select name=["']delivery_method["'][^>]*>[\s\S]*?<\/select>/i,
        '<h2>Entrega</h2><input type="hidden" name="delivery_method" value="pickup"><div style="padding:14px 16px;border:1px solid #5b5a58;border-radius:12px;background:#242729"><b>Retiro</b><br><span style="color:#cfc8bd;font-size:13px">Coordinaremos el retiro por WhatsApp.</span></div>');

      // Paleta inspirada directamente en las tres gorras.
      if (!body.includes('/theme.css')) body = body.replace('</head>','<link rel="stylesheet" href="/theme.css?v=5"></head>');

      res.status(upstream.status);
      res.setHeader('Content-Type','text/html; charset=utf-8');
      res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma','no-cache');
      res.setHeader('Expires','0');
      res.setHeader('Content-Security-Policy',"default-src 'self' https: data:; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
      return res.send(body);
    }

    res.status(upstream.status);
    if (upstreamType) res.setHeader('Content-Type',upstreamType);
    return res.end(Buffer.from(await upstream.arrayBuffer()));
  } catch (err) {
    console.error(err);
    res.status(502).type('text/plain').send("No se pudo conectar con el backend de Tuconi's.");
  }
});

app.listen(PORT,'0.0.0.0',()=>console.log(`Tuconi's proxy v5 listening on ${PORT}`));
