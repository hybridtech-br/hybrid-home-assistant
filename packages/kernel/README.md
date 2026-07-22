# @hha/kernel

Infraestrutura comum do H²A Genesis.

## Implementado nesta versão

- Event Bus em memória com inscrições por tipo e wildcard.
- Service Registry tipado.
- Lifecycle Manager com inicialização, início, parada e descarte.
- Configuration com fonte estática e cache imutável.
- Logger estruturado com sink em memória.

## Fora do escopo atual

Persistência de eventos, retries, cluster, descoberta automática, mensageria distribuída e observabilidade externa.
