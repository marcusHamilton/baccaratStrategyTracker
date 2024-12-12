import { Card } from "../../../components/shared/Card.tsx";
import type { GameAction } from "../../../utils/types.ts";

interface HistoryCardProps {
  action: GameAction;
  index: number;
  isDarkMode: boolean;
}

export function HistoryCard({ action, index, isDarkMode }: HistoryCardProps) {
  const getActionColor = (type: string) => {
    switch (type) {
      case "win":
        return "text-green-500 dark:text-green-400";
      case "lose":
        return "text-red-500 dark:text-red-400";
      case "tie":
        return "text-yellow-500 dark:text-yellow-400";
      default:
        return "";
    }
  };

  return (
    <Card isDarkMode={isDarkMode} class="p-3 mb-2">
      <div class="flex justify-between items-center">
        <span class="text-sm font-medium">Hand #{index + 1}</span>
        <span class={`capitalize font-bold ${getActionColor(action.type)}`}>
          {action.type}
        </span>
      </div>

      <div class="mt-1 text-sm grid grid-cols-2 gap-2">
        <div>
          <span class="text-gray-500 dark:text-gray-400">Bet:</span>
          <span>${action.bet}</span>
        </div>
        <div>
          <span class="text-gray-500 dark:text-gray-400">Position:</span>
          <span>{action.position}</span>
        </div>
        <div class="col-span-2">
          <span class="text-gray-500 dark:text-gray-400">Result:</span>
          <span class={action.amount >= 0 ? "text-green-500" : "text-red-500"}>
            {action.amount >= 0 ? "+" : ""}
            {action.amount.toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
}
