import type { GameState } from "../../../utils/types.ts";

interface StatisticsProps {
  gameState: GameState;
  isDarkMode: boolean;
}

export function Statistics({ gameState, isDarkMode }: StatisticsProps) {
  const { wins, losses, ties, totalAmount } = gameState;
  const totalHands = wins + losses + ties;
  const winPercentage =
    totalHands > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;

  return (
    <div
      class={`grid grid-cols-2 gap-4 p-4 rounded-lg ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-gray-100 border-gray-200"
      }`}
    >
      <div class="text-center col-span-2">
        <div class="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
          Total Hands
        </div>
        <div class="text-2xl font-bold">{totalHands}</div>
      </div>

      <div class="text-center">
        <div class="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
          Win Rate
        </div>
        <div
          class={`text-2xl font-bold ${
            winPercentage >= 50
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {winPercentage}%
        </div>
      </div>

      <div class="text-center">
        <div class="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
          Total Profit
        </div>
        <div
          class={`text-2xl font-bold ${
            totalAmount >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          ${totalAmount.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
