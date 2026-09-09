import express from 'express';

const app = express();
const PORT = Number(process.env.PORT || 10000);
const EDGE_BASE = process.env.EDGE_BASE || 'https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa';

app.get('/health', (_req,res)=>res.json({ok:true,service:'tuconis-render-proxy'}));

app.use(async (req,res) => {
  try {
    const suffix = req.originalUrl === '/' ? '' : req.originalUrl;
    const target = EDGE_BASE + suffix;
    const headers = new Headers();
    for (const [k,v] of Object.entries(req.headers)) {
      if (v == null) continue;
      const key = k.toLowerCase();
      if (['host','content-length','connection'].includes(key)) continue;
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
      if (['content-length','content-encoding','transfer-encoding','connection','content-type'].includes(lower)) return;
      if (lower === 'location') {
        const publicBase = `${req.protocol}://${req.get('host')}`;
        value = value.replace(EDGE_BASE, publicBase);
        value = value.replace('https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa', publicBase);
      }
      res.setHeader(key,value);
    });

    // Supabase Edge may label generated HTML as text/plain at the gateway.
    // The storefront/admin endpoints are HTML, so force the browser-safe MIME type here.
    if (req.path === '/' || req.path === '/admin' || upstreamType.includes('text/html')) {
      res.setHeader('Content-Type','text/html; charset=utf-8');
    } else if (upstreamType) {
      res.setHeader('Content-Type', upstreamType);
    }

    const body = Buffer.from(await upstream.arrayBuffer());
    res.end(body);
  } catch (err) {
    console.error(err);
    res.status(502).type('text/plain').send('No se pudo conectar con el backend de Tuconi\'s.');
  }
});

app.listen(PORT,'0.0.0.0',()=>console.log(`Tuconi's proxy listening on ${PORT}`));
