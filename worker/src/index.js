// KABEL · servidor en Cloudflare Workers
// GET /turn → credenciales temporales del relé de audio (Cloudflare Realtime TURN).
// La clave del relé vive como secreto en Cloudflare y nunca llega al navegador.

const ALLOWED_ORIGINS = [
  'https://yerayhalero.github.io',
  'http://localhost:8765'
];
const TTL_SECONDS = 4 * 3600; // las credenciales valen 4 horas: más que un set largo

function corsHeaders(req){
  const origin = req.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function json(req, body, status = 200, extra = {}){
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...corsHeaders(req), ...extra }
  });
}

async function turnCredentials(env){
  const r = await fetch(`https://rtc.live.cloudflare.com/v1/turn/keys/${env.TURN_KEY_ID}/credentials/generate-ice-servers`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.TURN_KEY_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ttl: TTL_SECONDS })
  });
  if (!r.ok) throw new Error('Cloudflare TURN respondió ' + r.status);
  const data = await r.json();
  const list = Array.isArray(data.iceServers) ? data.iceServers : [data.iceServers];
  // Los navegadores bloquean el puerto 53 y esas direcciones solo hacen esperar: se quitan.
  return list
    .filter(Boolean)
    .map(s => ({ ...s, urls: [].concat(s.urls).filter(u => !/:53(\?|$)/.test(u)) }))
    .filter(s => s.urls.length);
}

export default {
  async fetch(req, env){
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(req) });
    if (req.method !== 'GET') return json(req, { error: 'método no permitido' }, 405);

    if (url.pathname === '/turn'){
      if (!env.TURN_KEY_ID || !env.TURN_KEY_API_TOKEN) return json(req, { error: 'Faltan los secretos TURN_KEY_ID y TURN_KEY_API_TOKEN' }, 500);
      try {
        const iceServers = await turnCredentials(env);
        return json(req, { iceServers, ttl: TTL_SECONDS });
      } catch(e){
        return json(req, { error: String(e.message || e) }, 502);
      }
    }

    if (url.pathname === '/' || url.pathname === '/health'){
      return json(req, { ok: true, service: 'kabel-api', turn: !!(env.TURN_KEY_ID && env.TURN_KEY_API_TOKEN) });
    }
    return json(req, { error: 'no encontrado' }, 404);
  }
};
