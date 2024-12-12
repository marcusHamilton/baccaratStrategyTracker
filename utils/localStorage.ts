import { IS_BROWSER } from "$fresh/runtime.ts";

export const loadDarkMode = (): boolean => {
  if (!IS_BROWSER) return true;
  const saved = localStorage.getItem("baccarat-dark-mode");
  return saved !== null ? JSON.parse(saved) : true;
};

export const saveDarkMode = (isDark: boolean): void => {
  if (!IS_BROWSER) return;
  localStorage.setItem("baccarat-dark-mode", JSON.stringify(isDark));
};

export const loadGameState = () => {
  if (!IS_BROWSER) return null;
  const saved = localStorage.getItem("baccarat-game-state");
  return saved ? JSON.parse(saved) : null;
};

export const saveGameState = (state: any) => {
  if (!IS_BROWSER) return;
  localStorage.setItem("baccarat-game-state", JSON.stringify(state));
};
