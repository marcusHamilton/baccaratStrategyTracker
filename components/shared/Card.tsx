import { ComponentChildren } from "preact";

interface CardProps {
  children: ComponentChildren;
  isDarkMode: boolean;
  class?: string;
}

export function Card({
  children,
  isDarkMode,
  class: className = "",
}: CardProps) {
  const cardClass = isDarkMode
    ? "bg-gray-800 border-gray-700 shadow-2xl"
    : "bg-white border-gray-200 shadow-md";

  return (
    <div
      class={`rounded-xl border ${cardClass} transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
