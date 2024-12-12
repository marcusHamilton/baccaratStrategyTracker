import { BettingPattern } from "./types.ts";

export const BETTING_PATTERN: BettingPattern = [
  { position: "Player", nextIfLost: 1, color: "blue" },
  { position: "Banker", nextIfLost: 2, color: "red" },
  { position: "Player", nextIfLost: 3, color: "blue" },
  { position: "Player", nextIfLost: 4, color: "blue" },
  { position: "Banker", nextIfLost: 5, color: "red" },
  { position: "Banker", nextIfLost: 0, color: "red" },
];
