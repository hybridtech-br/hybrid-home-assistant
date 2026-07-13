# HYBRID App Ecosystem

## Objetivo

O HYBRID App Ecosystem amplia o HYBRID Home Assistant (HHA) por meio de integrações, apps, temas, widgets, automações, agentes de IA e drivers de dispositivos, preservando os princípios Local First, Security by Design e Plugin First.

## Componentes

1. **HYBRID App Store** — catálogo, instalação, atualização, rollback e avaliação de extensões.
2. **HHA Native Apps** — plugins desenvolvidos para a API oficial do HHA.
3. **Community Apps** — extensões da comunidade submetidas a validação técnica, de segurança e licenciamento.
4. **Home Assistant Bridge** — conexão com uma instalação existente do Home Assistant via REST, WebSocket e MQTT.
5. **HA Compatibility Runtime** — execução isolada e certificada de integrações selecionadas do Home Assistant.

## Ordem de implementação

### Fase 1 — Home Assistant Bridge

O Bridge deverá importar e sincronizar:

- áreas;
- dispositivos;
- entidades;
- estados;
- serviços;
- eventos;
- atributos e disponibilidade.

Fluxo:

```text
Home Assistant
  -> REST / WebSocket / MQTT
  -> HHA HA Bridge
  -> Normalização
  -> Device Engine
  -> HHA Dashboard / Automations / AI
```

O Bridge não transforma o Home Assistant em dependência obrigatória. Ele é uma integração opcional e isolada.

### Fase 2 — HYBRID App Store

Recursos mínimos:

- catálogo assinado;
- pesquisa e categorias;
- compatibilidade por versão;
- instalação e atualização;
- rollback;
- permissões explícitas;
- verificação de integridade;
- origem e licença visíveis;
- canal estável e beta;
- telemetria desativada por padrão.

### Fase 3 — Compatibility Runtime

O runtime Python deverá emular somente as APIs necessárias para integrações certificadas. Não haverá promessa de compatibilidade irrestrita com todo o ecossistema do Home Assistant.

Escopo inicial de compatibilidade:

- integrações REST simples;
- integrações MQTT;
- bibliotecas Python locais sem dependências profundas do Core;
- entidades comuns de luz, sensor, switch, climate, lock, cover e camera.

Fora do escopo inicial:

- add-ons do Supervisor;
- integrações que alterem profundamente o frontend;
- componentes que exijam APIs internas não estáveis;
- extensões sem licença compatível;
- código sem manutenção ou sem revisão de segurança.

## Manifesto de app

```json
{
  "id": "com.hybrid.shelly",
  "name": "Shelly",
  "version": "1.0.0",
  "type": "integration",
  "runtime": "node",
  "apiVersion": "1",
  "permissions": [
    "network.local",
    "devices.read",
    "devices.control"
  ],
  "entrypoint": "dist/index.js",
  "license": "Apache-2.0",
  "homepage": "https://example.com"
}
```

## Permissões

Permissões iniciais:

- `network.local`
- `network.internet`
- `devices.read`
- `devices.control`
- `devices.manage`
- `events.subscribe`
- `events.publish`
- `storage.private`
- `ui.widgets`
- `automations.nodes`
- `ai.tools`

Apps não terão acesso direto ao banco de dados, secrets globais ou filesystem do host.

## Segurança

- execução em sandbox;
- assinatura e checksum;
- política de menor privilégio;
- isolamento de rede configurável;
- logs de instalação e execução;
- desativação imediata;
- rollback automático após falha crítica;
- análise de dependências;
- revisão de licença;
- lista de permissões exibida antes da instalação.

## Normalização de entidades do Home Assistant

Exemplo:

```text
light.living_room
  -> HHA Device
  -> capabilities: power, brightness, color_temperature, rgb_color
```

O identificador original e os metadados da origem serão preservados para sincronização e diagnóstico.

## Critérios de sucesso da Fase 1

- conectar uma instância de Home Assistant por URL e token;
- importar áreas, dispositivos e entidades suportadas;
- refletir mudanças de estado em tempo real;
- enviar comandos do HHA ao Home Assistant;
- reconectar automaticamente;
- registrar erros e latência;
- permitir remoção segura da integração;
- não comprometer o funcionamento local independente do HHA.
