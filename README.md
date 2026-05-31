# VotaMatch BR

Aplicativo que ajuda eleitores brasileiros a encontrar candidatos alinhados aos seus valores por meio de um quiz no estilo "swipe", calculando o percentual de proximidade com cada candidato para as Eleições 2026.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/pitch-deck/` — deck de apresentação (3 min) em pt-BR. Slides em `src/pages/slides/`, manifesto em `src/data/slides-manifest.json`
- `artifacts/mobile/` — app mobile VotaMatch (Expo)
- `artifacts/api-server/` — servidor de API (Express)
- `artifacts/mockup-sandbox/` — canvas para previews de componentes

## Architecture decisions

- Pitch deck: paleta navy `#0F2740`, azul `#1A5276`, verde `#27AE60`, fundo claro `#F4F8FC`. Fontes Raleway (display 900) + Source Sans 3 (corpo)
- Slides usam apenas unidades vw/vh, sem emoji e sem `.map()` (JSX estático) para compatibilidade com o editor visual e exportação
- QR codes nos slides são SVG estáticos desenhados à mão (Capa e Call to Action)

## Product

VotaMatch BR é um app de orientação eleitoral. O eleitor responde a 12 afirmações sobre 5 temas (economia, renda, meio ambiente, segurança, democracia), concordando, discordando ou ficando neutro. Um algoritmo de proximidade gera um ranking de candidatos por cargo, ordenados pelo percentual de alinhamento. Inclui "cola de votação" para levar na hora de votar. Gratuito, sem cadastro e sem rastreamento de dados pessoais.

O deck de 8 slides (Capa, O Problema, A Solução, Como Funciona, Funcionalidades, Impacto, Monetização, Call to Action) apresenta o produto para as Eleições 2026 em nível nacional.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
