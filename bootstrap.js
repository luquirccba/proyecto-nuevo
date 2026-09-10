const nativeFetch = globalThis.fetch.bind(globalThis);
const EDGE_HOST = 'ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa';

globalThis.fetch = async (input, init) => {
  const response = await nativeFetch(input, init);
  const url = typeof input === 'string' ? input : input?.url || '';
  if (!String(url).includes(EDGE_HOST)) return response;

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  let body = await response.text();

  // Checkout: Tuconi's no ofrece envios. Mostrar solamente retiro y ocultar
  // campos que solo tendrian sentido para envios.
  body = body
    .replaceAll('Retiro / punto de entrega', 'Retiro')
    .replace(/<label>Dirección si corresponde<\/label>\s*<input name="delivery_address">/gi, '')
    .replace(/<label>DIRECCIÓN SI CORRESPONDE<\/label>\s*<input[^>]*name="delivery_address"[^>]*>/gi, '')
    .replace(/<option value="shipping">Envío<\/option>/gi, '');

  const headers = new Headers(response.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.delete('content-length');

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};

await import('./server.js');
