# SPEC — VotaMatch SP (working title)

> **Tinder das Ideias para a Urna.** Um app que ajuda o eleitor a descobrir candidatos
> alinhados às suas ideias *deslizando* (swipe) por afirmações políticas, e entrega no
> final uma **Cola da Urna** com os números na ordem certa de votação.
>
> **Hackathon MVP · Prova de conceito · Estamos "em" outubro de 2022 (pré-votação) · Foco: São Paulo**
>
> ⚠️ **Sem resultados/eleitos.** O app simula o momento *antes* do voto: não mostramos
> quem ganhou. Nenhum spoiler — comporta-se como uma ferramenta real de pré-eleição.

---

## 1. Problema & Proposta

Em 2022 o eleitor de SP enfrentava **5 votos** e ~3.600 candidatos:

| Ordem na urna | Cargo | Dígitos | Candidatos (SP, 2022) | Vagas |
|---|---|---|---|---|
| 1º | Deputado Estadual | 5 | ~2.059 | 94 |
| 2º | Deputado Federal | 4 | ~1.540 | 70 |
| 3º | Senador | 3 | 10 | 1 |
| 4º | Governador | 2 | 10 | 1 |
| 5º | Presidente | 2 | 11–13 (nacional) | 1 |

**Você não consegue dar swipe em 1.500 deputados.** A solução é um funil em duas fases:

1. **Swipe de Ideias** — ~12 cartas de afirmações políticas. Constrói o *vetor de
   preferências* do eleitor.
2. **Swipe de Candidatos** — por cargo, já **rankeado e filtrado** por compatibilidade.
   As corridas pequenas (presidente/governador/senador) aparecem inteiras ordenadas por
   match; os deputados são cortados para o **top ~20–30** mais compatíveis.

No fim: **Cola da Urna** — os números escolhidos, na ordem de votação, em letras grandes,
pronta para print/screenshot.

