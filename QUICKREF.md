# Tempest Seven7Barber - Quick Reference

## Project Setup

```bash
# Create project directories
mkdir -p ~/projects/STARTUP-SEVEN7BARBER/docs/{prd,specs,wireframes,product,user-stories,roadmap}

# Project location
~/projects/STARTUP-SEVEN7BARBER/
```

## Tech Stack Summary

| Layer | Tech | Deploy |
|-------|------|--------|
| Frontend | Vinext (Next.js 15) | Cloudflare Pages |
| Backend | NestJS | Render (free tier) |
| Database | PostgreSQL | Supabase |
| Package | Bun | - |
| Tests | Vitest + Supertest | - |
| Storage | Cloudinary | - |
| Payments | Abacate Pay | Mock |

## Design System (Razorcuts)

- Primary: #732F3B, #401021
- Neutrals: #111111, #272727, #bababa, #ffffff
- Fonts: Oswald (H1-H2), Poppins (body)

## Created Documents

| Document | Path |
|----------|------|
| PRD | `docs/prd/PRD.md` |
| SPEC | `docs/specs/SPEC.md` |
| Backlog | `docs/product/BACKLOG.md` |
| Roadmap | `docs/roadmap/ROADMAP.md` |
| User Stories | `docs/user-stories/USER_STORIES.md` |
| Wireframes | `docs/wireframes/WIREFRAMES.md` |
| README | `README.md` |

## Key Repos to Create

1. `seven7barber-web` - Vinext frontend
2. `seven7barber-api` - NestJS backend

## Next Steps

1. Create GitHub repos
2. Initialize monorepo structure
3. Implement MVP features
4. Deploy to Cloudflare + Render
5. Add tests