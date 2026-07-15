const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, 'public');

const state = {
  home: { id: 'home-1', name: 'Casa Principal', temperature: 24.5, security: 'Ativo', consumption: 12.4 },
  rooms: [
    { id: 'living', name: 'Sala de Estar', temperature: 24.5, devices: 4 },
    { id: 'kitchen', name: 'Cozinha', temperature: 24.0, devices: 5 },
    { id: 'bedroom', name: 'Quarto', temperature: 23.0, devices: 3 },
    { id: 'garage', name: 'Garagem', temperature: 22.0, devices: 2 },
    { id: 'outdoor', name: 'Área Externa', temperature: 22.5, devices: 6 }
  ],
  scenes: [
    { id: 'morning', name: 'Bom dia', icon: '☀️', actions: 7 },
    { id: 'cinema', name: 'Noite de Cinema', icon: '🎬', actions: 5 },
    { id: 'away', name: 'Sair de Casa', icon: '🏠', actions: 4 },
    { id: 'sleep', name: 'Noite de Sono', icon: '🌙', actions: 6 }
  ],
  devices: [
    { id: 'light-living', name: 'Lâmpada Sala', room: 'Sala de Estar', type: 'Luz', icon: '💡', state: { on: true } },
    { id: 'outlet-tv', name: 'Tomada TV', room: 'Sala de Estar', type: 'Tomada', icon: '🔌', state: { on: true } },
    { id: 'climate-bedroom', name: 'Ar Condicionado', room: 'Quarto', type: 'Climatização', icon: '❄️', state: { on: true, temperature: 22 } },
    { id: 'camera-front', name: 'Câmera Frontal', room: 'Área Externa', type: 'Câmera', icon: '📹', state: { live: true } },
    { id: 'gate-garage', name: 'Portão Eletrônico', room: 'Garagem', type: 'Acesso', icon: '🚪', state: { open: false } },
    { id: 'sensor-motion', name: 'Sensor Movimento', room: 'Corredor', type: 'Sensor', icon: '〽️', state: { lastMotion: '09:32' } },
    { id: 'light-bedroom', name: 'Lâmpada Quarto', room: 'Quarto', type: 'Luz', icon: '💡', state: { on: false } },
    { id: 'fan-bedroom', name: 'Ventilador', room: 'Quarto', type: 'Climatização', icon: '🌀', state: { on: false } }
  ]
};

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) });
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

function serveStatic(urlPath, res) {
  const requested = urlPath === '/' ? '/index.html' : urlPath;
  const normalized = path.normalize(requested).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, normalized);
  if (!filePath.startsWith(PUBLIC_DIR) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return false;
  const type = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' }[path.extname(filePath)] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname === '/api/health') return json(res, 200, { status: 'ok', version: '0.1.0-alpha' });
    if (url.pathname === '/api/dashboard') {
      const active = state.devices.filter(device => device.state.on || device.state.live).length;
      return json(res, 200, { home: state.home, rooms: state.rooms, scenes: state.scenes, devices: state.devices, totals: { devices: state.devices.length, active } });
    }
    const stateMatch = url.pathname.match(/^\/api\/devices\/([^/]+)\/state$/);
    if (stateMatch && req.method === 'PATCH') {
      const device = state.devices.find(item => item.id === stateMatch[1]);
      if (!device) return json(res, 404, { error: 'Dispositivo não encontrado' });
      device.state = { ...device.state, ...(await readBody(req)) };
      return json(res, 200, device);
    }
    const sceneMatch = url.pathname.match(/^\/api\/scenes\/([^/]+)\/activate$/);
    if (sceneMatch && req.method === 'POST') {
      const scene = state.scenes.find(item => item.id === sceneMatch[1]);
      if (!scene) return json(res, 404, { error: 'Cena não encontrada' });
      if (scene.id === 'away') state.devices.forEach(device => { if ('on' in device.state) device.state.on = false; });
      if (scene.id === 'morning') state.devices.find(device => device.id === 'light-living').state.on = true;
      return json(res, 200, { activated: true, scene, devices: state.devices });
    }
    if (!url.pathname.startsWith('/api/') && serveStatic(url.pathname, res)) return;
    return json(res, 404, { error: 'Rota não encontrada' });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Erro interno' });
  }
});

server.listen(PORT, '0.0.0.0', () => console.log(`HYBRID Home Assistant em http://localhost:${PORT}`));
