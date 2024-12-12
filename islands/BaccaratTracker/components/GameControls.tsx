import { Button } from "../../../components/shared/Button.tsx";
import type { GameState } from "../../../utils/types.ts";
import { BETTING_PATTERN } from "../../../utils/constants.ts";

interface GameControlsProps {
  gameState: GameState;
  onWin: () => void;
  onLose: () => void;
  onTie: () => void;
  winAnimation: boolean; // Added animation props
  loseAnimation: boolean;
  tieAnimation: boolean;
}

export function GameControls({
  gameState,
  onWin,
  onLose,
  onTie,
  winAnimation,
  loseAnimation,
  tieAnimation,
}: GameControlsProps) {
  const { currentBet, currentPatternIndex } = gameState;
  const currentPosition = BETTING_PATTERN[currentPatternIndex].position;

  // Button animation classes
  const buttonBaseClass =
    "transition-all duration-300 transform active:scale-95";
  const winButtonClass = `${buttonBaseClass} ${
    winAnimation ? "scale-110 brightness-110" : ""
  }`;
  const loseButtonClass = `${buttonBaseClass} ${
    loseAnimation ? "scale-90 brightness-90" : ""
  }`;
  const tieButtonClass = `${buttonBaseClass} ${
    tieAnimation ? "scale-105 brightness-105" : ""
  }`;

  return (
    <div class="space-y-6">
      <div class="text-center space-y-2">
        <div class="text-xl">
          <span class="font-semibold">Current Bet:</span>
          <span class="ml-2 text-2xl font-bold text-green-600 dark:text-green-400">
            ${currentBet}
          </span>
        </div>
        <div class="text-xl">
          <span class="font-semibold">Bet On:</span>
          <span
            class={`ml-2 px-3 py-1 rounded-full font-bold 
            ${
              BETTING_PATTERN[currentPatternIndex].color === "blue"
                ? "bg-blue-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {currentPosition}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <Button variant="success" onClick={onWin} class={winButtonClass}>
          Won
        </Button>
        <Button variant="danger" onClick={onLose} class={loseButtonClass}>
          Lost
        </Button>
        <Button variant="warning" onClick={onTie} class={tieButtonClass}>
          Tie
        </Button>
      </div>
    </div>
  );
}
