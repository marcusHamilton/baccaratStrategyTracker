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

export const updateRootTheme = (isDark: boolean): void => {
  if (!IS_BROWSER) return;
  const root = document.getElementById("theme-root");
  if (root) {
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // Save the preference
    saveDarkMode(isDark);
  }
};

// Initialize theme on load
export const initializeTheme = (): void => {
  if (!IS_BROWSER) return;
  const isDark = loadDarkMode();
  updateRootTheme(isDark);
};
