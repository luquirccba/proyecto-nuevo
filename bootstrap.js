const nativeFetch = globalThis.fetch.bind(globalThis);
const EDGE_HOST = 'ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa';

globalThis.fetch = async (input, init) => {
  const response = await nativeFetch(input, init);
  const url = typeof input === 'string' ? input : input?.url || '';
  if (!String(url).includes(EDGE_HOST)) return response;

  let body;
  try {
    body = await response.text();
  } catch {
    return response;
  }

  // Always normalize the browser-facing HTML coming from the Edge Function.
  body = body
    .replaceAll('Retiro / punto de entrega', 'Retiro')
    .replace(/<select\s+name=["']delivery_method["'][^>]*>[\s\S]*?<\/select>/gi,
      '<input type="hidden" name="delivery_method" value="pickup"><div style="padding:14px 16px;border:1px solid #484848;border-radius:10px;background:#101112"><b>Retiro</b><br><span style="color:#aaa;font-size:13px">Coordinaremos el retiro por WhatsApp.</span></div>')
    .replace(/<label>Dirección si corresponde<\/label>\s*<input[^>]*name=["']delivery_address["'][^>]*>/gi, '')
    .replace(/<label>DIRECCIÓN SI CORRESPONDE<\/label>\s*<input[^>]*name=["']delivery_address["'][^>]*>/gi, '')
    .replace(/<option\s+value=["']shipping["'][^>]*>\s*Envío\s*<\/option>/gi, '')
    .replace(/<img([^>]*class=["'][^"']*\blogo\b[^"']*["'][^>]*)src=["'][^"']+["']([^>]*)>/gi,
      '<img$1src="/logo.webp"$2>')
    .replace(/<img([^>]*?)src=["'][^"']+["']([^>]*class=["'][^"']*\blogo\b[^"']*["'][^>]*)>/gi,
      '<img$1src="/logo.webp"$2>');

  const headers = new Headers(response.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.delete('content-length');
  headers.delete('content-encoding');

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};

await import('./server.js');
