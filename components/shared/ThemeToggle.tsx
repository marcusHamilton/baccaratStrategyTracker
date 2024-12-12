import { IS_BROWSER } from "$fresh/runtime.ts";

export function ThemeToggle({
  isDarkMode,
  onToggle,
}: {
  isDarkMode: boolean;
  onToggle: () => void;
}) {
  if (!IS_BROWSER) return null;

  return (
    <button
      onClick={onToggle}
      class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      aria-label="Toggle theme"
    >
      {isDarkMode ? "☀️" : "🌙"}
    </button>
  );
}
