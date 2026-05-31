// Gera DADOS DE EXEMPLO (fictícios) para src/data/candidates.json no schema do SPEC §5.
// NÃO processa dados do TSE. Nomes são inventados de propósito — quando o data-prep real
// rodar (local), basta sobrescrever src/data/candidates.json com os dados oficiais.
//
// Uso: node scripts/generate-sample-candidates.mjs
import { writeFileSync } from 'node:fs'

// Ordem dos 12 temas (igual a src/data/ideas.json / ThemeId do SPEC)
const THEMES = [
  'economia', 'rendaSocial', 'amazonia', 'armas', 'corrupcao', 'sus',
  'educacao', 'democracia', 'lgbtqia', 'drogas', 'impostos', 'estatais',
]

// Baseline de stance por posição no espectro (ESTIMATIVA — não oficial)
// vetor na ordem de THEMES, valores em {-1,0,1}
const BASELINE = {
  farleft:     [-1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1],
  left:        [-1, 1, 1, -1, 1, 1, 1, 1, 1, 0, 1, -1],
  centerleft:  [-1, 1, 1, -1, 1, 1, 1, 1, 1, 0, 1, 0],
  center:      [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  centerright: [1, 0, 0, 0, 1, 1, 0, 1, -1, 0, 0, 1],
  right:       [1, -1, -1, 1, 1, 0, 0, 0, -1, -1, -1, 1],
  libertarian: [1, -1, 0, 1, 1, -1, -1, 1, 0, 1, -1, 1],
}

// Partidos: número oficial (público) + espectro estimado
const PARTIES = [
  { sigla: 'PT', num: 13, spec: 'left' },
  { sigla: 'PSOL', num: 50, spec: 'farleft' },
  { sigla: 'PCdoB', num: 65, spec: 'farleft' },
  { sigla: 'REDE', num: 18, spec: 'centerleft' },
  { sigla: 'PSB', num: 40, spec: 'centerleft' },
  { sigla: 'PDT', num: 12, spec: 'centerleft' },
  { sigla: 'PV', num: 43, spec: 'centerleft' },
  { sigla: 'CIDADANIA', num: 23, spec: 'center' },
  { sigla: 'PSD', num: 55, spec: 'center' },
  { sigla: 'MDB', num: 15, spec: 'center' },
  { sigla: 'PODE', num: 19, spec: 'center' },
  { sigla: 'SOLIDARIEDADE', num: 77, spec: 'center' },
  { sigla: 'AVANTE', num: 70, spec: 'center' },
  { sigla: 'PSDB', num: 45, spec: 'centerright' },
  { sigla: 'UNIÃO', num: 44, spec: 'centerright' },
  { sigla: 'PL', num: 22, spec: 'right' },
  { sigla: 'PP', num: 11, spec: 'right' },
  { sigla: 'REPUBLICANOS', num: 10, spec: 'right' },
  { sigla: 'PSC', num: 20, spec: 'right' },
  { sigla: 'NOVO', num: 30, spec: 'libertarian' },
]

const FIRST = [
  'Ana', 'Bruno', 'Carla', 'Diego', 'Elaine', 'Fábio', 'Gabriela', 'Heitor',
  'Isabela', 'João', 'Karina', 'Lucas', 'Mariana', 'Nelson', 'Olívia', 'Paulo',
  'Queila', 'Rafael', 'Sônia', 'Thiago', 'Úrsula', 'Vitor', 'Wânia', 'Xavier',
  'Yara', 'Zeca', 'Beatriz', 'Caio', 'Daniela', 'Eduardo', 'Fernanda', 'Gustavo',
]
const LAST = [
  'Silva', 'Souza', 'Oliveira', 'Santos', 'Pereira', 'Lima', 'Carvalho', 'Ferreira',
  'Rodrigues', 'Almeida', 'Costa', 'Gomes', 'Martins', 'Araújo', 'Ribeiro', 'Barbosa',
  'Rocha', 'Dias', 'Nascimento', 'Moreira', 'Cardoso', 'Teixeira', 'Correia', 'Pinto',
]
const OCUPACOES = [
  'Advogada', 'Advogado', 'Médica', 'Médico', 'Professora', 'Professor', 'Empresária',
  'Empresário', 'Engenheira', 'Engenheiro', 'Servidora pública', 'Servidor público',
  'Economista', 'Jornalista', 'Comerciante', 'Sindicalista', 'Administradora',
  'Administrador', 'Vereadora', 'Vereador',
]

// PRNG determinístico
function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildStances(spec, seed) {
  const base = BASELINE[spec]
  const rnd = mulberry32(seed)
  const out = {}
  // varia 1–2 temas para dar diversidade dentro do partido
  const flips = 1 + Math.floor(rnd() * 2)
  const flipIdx = new Set()
  for (let i = 0; i < flips; i++) flipIdx.add(Math.floor(rnd() * THEMES.length))
  THEMES.forEach((t, i) => {
    let v = base[i]
    if (flipIdx.has(i)) {
      const r = rnd()
      v = r < 0.5 ? 0 : v === 0 ? (r < 0.75 ? 1 : -1) : -v
    }
    out[t] = v
  })
  return out
}

const CARGOS = [
  { cargo: 'deputadoEstadual', uf: 'SP', digits: 5, count: 48 },
  { cargo: 'deputadoFederal', uf: 'SP', digits: 4, count: 42 },
  { cargo: 'senador', uf: 'SP', digits: 3, count: 8 },
  { cargo: 'governador', uf: 'SP', digits: 2, count: 9 },
  { cargo: 'presidente', uf: 'BR', digits: 2, count: 8 },
]

const candidates = []
let globalSeed = 1

for (const { cargo, uf, digits, count } of CARGOS) {
  if (digits === 2) {
    // número = número do partido (precisa partido único por candidato)
    const chosen = PARTIES.slice(0, count)
    chosen.forEach((p, i) => {
      candidates.push(makeCandidate(cargo, uf, p, String(p.num), i))
    })
  } else {
    for (let i = 0; i < count; i++) {
      const p = PARTIES[i % PARTIES.length]
      const suffixLen = digits - 2
      const suffix = String((i * 7 + 1) % Math.pow(10, suffixLen)).padStart(suffixLen, '0')
      const numero = `${p.num}${suffix}`
      candidates.push(makeCandidate(cargo, uf, p, numero, i))
    }
  }
}

function makeCandidate(cargo, uf, party, numero, i) {
  const seed = globalSeed++
  const rnd = mulberry32(seed * 2654435761)
  const first = FIRST[Math.floor(rnd() * FIRST.length)]
  const last1 = LAST[Math.floor(rnd() * LAST.length)]
  const last2 = LAST[Math.floor(rnd() * LAST.length)]
  const nomeCompleto = `${first} ${last1} ${last2}`
  const nomeUrna = rnd() < 0.5 ? `${first} ${last1}` : `${first} ${last2}`
  const ocupacao = OCUPACOES[Math.floor(rnd() * OCUPACOES.length)]
  const idade = 28 + Math.floor(rnd() * 42)
  return {
    id: `${cargo}-${numero}-${seed}`,
    nomeUrna,
    nomeCompleto,
    numero,
    partido: party.sigla,
    cargo,
    uf,
    ocupacao,
    idade,
    stances: buildStances(party.spec, seed),
  }
}

writeFileSync(
  new URL('../src/data/candidates.json', import.meta.url),
  JSON.stringify(candidates, null, 2) + '\n'
)
console.log(`Gerados ${candidates.length} candidatos de exemplo.`)
