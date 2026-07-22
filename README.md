# H²A Platform — Genesis Alpha 0.2.2

Bootstrap executável do monorepo do HYBRID Home Assistant.

## Estado real

Esta entrega contém a infraestrutura inicial do monorepo e uma primeira implementação testável do pacote `@hha/foundation`.
Os pacotes Foundation e Kernel possuem implementação inicial; os demais módulos ainda são diretórios reservados.

## Requisitos

- Node.js 22 ou superior
- pnpm 10

## Uso

```bash
corepack enable
pnpm install
pnpm verify
```

## Pacotes implementados

- `@hha/foundation`: identificadores tipados, `Result`, abstração de relógio e contrato básico de evento.
- `@hha/kernel`: Event Bus em memória, Service Registry, Lifecycle, configuração e logging estruturado.

## Próximo marco

Estabilizar completamente o Kernel e iniciar o Capability Runtime mínimo após a validação local.

## Validação do Alpha 0.2.2

Use Node.js 22 ou superior e pnpm 10.12.1:

```bash
corepack enable
corepack prepare pnpm@10.12.1 --activate
pnpm install
pnpm verify
```

O aviso do pnpm sobre o script de build do `esbuild` pode aparecer em instalações
novas. Os testes desta versão não dependem de executar esse script. Não aprove
scripts de dependências sem revisar o pacote e a necessidade local.
