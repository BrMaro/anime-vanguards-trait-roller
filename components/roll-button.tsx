"use client"

import { StopCircle } from "lucide-react"

interface RollButtonProps {
  onRoll: () => void
  onStop: () => void
  disabled: boolean
  isRolling: boolean
}

export default function RollButton({ onRoll, onStop, disabled, isRolling }: RollButtonProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onRoll}
        disabled={disabled}
        className={`
          relative overflow-hidden px-8 py-4 rounded-lg text-xl font-bold
          transition-all duration-300 transform
          ${
            disabled && !isRolling
              ? "bg-gray-800 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-green-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
          }
        `}
        aria-label="Roll for trait"
      >
        {isRolling ? (
          <div className="flex items-center gap-2">
            <span>Rolling</span>
            <span className="flex gap-1">
              <span className="animate-bounce delay-0">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </span>
          </div>
        ) : (
          "Roll"
        )}

        {!disabled && !isRolling && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-green-400/20 w-full h-full transform translate-x-full animate-shimmer" />
        )}
      </button>

      {isRolling && (
        <button
          onClick={onStop}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2 transition-colors"
          aria-label="Stop rolling"
        >
          <StopCircle className="h-5 w-5" />
          Stop
        </button>
      )}
    </div>
  )
}
