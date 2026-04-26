# TASK-004: Docker Compose Setup

**ID:** TASK-004
**Phase:** PHASE-01
**Status:** ✅ Completa
**Prioridade:** 🟡 MÉDIA

## 📋 Descrição
Configurar o ambiente Docker para desenvolvimento local, incluindo banco de dados, API e Frontend.

## ✅ Critérios de Aceite
- [x] Dockerfile criado para `seven7barber-api` (usando Bun).
- [x] Dockerfile criado para `seven7barber-web` (usando Bun).
- [x] `docker-compose.yml` na raiz configurando os 3 serviços.
- [x] Persistência de dados do Postgres configurada via volume.
- [x] Variáveis de ambiente integradas para conexão entre serviços.

## 🛠️ Detalhes de Implementação
- API exposta na porta 3000.
- Web exposta na porta 3001 (mapeada para 3000 interna).
- Postgres na porta 5432.

## 🧪 Estratégia de Teste
- [x] `docker compose build` executado com sucesso.
- [x] Verificação visual dos arquivos de configuração.

## 🔗 Referências
- [PRD](../PHASES/PHASE-01/prd.md)
