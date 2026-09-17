import{readFileSync,writeFileSync}from'node:fs';
let s=readFileSync(new URL('./proxy-v34.js',import.meta.url),'utf8');
s=s.replace(".adminlegacy{display:none!important}",".adminlegacy{display:none!important}.socialfooter{position:relative;z-index:2;text-align:center;padding:34px 12px 26px;font-family:Arial,sans-serif;font-size:14px;font-weight:600;letter-spacing:.4px}.socialfooter a{color:#eee8df;text-decoration:none;margin:0 12px;border-bottom:1px solid #ef3030;padding-bottom:3px}.socialfooter a:hover{color:#ef3030}");
s=s.replaceAll("<button class=btn onclick=\"tcAdd('${id}')\">Agregar al carrito</button>","<button type=button class=\"btn addcart\" data-model=\"${id}\">Agregar al carrito</button>");
s=s.replace("document.addEventListener('DOMContentLoaded',tcRender);</script>","document.addEventListener('DOMContentLoaded',()=>{tcRender();document.addEventListener('click',e=>{let b=e.target.closest('.addcart');if(b){e.preventDefault();tcAdd(b.dataset.model,1)}})});</script>");
s=s.replace("${cards()}</main>`))});app.get('/promo'","${cards()}</main><footer class=socialfooter><a href=\"https://www.instagram.com/tuconis/\" target=\"_blank\" rel=\"noopener\">Instagram · @tuconis</a><a href=\"https://www.youtube.com/@Tuconis\" target=\"_blank\" rel=\"noopener\">YouTube · @Tuconis</a></footer>`))});app.get('/promo'");
// Public pricing: transfer 30k, Mercado Pago 32.5k; promo is transfer-only.
s=s.replace("<div class=price>1 GORRA · $30.000</div>","<div class=price>1 GORRA · $30.000 TRANSFERENCIA<br><small>$32.500 MERCADO PAGO (DÉBITO / CRÉDITO)</small></div>");
s=s.replace("2 GORRAS · $50.000<br><small>Elegí cualquier combinación →</small>","2 GORRAS · $50.000<br><small>SOLO TRANSFERENCIA · primeras 10 gorras (5 pares)<br>Elegí cualquier combinación →</small>");
s=s.replace("<p>Podés combinar colores o elegir dos iguales. La promo se suma a lo que ya tengas en el carrito.</p>","<p>Podés combinar colores o elegir dos iguales. <b>Promoción exclusiva abonando por transferencia directa.</b> No disponible con débito ni crédito.</p>");
// Checkout explains and dynamically shows the amount for the selected payment method.
s=s.replace("<b>Forma de pago</b>","<b>Forma de pago</b><p style=\"font-size:14px\">Transferencia: $30.000 c/u y, mientras haya cupo, promo 2×$50.000. Mercado Pago (débito/crédito): $32.500 por gorra, sin promoción.</p>");
s=s.replace("function syncCheckout(){let c=tcGet(),n=tcQty();ci.value=JSON.stringify(c);", "function payTotal(n){let m=document.querySelector('[name=payment_method]:checked')?.value;if(m==='mercadopago')return n*32500;return tcPrice(n)}function syncCheckout(){let c=tcGet(),n=tcQty();ci.value=JSON.stringify(c);");
s=s.replace("$'+tcPrice(n).toLocaleString('es-AR')+'", "$'+payTotal(n).toLocaleString('es-AR')+'");
s=s.replace("Mientras haya cupo promocional, cada par se cobra $50.000 y las unidades restantes $30.000 c/u. El servidor confirma el precio final al crear el pedido.","Por transferencia, mientras haya cupo promocional, cada par se cobra $50.000 y las unidades restantes $30.000 c/u. Con Mercado Pago cada gorra cuesta $32.500 y la promoción no se aplica. El servidor confirma el precio final.");
s=s.replace("document.querySelectorAll('[name=payment_method]').forEach(x=>x.onchange=()=>tr.style.display=x.value==='transfer'&&x.checked?'block':'none');", "document.querySelectorAll('[name=payment_method]').forEach(x=>x.onchange=()=>{tr.style.display=x.value==='transfer'&&x.checked?'block':'none';syncCheckout()});");
s=s.replaceAll("v=38","v=40").replaceAll("v=39","v=40").replace("service:'tuconis-v38'","service:'tuconis-v40'").replace("service:'tuconis-v39'","service:'tuconis-v40'");
writeFileSync(new URL('./proxy-runtime-v40.js',import.meta.url),s);
await import('./proxy-runtime-v40.js');
