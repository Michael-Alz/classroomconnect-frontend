import type { QuestionCardProps } from "../types";

export function QuestionCard({ emoji, text }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-lg">
      <div className="text-center space-y-4">
        <div
          className="text-6xl sm:text-7xl"
          style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.12))" }}
        >
          {emoji}
        </div>
        <p className="text-lg sm:text-xl font-medium text-gray-800 leading-snug">
          {text}
        </p>
      </div>
    </div>
  );
}
