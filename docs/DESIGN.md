# DESIGN — VotaMatch SP

> Sistema visual completo. Mobile-first, dark, moderno, **apartidário** (cores de marca
> propositalmente fora do espectro vermelho/azul/verde-amarelo para não parecer de um lado).
> Tudo abaixo já está em formato Tailwind — a **Fase 0** dos prompts injeta isto no
> `tailwind.config`. As fases seguintes só usam os tokens.

---

## 1. Princípios visuais
- **Polegar primeiro.** Ações principais na metade de baixo da tela. Alvos ≥ 56px.
- **Uma decisão por tela.** A carta é a heroína; o resto recua.
- **Contraste alto** (legível à luz do sol — pessoas vão usar isso na fila da urna).
- **Movimento com significado.** Arrastar tinge a tela (verde/vermelho/âmbar) = feedback.
- **Apartidário.** Marca = índigo→violeta. Vermelho/verde só aparecem como *semântica de
  ação* (descartar/salvar), nunca como identidade de candidato.

---

## 2. Paleta (tokens)

### Base / neutros (fundo escuro)
| Token | Hex | Uso |
|---|---|---|
| `bg` | `#0E1117` | fundo do app (navy quase preto) |
| `surface` | `#171B26` | cartas, painéis |
| `elevated` | `#1F2433` | badges, modais, chips |
| `border` | `#2A3140` | divisórias, contornos sutis |
| `ink` | `#F5F7FA` | texto principal |
| `ink-muted` | `#9AA4B2` | texto secundário, rótulos |
| `ink-faint` | `#5B6472` | dicas, placeholders |

### Marca (gradiente)
| Token | Hex | Uso |
|---|---|---|
| `brand` | `#7C5CFC` | cor sólida da marca, CTAs |
| `brand-from` | `#6366F1` | início do gradiente (índigo) |
| `brand-to` | `#A855F7` | fim do gradiente (violeta) |

Gradiente de marca: `bg-gradient-to-br from-brand-from to-brand-to`.

### Semântica de ação / match
| Token | Hex | Uso |
|---|---|---|
| `agree` | `#22C55E` | concordo · salvar · match alto (≥70%) |
| `disagree` | `#FB3B5C` | discordo · descartar · match baixo |
| `skip` | `#FBBF24` | neutro · pular · match médio (40–69%) |

**Cor do match%:** ≥70 → `agree`; 40–69 → `skip`; <40 → `ink-faint`.

> **Cor de partido:** NÃO usar como identidade visual. Para o avatar-fallback, derive uma
> cor estável por sigla via hash (HSL) — decorativa, neutra, não a cor oficial do partido.

---

## 3. Tipografia (Google Fonts)
| Papel | Fonte | Classe |
|---|---|---|
| Títulos / display | **Space Grotesk** | `font-display` |
| Corpo / UI | **Inter** | `font-sans` |
| Números da urna | **DM Mono** | `font-mono` (tabular, peso médio) |

Escala: `text-5xl`/`6xl` para números de urna na Cola; `text-2xl/3xl` para enunciados de
ideia; `text-base` corpo; `text-xs uppercase tracking-widest` para rótulos (tema, cargo).

---

## 4. Forma & profundidade
- **Raio:** cartas `rounded-3xl` (24px); botões pílula `rounded-full`; chips `rounded-xl`.
- **Sombra de carta:** `shadow-card` = `0 20px 60px -15px rgba(124,92,252,.35)` (glow índigo).
- **Borda sutil:** `border border-border/60` nos surfaces.
- **Espaço:** padding de tela `px-5`; gap entre elementos `gap-4`; carta ocupa ~70% da altura.

Tokens extras pro Tailwind: `boxShadow.card`, `borderRadius` já cobertos pelo default 3xl.

---

## 5. Componentes-chave

### SwipeCard (base das ideias e candidatos)
- `rounded-3xl bg-surface shadow-card` ocupando o herói da tela.
- Overlay de arraste: ao puxar →, fade verde `agree/20` + selo "CONCORDO/SALVAR"; ←, vermelho
  `disagree/20` + "DISCORDO/DESCARTAR"; ↑, âmbar `skip/20` + "NEUTRO/PULAR". Selo girado ~12°.

