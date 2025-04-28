"use client"

import type { Trait } from "@/types"
import TraitIcon from "@/components/trait-icon"

interface ResultsDisplayProps {
  rolls: Trait[]
  onRollAgain: () => void
  isRolling: boolean
}

export default function ResultsDisplay({ rolls, onRollAgain, isRolling }: ResultsDisplayProps) {
  // Calculate how many traits to show (max 100 for performance)
  const maxTraitsToShow = 100
  const traitsToShow =
    rolls.length > maxTraitsToShow
      ? [...rolls.slice(0, 20), ...rolls.slice(rolls.length - maxTraitsToShow + 20)]
      : rolls

  // Determine the appropriate size based on the number of traits
  const getIconSize = () => {
    if (traitsToShow.length > 50) return "xs"
    if (traitsToShow.length > 20) return "sm"
    return "sm"
  }

  // Get rarity name for a trait
  const getRarityName = (traitId: string) => {
    if (["solar", "deadeye", "ethereal", "monarch"].includes(traitId)) {
      return "Mythic"
    } else if (["scholar", "marksman", "fortune", "blitz"].includes(traitId)) {
      return "Legendary"
    } else {
      return "Common"
    }
  }

  // Get color class for rarity
  const getRarityColorClass = (traitId: string) => {
    if (["solar", "deadeye", "ethereal", "monarch"].includes(traitId)) {
      return "text-purple-400"
    } else if (["scholar", "marksman", "fortune", "blitz"].includes(traitId)) {
      return "text-yellow-400"
    } else {
      return "text-gray-400"
    }
  }

  // Get the final trait
  const finalTrait = rolls.length > 0 ? rolls[rolls.length - 1] : null

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {isRolling ? (
            <span className="text-blue-400">Rolling...</span>
          ) : rolls.length > 0 ? (
            <>
              It took <span className="text-green-400">{rolls.length}</span> rolls
            </>
          ) : (
            <span className="text-gray-400">Waiting to roll...</span>
          )}
        </h2>

        {finalTrait && !isRolling && (
          <p className="text-lg">
            Found: <span className={getRarityColorClass(finalTrait.id)}>{finalTrait.name}</span>{" "}
            <span className="text-sm">({getRarityName(finalTrait.id)})</span>
          </p>
        )}
      </div>

      {!isRolling && rolls.length > 0 && (
        <div className="w-full">
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-15 gap-1 p-4 bg-gray-900/50 rounded-lg">
            {traitsToShow.map((roll, index) => (
              <div key={index} className="flex-shrink-0 animate-fadeIn" style={{ animationDelay: `${index * 0.01}s` }}>
                <TraitIcon trait={roll} size={getIconSize()} isTarget={index === rolls.length - 1} />
              </div>
            ))}
          </div>

          {rolls.length > maxTraitsToShow && (
            <p className="text-center text-gray-400 mt-2">
              Showing {maxTraitsToShow} out of {rolls.length} rolls
            </p>
          )}
        </div>
      )}

      {rolls.length > 0 && !isRolling && (
        <button
          onClick={onRollAgain}
          className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-blue-400 font-semibold transition-colors"
          aria-label="Roll again"
        >
          Roll Again
        </button>
      )}
    </div>
  )
}
