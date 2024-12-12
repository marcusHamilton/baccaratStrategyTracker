import { useState, useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Card } from "../../components/shared/Card.tsx";
import { Button } from "../../components/shared/Button.tsx";
import { InitialSetup } from "./components/InitialSetup.tsx";
import { GameControls } from "./components/GameControls.tsx";
import { Statistics } from "./components/Statistics.tsx";
import { History } from "./components/History.tsx";
import type { GameState, GameAction } from "../../utils/types.ts";
import { BETTING_PATTERN } from "../../utils/constants.ts";
import {
  loadDarkMode,
  saveDarkMode,
  loadGameState,
  saveGameState,
} from "../../utils/localStorage.ts";
import { updateRootTheme } from "../../utils/theme.ts";

export default function BaccaratTracker() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [startingBet, setStartingBet] = useState(1);
  const [playerPayout, setPlayerPayout] = useState(1);
  const [bankerPayout, setBankerPayout] = useState(0.95);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [actionHistory, setActionHistory] = useState<GameAction[]>([]);

  const [gameState, setGameState] = useState<GameState>({
    wins: 0,
    losses: 0,
    ties: 0,
    totalAmount: 0,
    currentBet: 1,
    currentPatternIndex: 0,
  });

  const [history, setHistory] = useState<GameAction[]>([]);

  // Load saved state
  useEffect(() => {
    if (IS_BROWSER) {
      const savedDarkMode = loadDarkMode();
      setIsDarkMode(savedDarkMode);
      updateRootTheme(savedDarkMode);

      const savedState = loadGameState();
      if (savedState) {
        setGameState(savedState.gameState);
        setHistory(savedState.history);
        setActionHistory(savedState.actionHistory || []);
        setHistoryIndex(savedState.historyIndex ?? -1);
        setIsInitialized(true);
        setStartingBet(savedState.startingBet);
        setPlayerPayout(savedState.playerPayout);
        setBankerPayout(savedState.bankerPayout);
      }
    }
  }, []);

  // Save state on changes
  useEffect(() => {
    if (IS_BROWSER && isInitialized) {
      saveGameState({
        gameState,
        history,
        startingBet,
        playerPayout,
        bankerPayout,
        actionHistory,
        historyIndex,
      });
    }
  }, [
    gameState,
    history,
    startingBet,
    playerPayout,
    bankerPayout,
    actionHistory,
    historyIndex,
  ]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    saveDarkMode(newMode);
    updateRootTheme(newMode);
  };

  const addToHistory = (action: Omit<GameAction, "position" | "timestamp">) => {
    const currentPosition =
      BETTING_PATTERN[gameState.currentPatternIndex].position;
    const newAction: GameAction = {
      ...action,
      position: currentPosition,
      timestamp: Date.now(),
    };
    setHistory((prev) => [...prev, newAction]);
    setActionHistory((prev) => [...prev.slice(0, historyIndex + 1), newAction]);
    setHistoryIndex((prev) => prev + 1);
  };

  const handleWin = () => {
    const currentPosition =
      BETTING_PATTERN[gameState.currentPatternIndex].position;
    const winAmount =
      currentPosition === "Player"
        ? gameState.currentBet * playerPayout
        : gameState.currentBet * bankerPayout;

    setGameState((prev) => ({
      ...prev,
      wins: prev.wins + 1,
      totalAmount: prev.totalAmount + winAmount,
      currentBet: startingBet,
      currentPatternIndex: 0,
    }));

    addToHistory({
      type: "win",
      bet: gameState.currentBet,
      patternIndex: gameState.currentPatternIndex,
      amount: winAmount,
    });
  };

  const handleLose = () => {
    setGameState((prev) => ({
      ...prev,
      losses: prev.losses + 1,
      totalAmount: prev.totalAmount - prev.currentBet,
      currentBet: prev.currentBet * 2,
      currentPatternIndex: BETTING_PATTERN[prev.currentPatternIndex].nextIfLost,
    }));

    addToHistory({
      type: "lose",
      bet: gameState.currentBet,
      patternIndex: gameState.currentPatternIndex,
      amount: -gameState.currentBet,
    });
  };

  const handleTie = () => {
    setGameState((prev) => ({
      ...prev,
      ties: prev.ties + 1,
    }));

    addToHistory({
      type: "tie",
      bet: gameState.currentBet,
      patternIndex: gameState.currentPatternIndex,
      amount: 0,
    });
  };

  const handleUndo = () => {
    if (historyIndex >= 0) {
      const lastAction = actionHistory[historyIndex];

      // Reverse the last action
      switch (lastAction.type) {
        case "win":
          setGameState((prev) => ({
            ...prev,
            wins: prev.wins - 1,
            totalAmount: prev.totalAmount - lastAction.amount,
            currentBet: startingBet,
            currentPatternIndex: 0,
          }));
          break;
        case "lose":
          setGameState((prev) => ({
            ...prev,
            losses: prev.losses - 1,
            totalAmount: prev.totalAmount + Math.abs(lastAction.amount),
            currentBet: lastAction.bet,
            currentPatternIndex: lastAction.patternIndex,
          }));
          break;
        case "tie":
          setGameState((prev) => ({
            ...prev,
            ties: prev.ties - 1,
          }));
          break;
      }

      setHistoryIndex((prev) => prev - 1);
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (historyIndex < actionHistory.length - 1) {
      const nextAction = actionHistory[historyIndex + 1];

      // Reapply the action
      switch (nextAction.type) {
        case "win":
          handleWin();
          break;
        case "lose":
          handleLose();
          break;
        case "tie":
          handleTie();
          break;
      }
    }
  };

  const handleInitialize = (settings: {
    startingBet: number;
    playerPayout: number;
    bankerPayout: number;
  }) => {
    setStartingBet(settings.startingBet);
    setPlayerPayout(settings.playerPayout);
    setBankerPayout(settings.bankerPayout);
    setGameState((prev) => ({ ...prev, currentBet: settings.startingBet }));
    setIsInitialized(true);
  };

  const handleReset = () => {
    setIsInitialized(false);
    setGameState({
      wins: 0,
      losses: 0,
      ties: 0,
      totalAmount: 0,
      currentBet: 1,
      currentPatternIndex: 0,
    });
    setHistory([]);
    setActionHistory([]);
    setHistoryIndex(-1);
    localStorage.removeItem("baccarat-game-state");
  };

  if (!isInitialized) {
    return (
      <InitialSetup
        isDarkMode={isDarkMode}
        onInitialize={handleInitialize}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <div class="min-h-screen p-4 transition-colors duration-300 text-gray-900 dark:text-gray-100">
      <div class="container mx-auto max-w-6xl h-full">
        <div class="flex flex-col lg:flex-row gap-4 h-full">
          {/* Game card panel - now first in DOM order */}
          <div class="lg:w-2/3">
            <Card isDarkMode={isDarkMode} class="relative p-4">
              <button
                onClick={toggleDarkMode}
                class="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? "☀️" : "🌙"}
              </button>

              <h1 class="text-2xl font-bold mb-4 text-center">
                Baccarat Strategy Tracker
              </h1>

              <div class="space-y-4">
                <GameControls
                  gameState={gameState}
                  onWin={handleWin}
                  onLose={handleLose}
                  onTie={handleTie}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  canUndo={historyIndex >= 0}
                  canRedo={historyIndex < actionHistory.length - 1}
                />

                <Statistics gameState={gameState} isDarkMode={isDarkMode} />

                <div class="text-center">
                  <Button
                    variant="secondary"
                    onClick={handleReset}
                    class="text-sm"
                  >
                    Reset Tracker
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* History panel */}
          <div class="lg:w-1/3">
            <History
              isDarkMode={isDarkMode}
              history={history}
              class="lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
