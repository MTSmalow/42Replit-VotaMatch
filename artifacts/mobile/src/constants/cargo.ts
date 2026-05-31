import type { Cargo } from "@/src/lib/types";

export const CARGO_ORDER: Cargo[] = [
  "deputadoEstadual",
  "deputadoFederal",
  "senador",
  "governador",
  "presidente",
];

export const CARGO_LABELS: Record<Cargo, string> = {
  deputadoEstadual: "Deputado Estadual",
  deputadoFederal: "Deputado Federal",
  senador: "Senador",
  governador: "Governador",
  presidente: "Presidente",
};

export const CARGO_DIGITS: Record<Cargo, number> = {
  deputadoEstadual: 5,
  deputadoFederal: 4,
  senador: 3,
  governador: 2,
  presidente: 2,
};

export const HAS_FILTER: Record<Cargo, boolean> = {
  deputadoEstadual: true,
  deputadoFederal: true,
  senador: false,
  governador: false,
  presidente: false,
};

export const TOP_N: Record<Cargo, number> = {
  deputadoEstadual: 30,
  deputadoFederal: 30,
  senador: 100,
  governador: 100,
  presidente: 100,
};
