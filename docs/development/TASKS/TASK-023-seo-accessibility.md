---
title: "TASK-023: SEO & Accessibility"
type: "task"
status: "pending"
phase: "05"
priority: "🟡 MÉDIA"
created: "2026-04-26"
---

# TASK-023: SEO & Accessibility

## 📋 Descrição
Implementação de SEO técnico e auditoria de acessibilidade WCAG 2.1 AA.

## 🎯 Objetivos
- Dynamic meta tags por página
- Sitemap.xml auto-gerado
- Structured data JSON-LD
- A11Y audit pass (axe-core)

## 🔗 Dependências
- Todas as fases completas (PHASE-01 a 04)

## 📁 Estrutura

```
seven7barber-web/src/
├── app/
│   ├── sitemap.ts          # NEW
│   ├── robots.ts          # NEW
│   └── layout.tsx         # UPDATE
├── components/
│   ├── JsonLd.tsx         # NEW: LocalBusiness schema
│   └── seo/
│       └── metadata.ts    # NEW: SEO hook
└── __tests__/
    └── accessibility/
        └── audit.spec.ts  # NEW
```

## 🔍 SEO Tasks

### Meta Tags
```typescript
// generateMetadata() por página
interface SeoMetadata {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
}
```

### Files
- [ ] `app/sitemap.ts` — Dynamic sitemap
- [ ] `app/robots.ts` — robots.txt
- [ ] `app/layout.tsx` — Default metadata
- [ ] `app/services/page.tsx` — Service catalog meta
- [ ] `app/booking/page.tsx` — Booking meta
- [ ] `app/dashboard/page.tsx` — Dashboard meta

### Structured Data
- [ ] LocalBusiness JSON-LD schema
- [ ] Service catalog JSON-LD
- [ ] FAQPage schema

## ♿ Accessibility Tasks

### WCAG 2.1 AA Checklist
- [ ] Contraste mínimo 4.5:1 (textos)
- [ ] Contraste mínimo 3:1 (UI grande)
- [ ] Focus indicators visíveis
- [ ] Keyboard navigation completa
- [ ] ARIA labels em ícones
- [ ] Skip to content link
- [ ] Form labels associados
- [ ] Error messages acessíveis

### Audit Tools
```bash
# axe-core CLI
npx @axe-core/cli http://localhost:5173

# Lighthouse CI
npx lighthouse http://localhost:5173 --output=json
```

## 📊 Criteria Checklist

### SEO
- [ ] Sitemap gerado dinamicamente
- [ ] Meta tags por página
- [ ] robots.txt
- [ ] JSON-LD LocalBusiness schema
- [ ] Canonical URLs

### A11Y
- [ ] A11Y audit pass (axe-core)
- [ ] Keyboard navigation tests
- [ ] Screen reader announcements
- [ ] Focus management

## 🧪 Test Strategy

```typescript
describe('SEO', () => {
  it('sitemap returns valid XML')
  it('robots.txt exists')
  it('each page has meta description')
  it('JSON-LD is valid schema')
});

describe('Accessibility', () => {
  it('page has skip to content link')
  it('all buttons have accessible names')
  it('forms have associated labels')
  it('color contrast meets WCAG AA')
});
```

## 📝 Notas

- Next.js Metadata API para SEO
- axe-core/playwright para A11Y testing
- Design system já usa tokens de contraste corretos

---
*Status: ⏳ Pendente — Aguardando todas fases completas*