### IdeaCard
```
┌───────────────────────────┐
│            🌳              │  emoji 64px, centralizado
│   MEIO AMBIENTE            │  rótulo: text-xs uppercase tracking-widest ink-muted
│                           │
│  "O desmatamento da       │  enunciado: font-display text-3xl ink, leading-snug
│   Amazônia deve ir a       │
│   zero, mesmo limitando    │
│   o agro."                 │
└───────────────────────────┘
```

### Cabeçalho de cargo (topo da tela /cargos — PRESERVAR)
Fica acima do deck, fixo, em toda a etapa de candidatos:
```
●━━━●━━━○━━━○━━━○            ← stepper: 5 pontos (1 por cargo), na ordem da urna
DEPUTADO FEDERAL             ← cargo atual · font-display, uppercase
⌗ filtrar partido ▾  [PT ✕]  ← filtro de partido (só deputados)
```
- **Stepper:** 5 nós ligados por linha. Concluídos/atual = `bg-brand`; futuros = `bg-elevated`.
  Ordem fixa: Estadual → Federal → Senador → Governador → Presidente. Mostra "2/5" opcional.
- **Título do cargo:** `font-display text-lg uppercase tracking-wide text-ink`.
- **Filtro de partido:** botão `⌗ filtrar partido ▾` que abre chips multiselect; siglas
  escolhidas viram chips removíveis `[PT ✕]` (`bg-elevated`, ponto cor-hash). **Só aparece
  para deputadoEstadual/deputadoFederal**; ocultar nas corridas pequenas.

### CandidateCard — foto full-bleed + scrim (FRENTE)
A foto **preenche a carta inteira** (edge-to-edge). Partido numa barra no topo; número/nome/
ocupação sobre um **gradiente escuro** na base. Visual de app de swipe, foto máxima.
```
╭───────────────────────────╮
│  ● PT                      │ ← barra de partido (topo, sobre a foto)
│                           │
│           FOTO            │ ← full-bleed, ocupa toda a carta
│         (grande)          │
│                           │
│ ░░░░ gradient scrim ░░░░░░ │ ← bg→transparent, garante leitura
│ 1 3 4 5                   │ ← número · font-mono text-5xl
│ Fulana de Tal             │ ← nome · font-display text-xl
│ Médica · 52 anos           │ ← ocupação + idade (NÃO repetir o cargo)
│ 🌳 🏥 🎓 · 78%   ↻ ver +   │ ← temas alinhados + match% + dica de flip
╰───────────────────────────╯
```
- **Carta:** `relative rounded-3xl overflow-hidden shadow-card`. Foto = `absolute inset-0
  object-cover`. **Fallback** (sem foto): `inset-0` com a cor-hash da sigla + iniciais grandes.
- **Barra de partido** (topo, `absolute`): pílula `rounded-full bg-bg/70 backdrop-blur
  text-ink px-3 py-1 font-semibold` com **ponto** da cor-hash da sigla (decorativa, **não**
  a cor oficial). Fica legível sobre qualquer foto graças ao blur/escurecido.
- **Scrim** (base, `absolute inset-x-0 bottom-0`): `bg-gradient-to-t from-bg via-bg/85
  to-transparent`, padding generoso. Contém, em coluna:
  - **número** `font-mono text-5xl text-ink` (digit-spaced: `1 3 4 5`),
  - **nome** `font-display text-xl`,
  - **ocupação · idade** `text-sm ink-muted` (`Médica · 52 anos`) — cargo **não** aparece
    (já está no cabeçalho). Sem ocupação no TSE → mostra só a idade ou some a linha.
  - **3 chips de temas** alinhados (text-agree) + **match%** discreto (`text-xs`, cor por
    tier ≥70/40–69/<40) + dica discreta `↻ ver +`.
- **Overlay de arraste** (verde/vermelho + selo) entra por cima de tudo, como nas ideias.

