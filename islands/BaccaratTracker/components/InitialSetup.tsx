import { useState } from "preact/hooks";
import { Card } from "../../../components/shared/Card.tsx";
import { Button } from "../../../components/shared/Button.tsx";

interface InitialSetupProps {
  isDarkMode: boolean;
  onInitialize: (settings: {
    startingBet: number;
    playerPayout: number;
    bankerPayout: number;
  }) => void;
  onToggleDarkMode: () => void; // Added this prop
}

export function InitialSetup({
  isDarkMode,
  onInitialize,
  onToggleDarkMode,
}: InitialSetupProps) {
  const [startingBet, setStartingBet] = useState(1);
  const [playerPayout, setPlayerPayout] = useState(1);
  const [bankerPayout, setBankerPayout] = useState(0.95);

  const inputClass = isDarkMode
    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";

  const labelClass = isDarkMode
    ? "block mb-2 font-medium text-gray-200"
    : "block mb-2 font-medium text-gray-700";

  return (
    <div class="p-4">
      <Card isDarkMode={isDarkMode} class="max-w-md mx-auto p-8 relative">
        <button
          onClick={onToggleDarkMode}
          class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>

        <h1
          class={`text-3xl font-bold mb-6 text-center ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Baccarat Strategy Tracker
        </h1>

        <div class="space-y-4">
          <div>
            <label class={labelClass}>Starting Bet Amount</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={startingBet}
              onInput={(e) =>
                setStartingBet(Number((e.target as HTMLInputElement).value))}
              class={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${inputClass}`}
            />
          </div>

          <div>
            <label class={labelClass}>Player Payout Ratio (1:1 = 1)</label>
            <input
              type="number"
              min="0.5"
              max="2"
              step="0.01"
              value={playerPayout}
              onInput={(e) =>
                setPlayerPayout(Number((e.target as HTMLInputElement).value))}
              class={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${inputClass}`}
            />
          </div>

          <div>
            <label class={labelClass}>
              Banker Payout Ratio (0.95 = standard)
            </label>
            <input
              type="number"
              min="0.5"
              max="2"
              step="0.01"
              value={bankerPayout}
              onInput={(e) =>
                setBankerPayout(Number((e.target as HTMLInputElement).value))}
              class={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${inputClass}`}
            />
          </div>

          <Button
            onClick={() =>
              onInitialize({ startingBet, playerPayout, bankerPayout })}
            class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start Tracking
          </Button>
        </div>
      </Card>
    </div>
  );
}
