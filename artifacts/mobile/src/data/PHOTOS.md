# Candidate Photos

## Field in `candidates.json`

Each candidate object may contain a `fotoUrl` field (string, optional) with a
publicly accessible portrait photo URL. This is the canonical field the card
component reads.

## Current source

Most photos are sourced from **Wikimedia Commons** (free licence, stable URLs):
`https://upload.wikimedia.org/wikipedia/commons/...`

All 30 candidates now have a photo. Three of them use **local AI-generated
mockup portraits** (stylised flat illustrations, not real photos) because no
usable free image was found on Wikimedia:
- `gov-005` (Vinícius Poit)
- `depest-003` (Professora Bebel / Isabel Abreu)
- `depest-006` (Gil Diniz / Gilmaci Santos)

These mockups live under `assets/candidates/` and are wired in via
`src/data/candidates.ts`, which overlays a local `require()` onto the
candidate's `fotoUrl` by id (JSON can't hold `require()` references).
Because of this, `fotoUrl` is typed `string | number` — a remote URL string
or a bundled-asset module id.

Both screens (`app/cargos.tsx`, `app/cola.tsx`) import the merged
`allCandidates` from `src/data/candidates.ts` instead of the raw JSON.

Cards without `fotoUrl` fall back to the existing colour + initials system.

## TSE photo URL pattern (for Task: Substituir dados pelos CSVs do TSE)

When importing real TSE candidates, populate `fotoUrl` using the TSE portal path:

```
https://divulgacandcontas.tse.jus.br/candidaturas/oficial/{ano}/SP/{seqCandidato}/fotos/{arquivo}
```

Example (2022):
```
https://divulgacandcontas.tse.jus.br/candidaturas/oficial/2022/SP/280001644128/fotos/foto_cand.jpg
```

The `seqCandidato` value maps to `SQ_CANDIDATO` in the TSE CSV.  
No authentication is required — URLs are publicly accessible.

## Fallback behaviour

`CandidateCard` handles missing or broken URLs gracefully:
- If `fotoUrl` is absent → renders colour + initials placeholder
- If `fotoUrl` present but image fails to load (`onError`) → falls back to colour + initials
- No broken-image icons, no crashes