### CandidateCard — VERSO (flip ao tocar)
Tocar na foto **vira a carta** (flip 3D, `transition-transform rotate-y-180`). O verso é um
painel `bg-surface` (sem foto) com o **resumo de posições estimadas**:
```
╭───────────────────────────╮
│ Fulana de Tal       ● PT   │ ← nome + partido
│ nº 1 3 4 5                 │ ← número (menor)
│                           │
│ ONDE SE POSICIONA (estim.) │ ← rótulo
│ ✓ Ampliar o SUS            │ ← stance +1 → verde, "A favor"
│ ✓ Universidade gratuita     │
│ ✓ Mais imposto p/ fortunas  │
│ ✗ Facilitar porte de armas  │ ← stance −1 → vermelho, "Contra"
│ ✗ Privatizar estatais       │
│                           │
│ Médica · 52 anos · SP      │ ← bio (aqui sim cabe o estado)
│ ─ estimado pelo partido,    │ ← DISCLAIMER (mora aqui, no verso)
│   não é posição oficial. ↻  │
╰───────────────────────────╯
```
- Conteúdo gerado das `stances`: para cada tema com stance ≠ 0, lista o `labelCurto` da
  ideia (ver data-pipeline §6) com `✓` (a favor, +1, text-agree) ou `✗` (contra, −1,
  text-disagree). Neutros (0) ficam de fora. Ordene os de maior peso/alinhamento primeiro;
  limite a ~6 itens para caber.
- **Disclaimer obrigatório no verso** (`text-[10px] ink-faint`): *"Posições estimadas pelo
  partido — não são declarações oficiais do candidato."* — é a tela que faz afirmação sobre
  pessoa real, então o aviso vive aqui (além de Landing e Cola; ver SPEC §7).
- Tocar de novo (ou no `↻`) volta para a frente. Swipe funciona dos dois lados.

### Botões de ação (FABs estilo Tinder, base da tela)
Três círculos 64px, `rounded-full`, ícone + borda colorida, fundo `elevated`:
- ✕ Descartar → borda/ícone `disagree`
- ⤓ Pular/Neutro → borda/ícone `skip` (na tela de ideias)
- ♥ Salvar → borda/ícone `agree`
Pressão: `active:scale-90 transition`.

### Botão primário (CTA)
`rounded-full py-4 text-lg font-semibold text-white bg-gradient-to-br from-brand-from to-brand-to shadow-card active:scale-95`.

### Chip de tema / partido
`rounded-xl px-2.5 py-1 text-xs bg-elevated text-ink-muted`. Tema alinhado: `text-agree`.

### Barra de progresso
Trilha `bg-elevated`, preenchimento gradiente de marca, `rounded-full h-2`.

### ColaCard (tela final)
```
┌───────────────────────────┐
│ DEPUTADO ESTADUAL          │  rótulo cargo, ink-muted, uppercase
│  1 3 3 4 5                 │  font-mono text-6xl tracking-widest, ink
│  [foto] Fulano · PT        │  ink-muted text-sm
└───────────────────────────┘   surface, rounded-3xl, border-l-4 brand
```
A Cola é uma coluna de 5 ColaCards na ordem da urna, exportável em PNG.

---

## 6. Tailwind config (cole na Fase 0)
```js
// tailwind.config.js → theme.extend
colors: {
  bg: '#0E1117', surface: '#171B26', elevated: '#1F2433', border: '#2A3140',
  ink: '#F5F7FA', 'ink-muted': '#9AA4B2', 'ink-faint': '#5B6472',
  brand: '#7C5CFC', 'brand-from': '#6366F1', 'brand-to': '#A855F7',
  agree: '#22C55E', disagree: '#FB3B5C', skip: '#FBBF24',
},
fontFamily: {
  display: ['"Space Grotesk"', 'sans-serif'],
  sans: ['Inter', 'sans-serif'],
  mono: ['"DM Mono"', 'monospace'],
},
boxShadow: { card: '0 20px 60px -15px rgba(124,92,252,0.35)' },
borderRadius: { '3xl': '24px' },
```
Fontes via `<link>` Google Fonts no `index.html`: Space Grotesk (500,700), Inter (400,500,600), DM Mono (500). Fundo global: `bg-bg text-ink font-sans`, altura `100dvh`, container `max-w-md mx-auto`, respeitar `env(safe-area-inset-*)`.
