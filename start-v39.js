import{readFileSync,writeFileSync}from'node:fs';
let s=readFileSync(new URL('./proxy-v34.js',import.meta.url),'utf8');
// Keep the proven v39 storefront fixes.
s=s.replace(".adminlegacy{display:none!important}",".adminlegacy{display:none!important}.socialfooter{position:relative;z-index:2;text-align:center;padding:34px 12px 26px;font-family:Arial,sans-serif;font-size:14px;font-weight:600;letter-spacing:.4px}.socialfooter a{color:#eee8df;text-decoration:none;margin:0 12px;border-bottom:1px solid #ef3030;padding-bottom:3px}.socialfooter a:hover{color:#ef3030}");
s=s.replaceAll("<button class=btn onclick=\"tcAdd('${id}')\">Agregar al carrito</button>","<button type=button class=\"btn addcart\" data-model=\"${id}\">Agregar al carrito</button>");
s=s.replace("document.addEventListener('DOMContentLoaded',tcRender);</script>","document.addEventListener('DOMContentLoaded',()=>{tcRender();document.addEventListener('click',e=>{let b=e.target.closest('.addcart');if(b){e.preventDefault();tcAdd(b.dataset.model,1)}})});</script>");
s=s.replace("${cards()}</main>`))});app.get('/promo'","${cards()}</main><footer class=socialfooter><a href=\"https://www.instagram.com/tuconis/\" target=\"_blank\" rel=\"noopener\">Instagram · @tuconis</a><a href=\"https://www.youtube.com/@Tuconis\" target=\"_blank\" rel=\"noopener\">YouTube · @Tuconis</a></footer>`))});app.get('/promo'");
// v40 payment rules. Backend is authoritative: MP never receives promo and is ARS 32,500 per unit.
s=s.replace("<div class=price>1 GORRA · $30.000</div>","<div class=price>1 GORRA<br><small>TRANSFERENCIA · $30.000</small><br><small>MERCADO PAGO (DÉBITO / CRÉDITO) · $32.500</small></div>");
s=s.replace("2 GORRAS · $50.000<br><small>Elegí cualquier combinación →</small>","2 GORRAS · $50.000<br><small>SOLO TRANSFERENCIA · hasta agotar 5 pares<br>Elegí cualquier combinación →</small>");
s=s.replace("Podés combinar colores o elegir dos iguales. La promo se suma a lo que ya tengas en el carrito.","Podés combinar colores o elegir dos iguales. Promoción exclusiva por transferencia directa. No disponible con débito ni crédito.");
s=s.replace("<div class=pay><b>Forma de pago</b>","<div class=pay><b>Forma de pago</b><p><small>Transferencia: $30.000 por gorra; promo 2 × $50.000 mientras haya cupo. Mercado Pago (débito/crédito): $32.500 por gorra, sin promoción.</small></p>");
s=s.replace("<div class=row><b>Total estimado</b><b>$'+tcPrice(n).toLocaleString('es-AR')+'</b></div>","<div class=row><b>Total</b><b>Se calcula según el medio de pago</b></div>");
s=s.replace("Mientras haya cupo promocional, cada par se cobra $50.000 y las unidades restantes $30.000 c/u. El servidor confirma el precio final al crear el pedido.","Por transferencia, mientras haya cupo promocional, cada par se cobra $50.000 y las unidades restantes $30.000 c/u. Con Mercado Pago cada gorra cuesta $32.500 y la promoción no se aplica. El servidor confirma el total final.");
s=s.replaceAll("v=38","v=40").replace("service:'tuconis-v38'","service:'tuconis-v40'");
writeFileSync(new URL('./proxy-runtime-v40.js',import.meta.url),s);
await import('./proxy-runtime-v40.js');
