import express from 'express';

const app = express();
const PORT = Number(process.env.PORT || 10000);
const EDGE_BASE = process.env.EDGE_BASE || 'https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa';
const EDGE_PATH = '/functions/v1/tuconis-preventa';

const LOGO_SVG = `<svg class="logo" width="190" height="72" viewBox="0 0 380 145" role="img" aria-label="Club Tuconi's" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <text x="190" y="50" text-anchor="middle" font-family="cursive" font-size="50" font-style="italic" font-weight="700" fill="#ff3b30" stroke="#ff7a59" stroke-width="1.8" filter="url(#glow)">Club</text>
  <text x="190" y="118" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="62" font-weight="900" letter-spacing="1" fill="none" stroke="#ff3b30" stroke-width="5" filter="url(#glow)">TUCONI'S</text>
</svg>`;

app.get('/health', (_req,res)=>res.json({ok:true,service:'tuconis-render-proxy-v3'}));

app.use(async (req,res) => {
  try {
    const publicBase = `${req.protocol}://${req.get('host')}`;
    const parsed = new URL(req.originalUrl || '/', publicBase);
    let pathname = parsed.pathname || '/';

    if (pathname.startsWith(EDGE_PATH)) pathname = pathname.slice(EDGE_PATH.length) || '/';

    const target = EDGE_BASE + (pathname === '/' ? (parsed.search || '') : pathname + (parsed.search || ''));
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
      if (lower === 'location') value = value.replaceAll(EDGE_BASE,publicBase).replaceAll(EDGE_PATH,'');
      res.setHeader(key,value);
    });

    const isHtml = pathname==='/' || pathname==='/checkout' || pathname==='/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/order/') || upstreamType.includes('text/html');

    if (isHtml) {
      let body = await upstream.text();
      body = body
        .replaceAll(EDGE_BASE,publicBase)
        .replaceAll('https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa',publicBase)
        .replaceAll(EDGE_PATH + '/admin','/admin')
        .replaceAll(EDGE_PATH,'/')
        .replaceAll('Retiro / punto de entrega','Retiro')
        .replace(/<option value=["']shipping["']>Envío<\/option>/gi,'')
        .replace(/<label>Dirección si corresponde<\/label>\s*<input[^>]*name=["']delivery_address["'][^>]*>/gi,'')
        .replace(/<label>DIRECCIÓN SI CORRESPONDE<\/label>\s*<input[^>]*name=["']delivery_address["'][^>]*>/gi,'');

      body = body.replace(/<a([^>]*?)href=["'][^"']*["']([^>]*?)>\s*Ver tienda\s*<\/a>/i,'<a$1href="/"$2>Ver tienda</a>');

      // Replace the logo image itself, not just its URL, so it cannot fail to load.
      body = body.replace(/<img[^>]*class=["'][^"']*\blogo\b[^"']*["'][^>]*>/gi, LOGO_SVG);
      if (!body.includes('aria-label="Club Tuconi\'s"') && body.includes('class="top"')) {
        body = body.replace(/<div class="top">/i, `<div class="top">${LOGO_SVG}`);
      }

      // Tuconi's has pickup only: force a single fixed delivery option.
      body = body.replace(/<h2>Entrega<\/h2>[\s\S]*?<label>Modalidad<\/label>[\s\S]*?<select name=["']delivery_method["'][^>]*>[\s\S]*?<\/select>/i,
        '<h2>Entrega</h2><label>Modalidad</label><select name="delivery_method"><option value="pickup">Retiro</option></select><p class="muted">Coordinaremos el retiro por WhatsApp.</p>');

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

app.listen(PORT,'0.0.0.0',()=>console.log(`Tuconi's proxy v3 listening on ${PORT}`));
