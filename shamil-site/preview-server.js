// Local preview for the Shamil website. Not deployed (see .vercelignore).
// Run: node preview-server.js   then open http://localhost:5050
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = __dirname;
// While previewing, /downloads/* is served from the "Shamil Desktop" folder next to this one.
const DL = [path.join(ROOT, '..', 'Shamil Desktop'), path.join(ROOT, '..', 'shamil-builds')].find(p => fs.existsSync(p));
const PORT = Number(process.env.PORT) || 5050;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.json': 'application/json',
  '.zip': 'application/zip', '.exe': 'application/octet-stream' };

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let base = ROOT;
  if (p.startsWith('/downloads/')) { base = DL || ROOT; p = p.slice('/downloads'.length); }
  if (p.endsWith('/')) p += 'index.html';
  const file = path.normalize(path.join(base, p));
  if (!file.startsWith(base)) { res.writeHead(403); return res.end(); }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('Not found: ' + p); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'content-length': st.size });
    fs.createReadStream(file).pipe(res);
  });
}).listen(PORT, '127.0.0.1', () => console.log(`\n  Shamil website preview →  http://localhost:${PORT}\n  (Press Ctrl+C to stop)\n`));
