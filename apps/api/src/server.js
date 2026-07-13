const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const PORT = Number(process.env.PORT || 3000);
const WEB_ROOT = path.resolve(__dirname, '../../web/public');

const state = {
  homes: [{ id: 'home-1', name: 'Casa Principal' }],
  rooms: [
    { id: 'room-1', homeId: 'home-1', name: 'Sala' },
    { id: 'room-2', homeId: 'home-1', name: 'Quarto' }
  ],
  devices: [
    { id: 'dev-1', roomId: 'room-1', name: 'Luz Principal', type: 'light', state: { on: true } },
    { id: 'dev-2', roomId: 'room-1', name: 'Ar-condicionado', type: 'climate', state: { on: false, temperature: 23 } },
    { id: 'dev-3', roomId: 'room-2', name: 'Sensor de Temperatura', type: 'sensor', state: { temperature: 24.6 } }
  ]
};

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS'
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1_000_000) reject(new Error('Payload muito grande'));
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch { reject(new Error('JSON inválido')); }
    });
    req.on('error', reject);
  });
}

function serveStatic(req, res) {
  const requestPath = req.url === '/' ? '/index.html' : req.url;
  const safePath = path.normalize(requestPath).replace(/^([.][.][/\\])+/, '');
  const filePath = path.join(WEB_ROOT, safePath);
  if (!filePath.startsWith(WEB_ROOT)) return false;
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return false;
  const ext = path.extname(filePath);
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (url.pathname === '/api/health') return sendJson(res, 200, { status: 'ok', version: '0.1.0' });
    if (url.pathname === '/api/dashboard') {
      return sendJson(res, 200, {
        homes: state.homes.length,
        rooms: state.rooms.length,
        devices: state.devices.length,
        devicesOnline: state.devices.length,
        activeDevices: state.devices.filter(d => d.state.on).length
      });
    }
    if (url.pathname === '/api/homes' && req.method === 'GET') return sendJson(res, 200, state.homes);
    if (url.pathname === '/api/rooms' && req.method === 'GET') return sendJson(res, 200, state.rooms);
    if (url.pathname === '/api/devices' && req.method === 'GET') return sendJson(res, 200, state.devices);

    if (url.pathname === '/api/devices' && req.method === 'POST') {
      const body = await readBody(req);
      if (!body.name || !body.roomId || !body.type) return sendJson(res, 400, { error: 'name, roomId e type são obrigatórios' });
      const device = { id: crypto.randomUUID(), name: body.name, roomId: body.roomId, type: body.type, state: body.state || { on: false } };
      state.devices.push(device);
      return sendJson(res, 201, device);
    }

    const deviceMatch = url.pathname.match(/^\/api\/devices\/([^/]+)\/state$/);
    if (deviceMatch && req.method === 'PATCH') {
      const device = state.devices.find(item => item.id === deviceMatch[1]);
      if (!device) return sendJson(res, 404, { error: 'Dispositivo não encontrado' });
      const body = await readBody(req);
      device.state = { ...device.state, ...body };
      return sendJson(res, 200, device);
    }

    if (!url.pathname.startsWith('/api/') && serveStatic(req, res)) return;
    return sendJson(res, 404, { error: 'Rota não encontrada' });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || 'Erro interno' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`HYBRID Home Assistant v0.1 em http://localhost:${PORT}`);
});
