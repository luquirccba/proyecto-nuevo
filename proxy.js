import express from 'express';
import { readFileSync } from 'node:fs';

const app = express();
const PORT = Number(process.env.PORT || 10000);
const EDGE_BASE = process.env.EDGE_BASE || 'https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa';
const EDGE_PATH = '/functions/v1/tuconis-preventa';
const RECEIPTS_BASE = 'https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-receipts';
const CHECKOUT_V2_BASE = 'https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-checkout-v2';
const NEON_BUFFER = readFileSync(new URL('./assets/logo-neon.webp', import.meta.url));
const WATERMARK_BUFFER = readFileSync(new URL('./assets/logo-watermark.webp', import.meta.url));
const LOGO_IMG = `<img class="tuconis-brand-logo" alt="Club Tuconi's" src="/brand-logo.webp?v=6">`;

function mpNavigationPage(url) {
  const safe = String(url).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${safe}"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Abriendo Mercado Pago…</title></head><body style="background:#222426;color:#eee8df;font-family:Arial,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0"><main style="text-align:center;padding:24px"><h2>Abriendo Mercado Pago…</h2><p>Si no se abre automáticamente, usá el botón.</p><a href="${safe}" style="display:inline-block;background:#d93a3a;color:white;text-decoration:none;padding:14px 18px;border-radius:10px;font-weight:700">Continuar a Mercado Pago</a></main></body></html>`;
}

app.get('/health', (_req,res) => res.json({ok:true,service:'tuconis-render-proxy-v18'}));
for (const path of ['/brand-logo.webp','/assets/logo-neon.webp']) app.get(path, (_req,res) => { res.type('image/webp'); res.setHeader('Cache-Control','no-store'); res.send(NEON_BUFFER); });
for (const path of ['/brand-watermark.webp','/assets/logo-watermark.webp']) app.get(path, (_req,res) => { res.type('image/webp'); res.setHeader('Cache-Control','no-store'); res.send(WATERMARK_BUFFER); });
app.get('/theme.css', (_req,res) => { res.type('text/css').setHeader('Cache-Control','no-store'); res.send(readFileSync(new URL('./theme.css', import.meta.url),'utf8')); });
app.get('/brand-overrides.css', (_req,res) => { res.type('text/css').setHeader('Cache-Control','no-store'); res.send(readFileSync(new URL('./brand-overrides.css', import.meta.url),'utf8')); });

