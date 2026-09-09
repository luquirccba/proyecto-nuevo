import express from 'express';

const app = express();
const PORT = Number(process.env.PORT || 10000);
const EDGE_BASE = process.env.EDGE_BASE || 'https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa';
const EDGE_PATH = '/functions/v1/tuconis-preventa';

app.get('/health', (_req,res)=>res.json({ok:true,service:'tuconis-render-proxy'}));

app.use(async (req,res) => {
  try {
    const publicBase = `${req.protocol}://${req.get('host')}`;
    const parsed = new URL(req.originalUrl || '/', publicBase);
    let pathname = parsed.pathname || '/';

    // Normalize accidental internal Supabase paths back to public app paths.
    if (pathname.startsWith(EDGE_PATH)) {
      pathname = pathname.slice(EDGE_PATH.length) || '/';
    }

    const search = parsed.search || '';
    const suffix = pathname === '/' ? search : pathname + search;
    const target = EDGE_BASE + suffix;
    const headers = new Headers();

    for (const [k,v] of Object.entries(req.headers)) {
      if (v == null) continue;
      const key = k.toLowerCase();
      if (['host','content-length','connection','accept-encoding'].includes(key)) continue;
      headers.set(k, Array.isArray(v) ? v.join(',') : String(v));
    }

    const init = { method:req.method, headers, redirect:'manual' };
    if (!['GET','HEAD'].includes(req.method)) {
      init.body = req;
      init.duplex = 'half';
    }

    const upstream = await fetch(target, init);
    res.status(upstream.status);

    let upstreamType = '';
    upstream.headers.forEach((value,key)=>{
      const lower = key.toLowerCase();
      if (lower === 'content-type') upstreamType = value;

      if ([
        'content-length','content-encoding','transfer-encoding','connection','content-type',
        'content-security-policy','content-security-policy-report-only','x-content-type-options'
      ].includes(lower)) return;

      if (lower === 'location') {
        value = value.replace(EDGE_BASE, publicBase);
        value = value.replace('https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa', publicBase);
        value = value.replace(EDGE_PATH, '');
      }
      res.setHeader(key,value);
    });

    // IMPORTANT: decide from pathname only; query strings must not affect HTML detection.
    const isHtml = pathname === '/' || pathname === '/admin' || upstreamType.includes('text/html');

    if (isHtml) {
      let body = await upstream.text();
      body = body
        .replaceAll(EDGE_BASE, publicBase)
        .replaceAll('https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa', publicBase)
        .replaceAll(EDGE_PATH + '/admin', '/admin')
        .replaceAll(EDGE_PATH, '/');

      res.status(upstream.status);
      res.type('html');
      res.setHeader('Content-Type','text/html; charset=utf-8');
      res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma','no-cache');
      res.setHeader('Expires','0');
      res.setHeader('Content-Security-Policy', "default-src 'self' https: data:; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
      return res.send(body);
    }

    if (upstreamType) res.setHeader('Content-Type', upstreamType);
    const body = Buffer.from(await upstream.arrayBuffer());
    return res.end(body);
  } catch (err) {
    console.error(err);
    res.status(502).type('text/plain').send('No se pudo conectar con el backend de Tuconi\'s.');
  }
});

app.listen(PORT,'0.0.0.0',()=>console.log(`Tuconi's proxy listening on ${PORT}`));
