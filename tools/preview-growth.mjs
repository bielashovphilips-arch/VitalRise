import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {dirname, resolve, sep, extname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mime = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.xml':'application/xml','.pdf':'application/pdf','.mp4':'video/mp4'};
// Preview is local/read-only. It never opens production databases or sends payments/leads.
export async function startPreview(port = 4174) {
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname.startsWith('/api/')) {
        response.writeHead(503, {'Content-Type':'application/json', 'Cache-Control':'no-store'});
        response.end(JSON.stringify({ok:false, error:'Read-only preview: APIs disabled'})); return;
      }
      if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
      if (pathname.split(/[\\/]/).some(segment => segment.startsWith('.')) || /^\/(?:node_modules|src|tools|docs|functions|partials|video)(?:\/|$)/.test(pathname)) {
        response.writeHead(404); response.end(); return;
      }
      let file = resolve(root, '.' + pathname);
      if (!file.startsWith(root + sep) && file !== root) { response.writeHead(403); response.end(); return; }
      const info = await stat(file).catch(() => null);
      if (info?.isDirectory()) file = resolve(file, 'index.html');
      else if (!info && !extname(file)) file += '.html';
      const body = await readFile(file);
      response.writeHead(200, {'Content-Type':mime[extname(file)] || 'application/octet-stream', 'Content-Length':body.length, 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'});
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch { response.writeHead(404); response.end('Not found'); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  return {server, url:'http://127.0.0.1:' + server.address().port};
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const {url} = await startPreview(Number(process.env.PREVIEW_PORT || 4174));
  process.stdout.write('Read-only VitalRise preview: ' + url + '\n');
}
