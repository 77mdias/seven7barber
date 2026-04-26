# TASK-008: Web Auth Integration (NextAuth)

**ID:** TASK-008
**Phase:** PHASE-02
**Status:** ✅ Completa
**Prioridade:** 🔴 ALTA

## 📋 Descrição
Configurar a aplicação Next.js para manter as sessões e se comunicar com o backend usando NextAuth.js.

## ✅ Critérios de Aceite
- [x] NextAuth configurado com Provider `Credentials`.
- [x] Endpoint `api/auth/[...nextauth]` criado usando padrão App Router.
- [x] Aplicação "wrappada" pelo `SessionProvider`.
- [x] Sessão inclui token JWT para chamadas à API e a Role do usuário.

## 🛠️ Detalhes de Implementação
- Em `seven7barber-web/src/lib/auth.ts`. O Fetch aponta para `NEXT_PUBLIC_API_URL`.

## 🧪 Estratégia de Teste
- [x] Utilização do `useSession()` no componente de Header para verificar status logado.

## 🔗 Referências
- [PRD](../PHASES/PHASE-01/prd.md)
