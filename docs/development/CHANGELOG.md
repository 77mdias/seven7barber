# Changelog — Seven7Barber

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [Unreleased]

### Added
- Implementado Auth JWT no NestJS e rotas `/auth/login` e `/auth/register` (**TASK-006**, **TASK-007**).
- Integrado o NextAuth no frontend usando a estratégia de Credentials (**TASK-008**).
- Criadas as páginas premium de Login e Registro usando shadcn UI (**TASK-009**).
- Cabeçalho da aplicação modificado para detectar estado da sessão do usuário.
- Adicionado Mock de envio de e-mails (`EmailService`) para debug no backend (**TASK-010**).
- Configuração de Monorepo via **Bun Workspaces**.
- Pacote compartilhado `@seven7barber/shared` com DTOs e Enums (**TASK-005**).
- Workflow de CI básico no GitHub Actions (**GAP-001**).
- Planejamento e board da **PHASE-02 (Authentication)**.
- Inicialização do backend NestJS em `seven7barber-api/` (**TASK-002**).
- Configuração do **Prisma ORM** e definição do schema inicial do banco de dados (**TASK-003**).
- Configuração do ambiente **Docker Compose** com Postgres, API e Web (**TASK-004**).

### Fixed
- GAP-001 (CI/CD basic pipeline missing) resolvido.
- GAP-002 (Database schema not applied) resolvido.

### Changed
- Conclusão da **PHASE-02 (Authentication)**. Progresso 100%.
- Conclusão da **PHASE-01 (Foundation)**. Progresso 100%.
- Organização do workflow para o método HELL.