app.use(async (req,res) => {
  try {
    const publicBase = `${req.protocol}://${req.get('host')}`;
    const parsed = new URL(req.originalUrl || '/', publicBase);
    let pathname = parsed.pathname || '/';
    if (pathname.startsWith(EDGE_PATH)) pathname = pathname.slice(EDGE_PATH.length) || '/';
    const isOrderRoute = pathname.startsWith('/order/');
    const orderNumber = isOrderRoute ? pathname.slice('/order/'.length) : '';
    const target = isOrderRoute ? `${RECEIPTS_BASE}/${encodeURIComponent(orderNumber)}${parsed.search || ''}` : (req.method === 'POST' && pathname === '/checkout') ? CHECKOUT_V2_BASE : EDGE_BASE + (pathname === '/' ? (parsed.search || '') : pathname + (parsed.search || ''));
    const headers = new Headers();
    for (const [k,v] of Object.entries(req.headers)) { if (v == null) continue; const key=k.toLowerCase(); if (['host','content-length','connection','accept-encoding'].includes(key)) continue; headers.set(k,Array.isArray(v)?v.join(','):String(v)); }
    headers.set('x-forwarded-host',req.get('host')); headers.set('x-forwarded-proto',req.protocol);
    const init={method:req.method,headers,redirect:'manual'}; if(!['GET','HEAD'].includes(req.method)){init.body=req;init.duplex='half';}
    const upstream=await fetch(target,init); const upstreamType=upstream.headers.get('content-type')||'';
    if(req.method==='POST'&&pathname==='/checkout'&&upstream.status>=300&&upstream.status<400){const loc=upstream.headers.get('location')||'';if(/^https:\/\/(?:www\.|sandbox\.)?mercadopago\.com\.ar\//i.test(loc)){res.status(200);res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','no-store');return res.send(mpNavigationPage(loc));}return res.redirect(303,loc.replace('https://tuconis-preventa.onrender.com',publicBase));}
    upstream.headers.forEach((value,key)=>{const lower=key.toLowerCase();if(['content-length','content-encoding','transfer-encoding','connection','content-type','content-security-policy','content-security-policy-report-only','x-content-type-options'].includes(lower))return;if(lower==='location')value=value.replaceAll(EDGE_BASE,publicBase).replaceAll(RECEIPTS_BASE,`${publicBase}/order`).replaceAll('https://tuconis-preventa.onrender.com',publicBase).replaceAll(EDGE_PATH,'');res.setHeader(key,value);});
    const isHtml=pathname==='/'||pathname==='/checkout'||pathname==='/admin'||pathname.startsWith('/admin/')||pathname.startsWith('/order/')||upstreamType.includes('text/html');
    if(isHtml){
      let body=await upstream.text();
      body=body.replaceAll(EDGE_BASE,publicBase).replaceAll(RECEIPTS_BASE,`${publicBase}/order`).replaceAll('https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa',publicBase).replaceAll('https://tuconis-preventa.onrender.com',publicBase).replaceAll(EDGE_PATH+'/admin','/admin').replaceAll(EDGE_PATH,'/').replaceAll('Retiro / punto de entrega','Retiro').replace(/<option value=["']shipping["']>Envío<\/option>/gi,'').replace(/<label>Dirección si corresponde<\/label>\s*<input[^>]*name=["']delivery_address["'][^>]*>/gi,'').replace(/<label>DIRECCIÓN SI CORRESPONDE<\/label>\s*<input[^>]*name=["']delivery_address["'][^>]*>/gi,'');
      body=body.replace(/<a([^>]*?)href=["'][^"']*["']([^>]*?)>\s*(?:←\s*)?(?:Tienda|Ver tienda)\s*<\/a>/i,'<a$1href="/"$2>⌂ Home</a>');
      body=body.replace(/<svg[^>]*class=["'][^"']*\blogo\b[^"']*["'][\s\S]*?<\/svg>/gi,'').replace(/<img[^>]*class=["'][^"']*\blogo\b[^"']*["'][^>]*>/gi,'').replace(/<img[^>]*class=["'][^"']*tuconis-brand-logo[^"']*["'][^>]*>/gi,'');
      if(/<div class=["']top["']>/i.test(body)) body=body.replace(/<div class=["']top["']>/i,`<div class="top"><div class="tuconis-logo-slot">${LOGO_IMG}</div>`); else body=body.replace(/<body([^>]*)>/i,`<body$1><div class="top"><div class="tuconis-logo-slot">${LOGO_IMG}</div></div>`);
      body=body.replace(/<h2>Entrega<\/h2>[\s\S]*?<label>Modalidad<\/label>[\s\S]*?<select name=["']delivery_method["'][^>]*>[\s\S]*?<\/select>/i,'<h2>Entrega</h2><input type="hidden" name="delivery_method" value="pickup"><div style="padding:14px 16px;border:1px solid #5b5a58;border-radius:12px;background:#242729"><b>Retiro</b><br><span style="color:#cfc8bd;font-size:13px">Coordinaremos el retiro por WhatsApp.</span></div>');
      if(pathname==='/')body=body.replace(/<div class=["']price["']>[\s\S]*?<\/div>/i,'').replace(/<div class=["']chip["'][^>]*>\s*Después:[\s\S]*?<\/div>/i,'').replace(/<section class=["']products["']>/i,'<section class="products home-carousel">');
      if(pathname==='/checkout'&&req.method==='GET')body=body.replace(/>Negra</gi,'>GRIS/NEGRA<').replace(/>NEGRA</g,'>GRIS/NEGRA<').replace(/<div class=["']card["']>\s*<b style=["'][^"']*["']>[^<]+<\/b>\s*por unidad\s*(<button[\s\S]*?<\/button>)\s*<\/div>/i,`<div class="card"><h2>Precios</h2><div class="checkout-pricing"><div><span>Preventa · transferencia</span><b>$ 30.000</b></div><div><span>Preventa · Mercado Pago</span><b>$ 32.500</b></div><div><span>Venta general · cualquier medio</span><b>$ 33.500</b></div></div>$1</div>`);
      const hasHomeLink=/<a[^>]*href=["']\/["'][^>]*>\s*(?:⌂\s*)?Home\s*<\/a>/i.test(body);if(pathname!=='/'&&!hasHomeLink&&!body.includes('class="home-float"'))body=body.replace('</body>','<a class="home-float" href="/">⌂ Home</a></body>');
      body=body.replace(/\/theme\.css\?v=\d+/g,'/theme.css?v=18').replace(/\/brand-overrides\.css\?v=\d+/g,'/brand-overrides.css?v=6');
      if(!body.includes('/theme.css'))body=body.replace('</head>','<link rel="stylesheet" href="/theme.css?v=18"></head>');if(!body.includes('/brand-overrides.css'))body=body.replace('</head>','<link rel="stylesheet" href="/brand-overrides.css?v=6"></head>');
      res.status(upstream.status);res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, proxy-revalidate');res.setHeader('Pragma','no-cache');res.setHeader('Expires','0');res.setHeader('Content-Security-Policy',"default-src 'self' https: data:; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");return res.send(body);
    }
    res.status(upstream.status);if(upstreamType)res.setHeader('Content-Type',upstreamType);return res.end(Buffer.from(await upstream.arrayBuffer()));
  }catch(err){console.error(err);res.status(502).type('text/plain').send("No se pudo conectar con el backend de Tuconi's.");}
});
app.listen(PORT,'0.0.0.0',()=>console.log(`Tuconi's proxy v18 listening on ${PORT}`));