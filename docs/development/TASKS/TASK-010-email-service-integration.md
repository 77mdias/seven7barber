# TASK-010: Email Service Integration

**ID:** TASK-010
**Phase:** PHASE-02
**Status:** ✅ Completa
**Prioridade:** 🟡 MÉDIA

## 📋 Descrição
Integração com serviço de E-mail mockado (console) no backend para simular disparo de verificações, agendamentos e reset de senha.

## ✅ Critérios de Aceite
- [x] `EmailService` criado como módulo global.
- [x] Utilização do `Logger` nativo do NestJS.
- [x] Funções `sendConfirmationEmail` e `sendWelcomeEmail` expostas.

## 🛠️ Detalhes de Implementação
- Evita complexidade do envio de e-mails reais em ambiente de portfolio/sandbox. Facilita o log para debugar os payloads.

## 🧪 Estratégia de Teste
- [x] Logs sendo exibidos perfeitamente ao instanciar o serviço.

## 🔗 Referências
- [PRD](../PHASES/PHASE-01/prd.md)
