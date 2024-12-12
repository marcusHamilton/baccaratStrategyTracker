import { JSX } from "preact";

interface ButtonProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  buttonSize?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  buttonSize = "md",
  class: className = "",
  children,
  ...props
}: ButtonProps) {
  const baseClass = "rounded-lg transition-all duration-300 font-medium";
  const sizeClass = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  }[buttonSize];

  const variantClass = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  }[variant];

  return (
    <button
      {...props}
      class={`${baseClass} ${sizeClass} ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}
