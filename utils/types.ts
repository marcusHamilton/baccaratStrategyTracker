export type GameAction = {
  type: "win" | "lose" | "tie";
  bet: number;
  patternIndex: number;
  amount: number;
  position?: string;
  timestamp?: number;
};

export type GameState = {
  wins: number;
  losses: number;
  ties: number;
  totalAmount: number;
  currentBet: number;
  currentPatternIndex: number;
};

export type BettingPattern = {
  position: string;
  nextIfLost: number;
  color: string;
}[];
