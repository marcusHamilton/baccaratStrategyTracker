import { useState, useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

const BETTING_PATTERN = [
  { position: "Player", nextIfLost: 1, color: "blue" },
  { position: "Banker", nextIfLost: 2, color: "red" },
  { position: "Player", nextIfLost: 3, color: "blue" },
  { position: "Player", nextIfLost: 4, color: "blue" },
  { position: "Banker", nextIfLost: 5, color: "red" },
  { position: "Banker", nextIfLost: 0, color: "red" },
];

export default function BaccaratStrategyTracker() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [startingBet, setStartingBet] = useState(1);
  const [playerPayout, setPlayerPayout] = useState(1);
  const [bankerPayout, setBankerPayout] = useState(0.95);
  const [currentBet, setCurrentBet] = useState(1);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (IS_BROWSER) {
      localStorage.setItem("baccarat-dark-mode", JSON.stringify(newMode));
    }
  };

  // Load dark mode preference from localStorage on component mount
  useEffect(() => {
    if (IS_BROWSER) {
      const savedDarkMode = localStorage.getItem("baccarat-dark-mode");
      if (savedDarkMode !== null) {
        setIsDarkMode(JSON.parse(savedDarkMode));
      }
    }
  }, []);

  // Initialize the app with starting bet and payouts
  const initializeTracker = (
    initialBet: number,
    initialPlayerPayout: number,
    initialBankerPayout: number
  ) => {
    setStartingBet(initialBet);
    setPlayerPayout(initialPlayerPayout);
    setBankerPayout(initialBankerPayout);
    setCurrentBet(initialBet);
    setCurrentPatternIndex(0);
    setIsInitialized(true);
    // Reset tracking stats
    setWins(0);
    setLosses(0);
    setTotalAmount(0);
  };

  // Handle a winning hand
  const handleWin = () => {
    // Determine payout based on current betting position
    const currentPosition = BETTING_PATTERN[currentPatternIndex].position;
    const winAmount =
      currentPosition === "Player"
        ? currentBet * playerPayout
        : currentBet * bankerPayout;

    // Update wins and total amount
    setWins((prev) => prev + 1);
    setTotalAmount((prev) => prev + winAmount);

    // Reset to original bet and start of pattern
    setCurrentBet(startingBet);
    setCurrentPatternIndex(0);
  };

  // Handle a losing hand
  const handleLose = () => {
    // Update losses and total amount
    setLosses((prev) => prev + 1);
    setTotalAmount((prev) => prev - currentBet);

    // Double the bet and move to next position in pattern
    const nextIndex = BETTING_PATTERN[currentPatternIndex].nextIfLost;
    setCurrentBet((prevBet) => prevBet * 2);
    setCurrentPatternIndex(nextIndex);
  };

  // Handle a tie (repeat current bet and position)
  const handleTie = () => {
    // Do nothing - stay on same bet and position
  };

  // Calculate win percentage
  const winPercentage =
    wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;

  // Determine color classes based on current position
  const currentPositionColor = BETTING_PATTERN[currentPatternIndex].color;

  // Dynamic base classes for light/dark mode
  const bgClass = isDarkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-gray-100 text-gray-900";
  const cardClass = isDarkMode
    ? "bg-gray-800 border-gray-700 shadow-2xl"
    : "bg-white border-gray-200 shadow-md";
  const inputClass = isDarkMode
    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900";

  // If not initialized, show bet input
  if (!isInitialized) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-screen ${bgClass} p-4 transition-colors duration-300`}
      >
        <div
          className={`relative w-full max-w-md p-8 rounded-xl border ${cardClass} transition-all duration-300`}
        >
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          <div className="pb-2">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Baccarat Strategy Tracker
            </h1>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="starting-bet" className="block mb-2 font-medium">
                Starting Bet Amount
              </label>
              <input
                id="starting-bet"
                type="number"
                min="1"
                step="0.01"
                value={startingBet}
                onInput={(e) =>
                  setStartingBet(Number((e.target as HTMLInputElement).value))
                }
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${inputClass}`}
                placeholder="Enter your starting bet"
              />
            </div>

            <div>
              <label htmlFor="player-payout" className="block mb-2 font-medium">
                Player Payout Ratio (1:1 = 1)
              </label>
              <input
                id="player-payout"
                type="number"
                min="0.5"
                max="2"
                step="0.01"
                value={playerPayout}
                onInput={(e) =>
                  setPlayerPayout(Number((e.target as HTMLInputElement).value))
                }
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${inputClass}`}
                placeholder="Player bet payout ratio"
              />
            </div>

            <div>
              <label htmlFor="banker-payout" className="block mb-2 font-medium">
                Banker Payout Ratio (0.95 = standard)
              </label>
              <input
                id="banker-payout"
                type="number"
                min="0.5"
                max="2"
                step="0.01"
                value={bankerPayout}
                onInput={(e) =>
                  setBankerPayout(Number((e.target as HTMLInputElement).value))
                }
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${inputClass}`}
                placeholder="Banker bet payout ratio"
              />
            </div>

            <button
              onClick={() =>
                initializeTracker(startingBet, playerPayout, bankerPayout)
              }
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Start Tracking
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main tracking interface
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${bgClass} p-4 transition-colors duration-300`}
    >
      <div
        className={`relative w-full max-w-md p-8 rounded-xl border ${cardClass} transition-all duration-300`}
      >
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>

        <div className="pb-2">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Baccarat Strategy Tracker
          </h1>
        </div>

        {/* Current Bet and Position Display */}
        <div className="mb-8 text-center space-y-2">
          <div className="text-xl">
            <span className="font-semibold">Current Bet:</span>
            <span className="ml-2 text-2xl font-bold text-green-600 dark:text-green-400">
              ${currentBet}
            </span>
          </div>
          <div className="text-xl">
            <span className="font-semibold">Bet On:</span>
            <span
              className={`ml-2 px-3 py-1 rounded-full font-bold 
                ${
                  currentPositionColor === "blue"
                    ? "bg-blue-500 text-white"
                    : "bg-red-500 text-white"
                }`}
            >
              {BETTING_PATTERN[currentPatternIndex].position}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Player Payout: {playerPayout}:1 | Banker Payout: {bankerPayout}:1
          </div>
        </div>

        {/* Outcome Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleWin}
            className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition transform hover:scale-105 focus:outline-none focus:ring-2"
          >
            Won
          </button>
          <button
            onClick={handleLose}
            className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition transform hover:scale-105 focus:outline-none focus:ring-2"
          >
            Lost
          </button>
          <button
            onClick={handleTie}
            className="bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 transition transform hover:scale-105 focus:outline-none focus:ring-2"
          >
            Tie
          </button>
        </div>

        {/* Tracking Statistics */}
        <div
          className={`grid grid-cols-2 gap-4 mb-6 p-4 rounded-lg transition-colors duration-300 
          ${
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-gray-100 border border-gray-200"
          }`}
        >
          <div className="text-center">
            <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Win Rate
            </div>
            <div
              className={`text-2xl font-bold transition-colors 
              ${
                winPercentage >= 50
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {winPercentage}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Total Profit
            </div>
            <div
              className={`text-2xl font-bold transition-colors 
              ${
                totalAmount >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              ${totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Reset Option */}
        <div className="text-center">
          <button
            onClick={() => setIsInitialized(false)}
            className="text-blue-500 dark:text-blue-400 hover:underline transition"
          >
            Reset Tracker
          </button>
        </div>
      </div>
    </div>
  );
}