### Diferencial
Os apps brasileiros (#TemMeuVoto, Voz Ativa, Voto x Veto) são **questionários/formulários**.
A mecânica de **swipe em ideias → revela candidatos + cola da urna** é inédita aqui. O
análogo mais próximo é o *"Swipe the Vote"* do Tinder (EUA, 2016), que nunca cobriu a cédula
inteira nem gerou cola.

---

## 2. Princípios

- **Mobile-first.** Tudo desenhado para o polegar, tela cheia, gestos. PWA instalável.
- **Apoio à decisão, não substituição.** Disclaimer visível: não substitui pesquisa oficial.
- **Honestidade sobre dados simulados.** Nomes de candidatos são reais (TSE 2022); as
  **posições/stances são estimativas baseadas no partido**, não posições oficiais. Isso
  precisa estar rotulado em toda tela de match. (Ver §6 — Ética.)
- **Offline-first.** Dados embutidos no bundle; funciona sem rede após carregar.

---

## 3. Stack

**Deixamos o Replit Agent usar a stack nativa dele** (a que ele builda/roda/deploya melhor):
**React + TypeScript + Tailwind no frontend (Vite)** — que casa com nossas necessidades. Não
prescrevemos bibliotecas a dedo; fixamos só as **restrições** que importam:

| Item | Decisão | Por quê |
|---|---|---|
| Framework/estilo | Stack nativa do Replit: **React + TS + Tailwind (Vite)** | Menos atrito; é o que o Agent faz melhor |
| Backend / DB | **Nenhum.** Sem Drizzle/Neon/Postgres, sem auth | App é frontend-only; dados são JSON estático |
| Dados | **JSON estático** (`src/data/*.json`) gerado fora (data-prep) | Matching roda 100% no navegador |
| Estado | **Zustand** + persist (localStorage) | Sessão/favoritos/respostas sem boilerplate |
| PWA | instalável/offline (ex.: **vite-plugin-pwa**) | "Cara de app" no celular |
| Swipe | **react-tinder-card** ou equivalente (gesto + fallback de botão) | Velocidade de hackathon |
| Screenshot | **html-to-image** | Botão "salvar cola" como imagem |
| Deploy | **Static Deployment** no Replit | SPA/PWA estática, sem servidor → mais barato/simples |

> **Sem backend.** Todo o matching é client-side sobre JSON embutido. Se a template do Replit
> trouxer Express, ele fica só como host estático. "App" = **PWA instalável** (Adicionar à
> Tela Inicial), não build de loja de apps. (Se os jurados quiserem "história de API", dá pra
> extrair o matching para um endpoint depois — não é MVP.)

---

## 4. Fluxo de Telas

```
┌────────────┐   ┌──────────────┐   ┌─────────────────────┐   ┌──────────────┐
│  Landing   │──▶│ Swipe Ideias │──▶│ Swipe Candidatos    │──▶│ Cola da Urna │
│ + estado   │   │ (12 cartas)  │   │ (5 cargos, em ordem)│   │ (print/share)│
└────────────┘   └──────────────┘   └─────────────────────┘   └──────────────┘
                       │                      │
                  vetor do                salvar / descartar
                  eleitor                 + filtro partido (deputados)
```

1. **Landing** — pitch em 1 frase, disclaimer, estado fixo = SP (MVP), botão "Começar".
2. **Swipe de Ideias** — 12 cartas. → direita = **concordo**, ← esquerda = **discordo**,
   ↑ cima / tap = **neutro/pular**. Barra de progresso. Botões grandes como fallback ao gesto.
3. **Swipe de Candidatos** — uma aba/etapa por cargo, **na ordem da urna**. Cada carta:
   foto, nome de urna, número grande, partido, **% de match**, principais alinhamentos.
   → direita = **salvar**, ← esquerda = **descartar**.
   - Deputados: deck pré-filtrado ao top N por match; **filtro de partido** opcional.
   - Pequenas corridas: deck completo ordenado por match.
4. **Cola da Urna** — números escolhidos, **ordem de votação (5→4→3→2→2 dígitos)**, dígitos
   gigantes, nome+foto+partido, disclaimer, botão **salvar imagem** e **reiniciar**.

---

## 5. Modelo de Dados

```ts
// 12 eixos temáticos (ver docs/data-pipeline.md para os enunciados)
type ThemeId =
  | 'economia' | 'rendaSocial' | 'amazonia' | 'armas' | 'corrupcao'
  | 'sus' | 'educacao' | 'democracia' | 'lgbtqia' | 'drogas'
  | 'impostos' | 'estatais';

type Stance = -1 | 0 | 1; // discordo | neutro | concordo

interface IdeaCard {
  id: ThemeId;
  tema: string;        // rótulo curto p/ UI
  statement: string;   // afirmação que o eleitor avalia (swipe)
  labelCurto: string;  // forma curta da posição +1, p/ verso do candidato ("ampliar o SUS")
  emoji?: string;
}

type Cargo =
  | 'presidente' | 'governador' | 'senador'
  | 'deputadoFederal' | 'deputadoEstadual';

interface Candidate {
  id: string;            // SQ_CANDIDATO do TSE
  nomeUrna: string;      // NM_URNA_CANDIDATO
  nomeCompleto: string;  // NM_CANDIDATO
  numero: string;        // NR_CANDIDATO (string p/ preservar zeros)
  partido: string;       // SG_PARTIDO
  cargo: Cargo;
  uf: 'SP' | 'BR';
  foto: string;          // URL/placeholder
  ocupacao?: string;     // DS_OCUPACAO — frente + verso
  idade?: number;        // calculada de DT_NASCIMENTO (em out/2022)
  stances: Record<ThemeId, Stance>; // ESTIMADO — ver §6; gera o verso (propostas)
}

// estado de sessão (Zustand + persist)
interface Session {
  answers: Partial<Record<ThemeId, Stance>>;
  favorites: Record<Cargo, string[]>;  // ids salvos por cargo
  discarded: Record<Cargo, string[]>;
  escolhaFinal: Partial<Record<Cargo, string>>; // a carta da cola
}
```

---

## 6. Matching (proximidade — modelo Wahl-O-Mat)

Vetor do eleitor `u`, vetor do candidato `s`, ambos ∈ {−1, 0, +1}, somente sobre temas
respondidos:

```ts
function matchPct(u: Partial<Record<ThemeId, Stance>>, s: Record<ThemeId, Stance>): number {
  const themes = Object.keys(u) as ThemeId[];
  if (themes.length === 0) return 0;
  let pts = 0;
  for (const t of themes) pts += 2 - Math.abs((u[t]! - s[t])); // 0..2 por tema
  return Math.round((pts / (2 * themes.length)) * 100);        // 0..100
}
```

- Ordene candidatos por `matchPct` desc.
- **Deputados:** `slice(0, 30)` (após filtro de partido, se houver).
- **Pequenas corridas:** mostre todos, ordenados.
- *Nice-to-have:* peso duplo em até 3 temas marcados como "importantes" (Wahl-O-Mat faz).

---

## 7. Ética & Confiabilidade (não é opcional)

> Tema do hackathon é **democracia / combate à desinformação** — então não podemos virar
> fonte de desinformação.

- **Stances são simulados.** Calculados a partir de uma tabela de baseline por partido +
  ruído determinístico. **Não são posições declaradas dos candidatos.**
- Disclaimer no **Landing** e na **Cola**: *"Ferramenta de apoio à decisão. Posições
  estimadas por partido, não oficiais. Confirme sempre nas fontes oficiais (TSE, programas
  de governo)."* (A carta de candidato **não** leva disclaimer — decisão de produto.)
- Não inventar números de urna: usar exatamente o `NR_CANDIDATO` do TSE.
- Fonte dos dados citada (TSE Dados Abertos 2022).

---

## 8. Critérios de Aceite (MVP)

- [ ] Abre no celular como PWA, swipe fluido com gesto + botões.
- [ ] 12 cartas de ideia constroem o vetor; pular funciona.
- [ ] 5 cargos com decks rankeados; deputados filtrados ao top 30 + filtro de partido.
- [ ] Salvar/descartar persiste; escolha final por cargo.
- [ ] Cola da Urna na ordem 5→4→3→2→2 dígitos, dígitos grandes, exportável como imagem.
- [ ] Disclaimers de simulação visíveis nas telas de match e na cola.
- [ ] Funciona offline após primeiro load.

---

## 9. Documentos relacionados
- [`docs/DESIGN.md`](docs/DESIGN.md) — sistema visual: paleta, tipografia, componentes.
- [`docs/data-pipeline.md`](docs/data-pipeline.md) — spec dos dados (CSV TSE → JSON + stances).
- [`data-prep/`](data-prep/) — **passo local** que gera o JSON (Replit não baixa/processa dados).
- [`docs/build-prompts.md`](docs/build-prompts.md) — fluxo de build + índice das fases (`docs/prompts/`).
