const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, 'public');

const state = {
  home: { id: 'home-1', name: 'Casa Principal', temperature: 24.5, security: 'Ativo' },
  scenes: [
    { id: 'scene-morning', name: 'Bom dia', icon: '☀️', actions: 7 },
    { id: 'scene-cinema', name: 'Noite de Cinema', icon: '🎬', actions: 5 },
    { id: 'scene-away', name: 'Sair de Casa', icon: '🏠', actions: 4 },
    { id: 'scene-sleep', name: 'Noite de Sono', icon: '🌙', actions: 6 }
  ],
  devices: [
    { id: 'light-living', name: 'Lâmpada Sala', room: 'Sala de Estar', type: 'light', icon: '💡', online: true, state: { on: true } },
    { id: 'outlet-tv', name: 'Tomada TV', room: 'Sala de Estar', type: 'outlet', icon: '🔌', online: true, state: { on: true } },
    { id: 'climate-bedroom', name: 'Ar Condicionado', room: 'Quarto', type: 'climate', icon: '❄️', online: true, state: { on: true, temperature: 22 } },
    { id: 'camera-front', name: 'Câmera Frontal', room: 'Área Externa', type: 'camera', icon: '📹', online: true, state: { live: true } },
    { id: 'gate-garage', name: 'Portão Eletrônico', room: 'Garagem', type: 'gate', icon: '🚪', online: true, state: { open: false } },
    { id: 'sensor-motion