export const RELATION_OPTIONS = ["Amigo", "Família", "Trabalho"] as const;

export const GROUP_OPTIONS = [
  "Família Noiva",
  "Família Noivo",
  "Amigos",
  "Trabalho",
] as const;

export const CONFIRMED_OPTIONS = [
  { label: "Pendente", value: 0 },
  { label: "Confirmado", value: 1 },
  { label: "Talvez", value: 2 },
  { label: "Não vai", value: -1 },
] as const;

export type RelationOption = (typeof RELATION_OPTIONS)[number];
export type GroupOption = (typeof GROUP_OPTIONS)[number];
