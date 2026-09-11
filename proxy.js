import express from 'express';
import { readFileSync } from 'node:fs';

const app = express();
const PORT = Number(process.env.PORT || 10000);
const EDGE_BASE = process.env.EDGE_BASE || 'https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-origin';
const RECEIPTS_BASE = 'https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-receipts';
const CHECKOUT_V2_BASE = 'https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-checkout-v2';
const NEON = readFileSync(new URL('./assets/logo-neon.webp', import.meta.url));
const WATERMARK = readFileSync(new URL('./assets/logo-watermark.webp', import.meta.url));

function mpNavigationPage(url){const safe=String(url).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${safe}"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Abriendo Mercado Pago…</title></head><body style="background:#222426;color:#eee8df;font-family:Arial,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0"><main style="text-align:center;padding:24px"><h2>Abriendo Mercado Pago…</h2><p>Si no se abre automáticamente, usá el botón.</p><a href="${safe}" style="display:inline-block;background:#d93a3a;color:white;text-decoration:none;padding:14px 18px;border-radius:10px;font-weight:700">Continuar a Mercado Pago</a></main></body></html>`;}

app.get('/health',(_req,res)=>res.json({ok:true,service:'tuconis-render-proxy-v24',branding:'independent-render-layer'}));
app.get('/brand-logo.webp',(_req,res)=>{res.status(200).set({'Content-Type':'image/webp','Cache-Control':'no-store','Content-Length':String(NEON.length)}).end(NEON);});
app.get('/brand-watermark.webp',(_req,res)=>{res.status(200).set({'Content-Type':'image/webp','Cache-Control':'no-store','Content-Length':String(WATERMARK.length)}).end(WATERMARK);});

app.use(async(req,res)=>{
 try{
  const publicBase=`${req.protocol}://${req.get('host')}`;const parsed=new URL(req.originalUrl||'/',publicBase);const pathname=parsed.pathname||'/';const isOrder=pathname.startsWith('/order/');const orderNumber=isOrder?pathname.slice(7):'';
  const target=isOrder?`${RECEIPTS_BASE}/${encodeURIComponent(orderNumber)}${parsed.search||''}`:(req.method==='POST'&&pathname==='/checkout')?CHECKOUT_V2_BASE:EDGE_BASE+(pathname==='/'?(parsed.search||''):pathname+(parsed.search||''));
  const headers=new Headers();for(const [k,v] of Object.entries(req.headers)){if(v==null)continue;const key=k.toLowerCase();if(['host','content-length','connection','accept-encoding'].includes(key))continue;headers.set(k,Array.isArray(v)?v.join(','):String(v));}headers.set('x-forwarded-host',req.get('host'));headers.set('x-forwarded-proto',req.protocol);
  const init={method:req.method,headers,redirect:'manual'};if(!['GET','HEAD'].includes(req.method)){init.body=req;init.duplex='half';}
  const upstream=await fetch(target,init);const type=upstream.headers.get('content-type')||'';
  if(req.method==='POST'&&pathname==='/checkout'&&upstream.status>=300&&upstream.status<400){const loc=upstream.headers.get('location')||'';if(/^https:\/\/(?:www\.|sandbox\.)?mercadopago\.com\.ar\//i.test(loc)){res.status(200).setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','no-store');return res.send(mpNavigationPage(loc));}return res.redirect(303,loc.replaceAll(EDGE_BASE,publicBase).replace('https://tuconis-preventa.onrender.com',publicBase));}
  upstream.headers.forEach((value,key)=>{const lower=key.toLowerCase();if(['content-length','content-encoding','transfer-encoding','connection','content-type','content-security-policy','content-security-policy-report-only','x-content-type-options'].includes(lower))return;if(lower==='location')value=value.replaceAll(EDGE_BASE,publicBase).replaceAll(RECEIPTS_BASE,`${publicBase}/order`).replaceAll('https://tuconis-preventa.onrender.com',publicBase);res.setHeader(key,value);});
  const isHtml=type.includes('text/html')||pathname==='/'||pathname==='/checkout'||pathname==='/admin'||pathname.startsWith('/admin/')||pathname.startsWith('/order/');
  if(isHtml){let body=await upstream.text();body=body.replaceAll(EDGE_BASE,publicBase).replaceAll('https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa',publicBase).replaceAll('https://tuconis-preventa.onrender.com',publicBase).replaceAll('Retiro / punto de entrega','Retiro').replace(/<option value=["']shipping["']>Envío<\/option>/gi,'').replace(/<label>Dirección si corresponde<\/label>\s*<input[^>]*name=["']delivery_address["'][^>]*>/gi,'');
   body=body.replace(/<img[^>]*class=["'][^"']*\blogo\b[^"']*["'][^>]*>/gi,'');
   const brandStyle=`<style id="render-brand-v24">#tc-watermark{position:fixed;inset:-30vh -30vw;z-index:0;pointer-events:none;background-image:url('/brand-watermark.webp?v=24');background-repeat:repeat;background-size:360px auto;background-position:center;opacity:.13;transform:rotate(-20deg);transform-origin:center}#tc-brand{position:relative;z-index:2147483646;width:100%;display:flex;justify-content:center;align-items:center;padding:22px 16px 6px;box-sizing:border-box}#tc-brand img{display:block!important;width:min(300px,78vw)!important;height:auto!important;max-height:126px!important;object-fit:contain!important;opacity:1!important;visibility:visible!important}body>*:not(#tc-watermark):not(#tc-brand){position:relative;z-index:1}@media(max-width:760px){#tc-watermark{background-size:280px auto;opacity:.12}#tc-brand{padding-top:16px}#tc-brand img{width:min(270px,82vw)!important;max-height:112px!important}}</style>`;
   const brandHtml=`<div id="tc-watermark" aria-hidden="true"></div><div id="tc-brand"><img src="/brand-logo.webp?v=24" alt="Club Tuconi's"></div>`;
   body=body.replace('</head>',brandStyle+'</head>');body=body.replace(/<body([^>]*)>/i,'<body$1>'+brandHtml);
   body=body.replace(/<a([^>]*?)href=["'][^"']*["']([^>]*?)>\s*(?:←\s*)?(?:Tienda|Ver tienda)\s*<\/a>/i,'<a$1href="/"$2>⌂ Home</a>');
   body=body.replace(/<h2>Entrega<\/h2>[\s\S]*?<label>Modalidad<\/label>[\s\S]*?<select name=["']delivery_method["'][^>]*>[\s\S]*?<\/select>/i,'<h2>Entrega</h2><input type="hidden" name="delivery_method" value="pickup"><div style="padding:14px 16px;border:1px solid #5b5a58;border-radius:12px;background:#242729"><b>Retiro</b><br><span style="color:#cfc8bd;font-size:13px">Coordinaremos el retiro por WhatsApp.</span></div>');
   if(pathname==='/')body=body.replace(/<div class=["']price["']>[\s\S]*?<\/div>/i,'').replace(/<div class=["']chip["'][^>]*>\s*Después:[\s\S]*?<\/div>/i,'').replace(/<section class=["']products["']>/i,'<section class="products home-carousel">');if(pathname==='/checkout'&&req.method==='GET')body=body.replace(/>Negra</gi,'>GRIS/NEGRA<').replace(/>NEGRA</g,'>GRIS/NEGRA<');
   res.status(upstream.status);res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','no-store, no-cache, must-revalidate');res.setHeader('Content-Security-Policy',"default-src 'self' https: data:; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");return res.send(body);}
  res.status(upstream.status);if(type)res.setHeader('Content-Type',type);res.setHeader('Cache-Control','no-store');return res.end(Buffer.from(await upstream.arrayBuffer()));
 }catch(err){console.error(err);res.status(502).type('text/plain').send("No se pudo conectar con el backend de Tuconi's.");}
});
app.listen(PORT,'0.0.0.0',()=>console.log(`Tuconi's proxy v24 listening on ${PORT}`));
