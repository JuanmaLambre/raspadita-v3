import { PrizeRepresentation } from "../scratch/CardStatus";

export function parsePrizes(prizesStr: string): (PrizeRepresentation | null)[] {
  if (!prizesStr) return [];

  return prizesStr.split("|").map((prize) => prize || null) as (PrizeRepresentation | null)[];
}

export function parseSelected(selectedStr: string): number[] {
  if (!selectedStr) return [];

  return selectedStr
    .split("|")
    .filter((id) => id)
    .map((id) => parseInt(id));
}
