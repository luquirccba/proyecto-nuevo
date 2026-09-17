import{readFileSync,writeFileSync}from'node:fs';
let s=readFileSync(new URL('./proxy-v34.js',import.meta.url),'utf8');
// Add footer styling and a more logo-like display treatment at 14px.
s=s.replace(".adminlegacy{display:none!important}",".adminlegacy{display:none!important}.socialfooter{position:relative;z-index:2;text-align:center;padding:34px 12px 26px;font-family:Georgia,'Times New Roman',serif;font-size:14px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase}.socialfooter a{color:#eee8df;text-decoration:none;margin:0 12px;border-bottom:1px solid #ef3030;padding-bottom:3px}.socialfooter a:hover{color:#ef3030}");
// Replace inline add-to-cart handlers with data attributes; delegated click handling is more reliable.
s=s.replaceAll("<button class=btn onclick=\"tcAdd('${id}')\">Agregar al carrito</button>","<button type=button class=\"btn addcart\" data-model=\"${id}\">Agregar al carrito</button>");
// Install one delegated listener after DOM load, preserving cart behavior on every storefront page.
s=s.replace("document.addEventListener('DOMContentLoaded',tcRender);</script>","document.addEventListener('DOMContentLoaded',()=>{tcRender();document.addEventListener('click',e=>{let b=e.target.closest('.addcart');if(b){e.preventDefault();tcAdd(b.dataset.model,1)}})});</script>");
// Social contacts requested for the bottom center of the homepage only.
const footer=`<footer class=socialfooter><a href=\"https://www.instagram.com/tuconis/\" target=\"_blank\" rel=\"noopener\">Instagram · @tuconis</a><a href=\"https://www.youtube.com/@Tuconis\" target=\"_blank\" rel=\"noopener\">YouTube · @Tuconis</a></footer>`;
s=s.replace("${cards()}</main>`))});app.get('/promo'","${cards()}</main>${footer}`))});app.get('/promo'");
s=s.replaceAll("v=38","v=39").replace("service:'tuconis-v38'","service:'tuconis-v39'");
writeFileSync(new URL('./proxy-runtime-v39.js',import.meta.url),s);
await import('./proxy-runtime-v39.js');
