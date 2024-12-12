import { useState, useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

// Define types for our history tracking
type GameAction = {
  type: "win" | "lose" | "tie";
  bet: number;
  patternIndex: number;
  amount: number;
  position?: string;
  timestamp?: number;
};

type GameState = {
  wins: number;
  losses: number;
  ties: number;
  totalAmount: number;
  currentBet: number;
  currentPatternIndex: number;
};

const BETTING_PATTERN = [
  { position: "Player", nextIfLost: 1, color: "blue" },
  { position: "Banker", nextIfLost: 2, color: "red" },
  { position: "Player", nextIfLost: 3, color: "blue" },
  { position: "Player", nextIfLost: 4, color: "blue" },
  { position: "Banker", nextIfLost: 5, color: "red" },
  { position: "Banker", nextIfLost: 0, color: "red" },
];

const HistoryCard = ({
  action,
  index,
  isDarkMode,
}: {
  action: GameAction;
  index: number;
  isDarkMode: boolean;
}) => {
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

  const cardClass = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  return (
    <div
      className={`p-3 border rounded-lg mb-2 ${cardClass} transition-colors duration-300`}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Hand #{index + 1}</span>
        <span className={`capitalize font-bold ${getActionColor(action.type)}`}>
          {action.type}
        </span>
      </div>
      <div className="mt-1 text-sm grid grid-cols-2 gap-2">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Bet: </span>
          <span>${action.bet}</span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Position: </span>
          <span>{action.position}</span>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 dark:text-gray-400">Result: </span>
          <span
            className={action.amount >= 0 ? "text-green-500" : "text-red-500"}
          >
            {action.amount >= 0 ? "+" : ""}
            {action.amount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function BaccaratStrategyTracker() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [startingBet, setStartingBet] = useState(1);
  const [playerPayout, setPlayerPayout] = useState(1);
  const [bankerPayout, setBankerPayout] = useState(0.95);
  const [currentBet, setCurrentBet] = useState(1);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Enhanced statistics
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [ties, setTies] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Animation states
  const [winAnimation, setWinAnimation] = useState(false);
  const [loseAnimation, setLoseAnimation] = useState(false);
  const [tieAnimation, setTieAnimation] = useState(false);

  // History tracking for undo/redo
  const [history, setHistory] = useState<GameAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Load dark mode preference from localStorage
  useEffect(() => {
    if (IS_BROWSER) {
      const savedDarkMode = localStorage.getItem("baccarat-dark-mode");
      if (savedDarkMode !== null) {
        setIsDarkMode(JSON.parse(savedDarkMode));
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (IS_BROWSER) {
      localStorage.setItem("baccarat-dark-mode", JSON.stringify(newMode));
    }
  };

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
    setWins(0);
    setLosses(0);
    setTies(0);
    setTotalAmount(0);
    setHistory([]);
    setHistoryIndex(-1);
  };

  const addToHistory = (action: GameAction) => {
    const currentPosition = BETTING_PATTERN[currentPatternIndex].position;
    const newAction = {
      ...action,
      position: currentPosition,
      timestamp: Date.now(),
    };
    const newHistory = [...history.slice(0, historyIndex + 1), newAction];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleWin = () => {
    const currentPosition = BETTING_PATTERN[currentPatternIndex].position;
    const winAmount =
      currentPosition === "Player"
        ? currentBet * playerPayout
        : currentBet * bankerPayout;

    setWins((prev) => prev + 1);
    setTotalAmount((prev) => prev + winAmount);
    setWinAnimation(true);
    setTimeout(() => setWinAnimation(false), 500);

    addToHistory({
      type: "win",
      bet: currentBet,
      patternIndex: currentPatternIndex,
      amount: winAmount,
    });

    setCurrentBet(startingBet);
    setCurrentPatternIndex(0);
  };

  const handleLose = () => {
    setLosses((prev) => prev + 1);
    setTotalAmount((prev) => prev - currentBet);
    setLoseAnimation(true);
    setTimeout(() => setLoseAnimation(false), 500);

    addToHistory({
      type: "lose",
      bet: currentBet,
      patternIndex: currentPatternIndex,
      amount: -currentBet,
    });

    const nextIndex = BETTING_PATTERN[currentPatternIndex].nextIfLost;
    setCurrentBet((prev) => prev * 2);
    setCurrentPatternIndex(nextIndex);
  };

  const handleTie = () => {
    setTies((prev) => prev + 1);
    setTieAnimation(true);
    setTimeout(() => setTieAnimation(false), 500);

    addToHistory({
      type: "tie",
      bet: currentBet,
      patternIndex: currentPatternIndex,
      amount: 0,
    });
  };

  const handleUndo = () => {
    if (historyIndex >= 0) {
      const lastAction = history[historyIndex];

      // Reverse the last action
      switch (lastAction.type) {
        case "win":
          setWins((prev) => prev - 1);
          setTotalAmount((prev) => prev - lastAction.amount);
          break;
        case "lose":
          setLosses((prev) => prev - 1);
          setTotalAmount((prev) => prev + lastAction.amount); // Note: Adding because amount is negative
          break;
        case "tie":
          setTies((prev) => prev - 1);
          break;
      }

      // Move history index back
      setHistoryIndex((prev) => prev - 1);

      // Reset game state based on the new last action
      if (historyIndex > 0) {
        const previousAction = history[historyIndex - 1];
        if (previousAction.type === "win") {
          setCurrentBet(startingBet);
          setCurrentPatternIndex(0);
        } else {
          const prevPatternIndex = previousAction.patternIndex;
          setCurrentBet(previousAction.bet);
          setCurrentPatternIndex(prevPatternIndex);
        }
      } else {
        // If we're undoing to the start, reset to initial state
        setCurrentBet(startingBet);
        setCurrentPatternIndex(0);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextAction = history[historyIndex + 1];

      // Reapply the action
      switch (nextAction.type) {
        case "win":
          setWins((prev) => prev + 1);
          setTotalAmount((prev) => prev + nextAction.amount);
          // After a win, reset to starting bet and first pattern
          setCurrentBet(startingBet);
          setCurrentPatternIndex(0);
          break;
        case "lose":
          setLosses((prev) => prev + 1);
          setTotalAmount((prev) => prev + nextAction.amount);
          // After a loss, double bet and move to next pattern
          setCurrentBet(nextAction.bet * 2);
          setCurrentPatternIndex(
            BETTING_PATTERN[nextAction.patternIndex].nextIfLost
          );
          break;
        case "tie":
          setTies((prev) => prev + 1);
          // On tie, keep current bet and pattern
          setCurrentBet(nextAction.bet);
          setCurrentPatternIndex(nextAction.patternIndex);
          break;
      }

      // Move history index forward
      setHistoryIndex((prev) => prev + 1);
    }
  };

  const totalHands = wins + losses + ties;
  const winPercentage =
    totalHands > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;

  const bgClass = isDarkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-gray-100 text-gray-900";
  const cardClass = isDarkMode
    ? "bg-gray-800 border-gray-700 shadow-2xl"
    : "bg-white border-gray-200 shadow-md";
  const inputClass = isDarkMode
    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900";

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

  if (!isInitialized) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-screen ${bgClass} p-4 transition-colors duration-300`}
      >
        <div
          className={`relative w-full max-w-md p-8 rounded-xl border ${cardClass} transition-all duration-300`}
        >
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

  const visibleHistory = history.slice(0, historyIndex + 1);

  return (
    <div
      className={`min-h-screen ${bgClass} p-4 transition-colors duration-300`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* History Panel - Shows on left for desktop, top for mobile */}
          <div className="lg:w-1/3 order-2 lg:order-1">
            <div
              className={`rounded-xl border ${cardClass} transition-all duration-300 p-4 sticky top-4`}
            >
              <h2 className="text-xl font-bold mb-4">Hand History</h2>
              <div className="overflow-y-auto max-h-[calc(100vh-200px)] space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
                {visibleHistory.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No hands played yet
                  </div>
                ) : (
                  visibleHistory
                    .slice() // Create a shallow copy to avoid mutating the original array
                    .reverse() // Reverse the copy to show newest first
                    .map((action, idx) => (
                      <HistoryCard
                        key={action.timestamp}
                        action={action}
                        index={visibleHistory.length - 1 - idx}
                        isDarkMode={isDarkMode}
                      />
                    ))
                )}
              </div>
            </div>
          </div>

          {/* Main Tracker Panel */}
          <div className="lg:w-2/3 order-1 lg:order-2">
            <div
              className={`relative rounded-xl border ${cardClass} transition-all duration-300 p-8`}
            >
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
                      BETTING_PATTERN[currentPatternIndex].color === "blue"
                        ? "bg-blue-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {BETTING_PATTERN[currentPatternIndex].position}
                  </span>
                </div>
              </div>

              {/* Outcome Buttons */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                  onClick={handleWin}
                  className={`${winButtonClass} bg-green-500 text-white p-3 rounded-lg hover:bg-green-600`}
                >
                  Won
                </button>
                <button
                  onClick={handleLose}
                  className={`${loseButtonClass} bg-red-500 text-white p-3 rounded-lg hover:bg-red-600`}
                >
                  Lost
                </button>
                <button
                  onClick={handleTie}
                  className={`${tieButtonClass} bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600`}
                >
                  Tie
                </button>
              </div>

              {/* Undo/Redo Buttons */}
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex < 0}
                  className={`px-4 py-2 rounded-lg ${
                    historyIndex < 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-700"
                  } bg-gray-600 text-white transition`}
                >
                  ↩ Undo
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className={`px-4 py-2 rounded-lg ${
                    historyIndex >= history.length - 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-700"
                  } bg-gray-600 text-white transition`}
                >
                  Redo ↪
                </button>
              </div>

              {/* Enhanced Statistics Display */}
              <div
                className={`grid grid-cols-2 gap-4 mb-6 p-4 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-gray-100 border border-gray-200"
                }`}
              >
                <div className="text-center col-span-2">
                  <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Total Hands
                  </div>
                  <div className="text-2xl font-bold">{totalHands}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Win Rate
                  </div>
                  <div
                    className={`text-2xl font-bold ${
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
                    className={`text-2xl font-bold ${
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
        </div>
      </div>
    </div>
  );
}
