# Proposal: Booking Wizard

## Problema

Clientes do Seven7Barber precisam de um processo intuitivo para agendar serviços de barbearia. O fluxo atual é fragmentado e não guide o usuário através das etapas necessárias.

## Scope

### Inside
- Wizard multi-step para agendamento
- Seleção de barbeiro (opcional)
- Escolha de serviços
- Seleção de horário disponível
- Confirmação e resumo

### Outside
- Pagamento (integrado via ABACATE PAY mas não gerenciado aqui)
- Histórico de agendamentos (dashboard separado)
- Notificações por email/SMS

## Contexto

Sistema monorepo com:
- **API:** NestJS + Prisma + PostgreSQL (Supabase)
- **Web:** Next.js 15 + React 19 + shadcn/ui + Tailwind
- **Auth:** OAuth2 via Google/Apple

## Critérios de Sucesso

1. Usuário completa agendamento em ≤ 5 minutos
2. Taxa de conclusão ≥ 70%
3.rollback suave em caso de erro
4. Responsivo mobile-first
