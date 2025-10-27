import type { ButtonProps } from "../types";

export function Button({
  onClick,
  disabled = false,
  children,
  variant = "primary",
}: ButtonProps) {
  const baseStyles = "px-8 py-4 rounded-2xl text-xl font-bold transition-all";

  const variantStyles = {
    primary: "bg-purple-500 text-white hover:bg-purple-600",
    secondary: "bg-gray-300 text-gray-700 hover:bg-gray-400",
  };

  const disabledStyles = "bg-gray-200 text-gray-400 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${
        disabled ? disabledStyles : variantStyles[variant]
      }`}
    >
      {children}
    </button>
  );
}
