# replit.md — contexto persistente para o Replit Agent

> Leia isto em TODAS as tarefas. Regras e contexto fixos do projeto. Detalhes completos em
> `SPEC.md`, `docs/DESIGN.md`, `docs/data-pipeline.md`.

## O que é
**VotaMatch SP** — app mobile-first estilo Tinder para as **eleições 2022 em São Paulo**.
O eleitor dá *swipe* em 12 ideias → recebe candidatos compatíveis nos 5 cargos → termina com
uma **Cola da Urna** (números na ordem de votação) que pode salvar como imagem.

## Contexto fixo (não violar)
- **Estamos "em" outubro de 2022, PRÉ-VOTAÇÃO.** Nada de resultados/eleitos. Sem campo de
  "quem ganhou", sem spoilers.
- **Só São Paulo** (presidente é nacional/BR; os outros 4 cargos são SP).
- **Posições dos candidatos são ESTIMADAS por partido**, não oficiais. Exibir o aviso na
  Landing, no verso da carta de candidato e na Cola. Nunca apresentar como fato.

## Restrições técnicas (não violar)
- **Frontend-only.** SEM banco de dados, SEM auth, SEM backend de dados. NÃO adicionar
  Drizzle/Neon/Postgres. Se houver Express na template, deixar só como host estático.
- **Dados = JSON estático** em `src/data/candidates.json` e `src/data/ideas.json`, gerados
  FORA do Replit (pasta `data-prep/`, roda local). **Não baixar nem processar dados do TSE
  aqui.** Apenas consumir o JSON. Se faltar, criar placeholder `[]`.
- **Matching roda 100% no navegador.** Estado do usuário em **zustand + persist
  (localStorage)** → cada celular tem sua sessão isolada (multiusuário sem backend).
- **Deploy = Static Deployment.** "App" = **PWA instalável** (Add to Home Screen), não build
  de loja.
- Stack: sua nativa (React + TS + Tailwind/Vite). Mobile-first, alvos ≥56px, 100dvh, safe-areas.

## Design (resumo — completo em docs/DESIGN.md)
- Dark. Cores: bg #0E1117, surface #171B26, elevated #1F2433, border #2A3140,
  ink #F5F7FA / ink-muted #9AA4B2 / ink-faint #5B6472, brand #7C5CFC (gradiente
  #6366F1→#A855F7), agree #22C55E, disagree #FB3B5C, skip #FBBF24.
- Fontes: Space Grotesk (display), Inter (sans), DM Mono (números da urna).
- **Apartidário:** cor de partido nunca como identidade visual (usar cor-hash decorativa).
- O DESIGN SYSTEM tem prioridade sobre qualquer tema/kit padrão (shadcn etc.).

## Como construir
- **Incremental.** Siga as fases em `docs/prompts/00..04` na ordem, UMA por vez.
- Após cada fase funcionar no preview mobile, **salve um Checkpoint**; se quebrar, role de volta.
- Seja específico; quando eu colar uma fase, implemente só aquela fase.
