"use client"
import type { Trait } from "@/types"
import TraitIcon from "@/components/trait-icon"

interface TraitSelectorProps {
  traits: Trait[]
  selectedTrait: Trait | null
  onSelect: (trait: Trait) => void
}

export default function TraitSelector({ traits, selectedTrait, onSelect }: TraitSelectorProps) {
  // Group traits by their correct rarity tiers
  const traitCategories = [
    {
      name: "Common",
      color: "from-gray-500/30 to-gray-600/30",
      traits: traits.filter((t) => ["range", "swift", "vigor"].includes(t.id)),
    },
    {
      name: "Legendary",
      color: "from-yellow-500/30 to-amber-600/30",
      traits: traits.filter((t) => ["scholar", "marksman", "fortune", "blitz"].includes(t.id)),
    },
    {
      name: "Mythic",
      color: "from-purple-500/30 to-pink-600/30",
      traits: traits.filter((t) => ["solar", "deadeye", "ethereal", "monarch"].includes(t.id)),
    },
  ]

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">Select a Trait to Roll For</h2>

      <div className="grid grid-cols-1 gap-6">
        {traitCategories.map((category) => (
          <div key={category.name} className="w-full">
            <h3
              className={`
              text-md font-medium mb-2 
              ${
                category.name === "Common"
                  ? "text-gray-300"
                  : category.name === "Legendary"
                    ? "text-yellow-300"
                    : "text-purple-300"
              }
            `}
            >
              {category.name}
            </h3>
            <div
              className={`
              grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 
              bg-gradient-to-r ${category.color} p-3 rounded-lg
            `}
            >
              {category.traits.map((trait) => (
                <button
                  key={trait.id}
                  onClick={() => onSelect(trait)}
                  className={`
                    relative flex flex-col items-center transition-all duration-300 p-1
                    ${selectedTrait?.id === trait.id ? "scale-110" : "hover:scale-105"}
                  `}
                  aria-label={`Select ${trait.name} trait`}
                  aria-pressed={selectedTrait?.id === trait.id}
                >
                  <div
                    className={`
                      p-1 rounded-lg
                      ${
                        selectedTrait?.id === trait.id
                          ? "bg-gradient-to-r from-blue-500/30 to-green-500/30 ring-2 ring-blue-400"
                          : "bg-gray-800 hover:bg-gray-700"
                      }
                    `}
                  >
                    <TraitIcon trait={trait} size="sm" />
                  </div>
                  <span
                    className={`mt-1 text-xs ${selectedTrait?.id === trait.id ? "text-blue-400" : "text-gray-400"}`}
                  >
                    {trait.name}
                  </span>
                  <span
                    className={`
                    text-xs
                    ${
                      category.name === "Common"
                        ? "text-gray-500"
                        : category.name === "Legendary"
                          ? "text-yellow-500"
                          : "text-purple-500"
                    }
                  `}
                  >
                    {(trait.probability * 100).toFixed(trait.probability < 0.01 ? 3 : 2)}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTrait && (
        <div className="mt-6 text-center">
          <p className="text-lg">
            Rolling for: <span className="text-blue-400 font-semibold">{selectedTrait.name}</span>
            {selectedTrait.pity && (
              <span className="text-sm text-gray-400 ml-2">(Guaranteed after {selectedTrait.pity} rolls)</span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
