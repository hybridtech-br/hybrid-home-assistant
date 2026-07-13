# ADR-011 — Compatibilidade com o ecossistema Home Assistant

- **Status:** Aceito
- **Data:** 2026-07-13
- **Produto:** HYBRID Home Assistant

## Contexto

O Home Assistant possui um ecossistema amplo de integrações e extensões. O HHA pode acelerar sua cobertura de dispositivos ao interoperar com esse ecossistema, mas integrações do Home Assistant dependem de APIs e estruturas internas específicas e não são plugins portáveis automaticamente.

## Decisão

Adotaremos uma estratégia em quatro camadas:

1. Home Assistant Bridge como primeira entrega;
2. HYBRID App Store para extensões nativas e comunitárias;
3. Compatibility Runtime Python para integrações selecionadas e certificadas;
4. migração das integrações mais relevantes para plugins nativos HHA.

A compatibilidade será publicada por matriz de versões e nunca apresentada como universal.

## Consequências positivas

- maior cobertura inicial de dispositivos;
- migração gradual de usuários existentes;
- redução do risco técnico em comparação com a emulação completa do Core;
- preservação da arquitetura e experiência próprias do HHA;
- caminho claro para plugins nativos de alto desempenho.

## Consequências negativas

- manutenção de uma camada adicional de compatibilidade;
- risco de quebra quando APIs externas mudarem;
- necessidade de testes por versão;
- maior atenção a licenças e marcas;
- algumas integrações permanecerão incompatíveis.

## Restrições

- HHA continuará independente e plenamente funcional sem Home Assistant;
- plugins não acessarão diretamente banco, secrets ou dispositivos fora de suas permissões;
- cada extensão terá licença analisada antes de redistribuição;
- marcas e identidades visuais de terceiros não serão reutilizadas sem autorização;
- add-ons do Supervisor não fazem parte do escopo inicial.

## Alternativas rejeitadas

### Copiar integralmente o Core do Home Assistant

Rejeitada por acoplamento, complexidade de manutenção e perda de autonomia arquitetural.

### Prometer compatibilidade total com HACS

Rejeitada porque HACS distribui projetos independentes, com APIs, licenças e níveis de qualidade distintos.

### Ignorar o ecossistema existente

Rejeitada porque aumentaria significativamente o tempo necessário para atingir boa cobertura de dispositivos.
