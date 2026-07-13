const DOMAIN_CAPABILITIES = {
  light: ['power', 'brightness', 'color_temperature', 'rgb_color'],
  switch: ['power'],
  climate: ['power', 'target_temperature', 'current_temperature', 'hvac_mode'],
  cover: ['open', 'close', 'stop', 'position'],
  lock: ['lock', 'unlock', 'battery'],
  sensor: ['value', 'unit'],
  binary_sensor: ['binary_state'],
  camera: ['stream', 'snapshot'],
  fan: ['power', 'percentage'],
  media_player: ['power', 'volume', 'media_control']
};

export function normalizeEntity(entity) {
  if (!entity?.entity_id) throw new Error('entity_id is required');
  const [domain] = entity.entity_id.split('.');
  const attributes = entity.attributes || {};
  const capabilities = [...(DOMAIN_CAPABILITIES[domain] || ['state'])];

  if (domain === 'light') {
    if (attributes.supported_color_modes?.includes('brightness') === false) {
      const index = capabilities.indexOf('brightness');
      if (index >= 0) capabilities.splice(index, 1);
    }
  }

  return {
    id: `ha:${entity.entity_id}`,
    source: 'home-assistant',
    externalId: entity.entity_id,
    name: attributes.friendly_name || entity.entity_id,
    domain,
    capabilities,
    available: entity.state !== 'unavailable' && entity.state !== 'unknown',
    state: normalizeState(domain, entity.state, attributes),
    metadata: {
      icon: attributes.icon || null,
      deviceClass: attributes.device_class || null,
      unit: attributes.unit_of_measurement || null,
      lastChanged: entity.last_changed || null,
      lastUpdated: entity.last_updated || null
    }
  };
}

function normalizeState(domain, state, attributes) {
  const normalized = { raw: state };
  if (['light', 'switch', 'fan', 'media_player'].includes(domain)) {
    normalized.power = state === 'on';
  }
  if (domain === 'lock') normalized.locked = state === 'locked';
  if (domain === 'cover') {
    normalized.open = state === 'open';
    normalized.position = attributes.current_position ?? null;
  }
  if (domain === 'climate') {
    normalized.hvacMode = state;
    normalized.currentTemperature = attributes.current_temperature ?? null;
    normalized.targetTemperature = attributes.temperature ?? null;
  }
  if (domain === 'light') {
    normalized.brightness = attributes.brightness ?? null;
    normalized.colorTemperature = attributes.color_temp_kelvin ?? attributes.color_temp ?? null;
    normalized.rgbColor = attributes.rgb_color ?? null;
  }
  if (domain === 'sensor') normalized.value = coerceValue(state);
  if (domain === 'binary_sensor') normalized.active = state === 'on';
  return normalized;
}

function coerceValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : value;
}
