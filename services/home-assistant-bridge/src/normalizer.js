const DOMAIN_CAPABILITIES = {
  light: ['power', 'brightness', 'color_temperature', 'rgb_color'],
  switch: ['power'],
  fan: ['power', 'percentage'],
  climate: ['power', 'target_temperature', 'current_temperature', 'hvac_mode'],
  lock: ['lock', 'battery'],
  cover: ['open_close', 'position'],
  sensor: ['measurement'],
  binary_sensor: ['binary_state'],
  camera: ['camera_stream'],
  media_player: ['power', 'volume', 'media_control'],
};

export function normalizeEntity(entity) {
  if (!entity || typeof entity.entity_id !== 'string') {
    throw new TypeError('Invalid Home Assistant entity');
  }

  const [domain, objectId] = entity.entity_id.split('.', 2);
  const attributes = entity.attributes ?? {};
  const capabilities = [...(DOMAIN_CAPABILITIES[domain] ?? ['state'])];

  if (domain === 'light') {
    if (!('brightness' in attributes)) remove(capabilities, 'brightness');
    if (!('color_temp_kelvin' in attributes || 'color_temp' in attributes)) {
      remove(capabilities, 'color_temperature');
    }
    if (!('rgb_color' in attributes || (attributes.supported_color_modes ?? []).some(mode => ['rgb', 'rgbw', 'rgbww', 'hs', 'xy'].includes(mode)))) {
      remove(capabilities, 'rgb_color');
    }
  }

  return {
    id: `ha:${entity.entity_id}`,
    externalId: entity.entity_id,
    source: 'home-assistant',
    domain,
    name: attributes.friendly_name ?? humanize(objectId),
    deviceClass: attributes.device_class ?? null,
    capabilities,
    online: !['unavailable', 'unknown'].includes(entity.state),
    state: normalizeState(domain, entity.state, attributes),
    metadata: {
      icon: attributes.icon ?? null,
      unitOfMeasurement: attributes.unit_of_measurement ?? null,
      lastChanged: entity.last_changed ?? null,
      lastUpdated: entity.last_updated ?? null,
    },
  };
}

function normalizeState(domain, state, attributes) {
  const result = { raw: state };

  if (['light', 'switch', 'fan', 'media_player'].includes(domain)) {
    result.power = state === 'on';
  }
  if (domain === 'lock') result.locked = state === 'locked';
  if (domain === 'cover') {
    result.open = state === 'open';
    result.position = attributes.current_position ?? null;
  }
  if (domain === 'climate') {
    result.hvacMode = state;
    result.currentTemperature = attributes.current_temperature ?? null;
    result.targetTemperature = attributes.temperature ?? null;
  }
  if ('brightness' in attributes) result.brightness = attributes.brightness;
  if ('percentage' in attributes) result.percentage = attributes.percentage;
  if ('rgb_color' in attributes) result.rgbColor = attributes.rgb_color;
  if ('battery_level' in attributes) result.battery = attributes.battery_level;
  if (domain === 'sensor') result.value = parseValue(state);
  if (domain === 'binary_sensor') result.active = state === 'on';

  return result;
}

function parseValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : value;
}

function humanize(value) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase());
}

function remove(items, value) {
  const index = items.indexOf(value);
  if (index >= 0) items.splice(index, 1);
}
