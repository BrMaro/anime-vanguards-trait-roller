"use client"

import { useState, useRef } from "react"
import TraitSelector from "@/components/trait-selector"
import RollButton from "@/components/roll-button"
import ResultsDisplay from "@/components/results-display"
import { traits } from "@/data/traits"
import type { Trait } from "@/types"

export default function Home() {
  const [selectedTrait, setSelectedTrait] = useState<Trait | null>(null)
  const [rolls, setRolls] = useState<Trait[]>([])
  const [isRolling, setIsRolling] = useState(false)
  const [hasRolled, setHasRolled] = useState(false)
  const [rollCount, setRollCount] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const rollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleTraitSelect = (trait: Trait) => {
    setSelectedTrait(trait)
    setRolls([])
    setRollCount(0)
    setHasRolled(false)
    setShowResults(false)
  }

  const rollTrait = (): Trait => {
    const random = Math.random()
    let cumulativeProbability = 0

    for (const trait of traits) {
      cumulativeProbability += trait.probability
      if (random < cumulativeProbability) {
        // For traits with levels, randomly assign a level
        if (trait.levels) {
          return {
            ...trait,
            currentLevel: Math.floor(Math.random() * trait.levels) + 1,
          }
        }
        return trait
      }
    }

    // Fallback (should never happen if probabilities sum to 1)
    return traits[0]
  }

  const handleRoll = () => {
    if (!selectedTrait || isRolling) return

    setIsRolling(true)
    setHasRolled(true)
    setRolls([])
    setRollCount(0)
    setShowResults(false)

    // Optimize by doing calculations without rendering each step
    const simulateRolls = () => {
      let foundTarget = false
      let count = 0
      const rolledTraits: Trait[] = []

      while (!foundTarget && count < 100000) {
        // Safety limit
        count++
        setRollCount(count) // Update count in real-time

        const newTrait = rollTrait()
        rolledTraits.push(newTrait)

        // Check if we've hit the target trait or reached pity
        if (
          newTrait.id === selectedTrait.id ||
          (selectedTrait.id === "monarch" && selectedTrait.pity && count >= selectedTrait.pity)
        ) {
          // If we hit pity for Monarch, ensure the last roll is Monarch
          if (
            selectedTrait.id === "monarch" &&
            newTrait.id !== "monarch" &&
            selectedTrait.pity &&
            count >= selectedTrait.pity
          ) {
            rolledTraits[rolledTraits.length - 1] = traits.find((t) => t.id === "monarch")!
          }

          foundTarget = true
        }
      }

      // Only show results after all calculations are done
      setRolls(rolledTraits)
      setShowResults(true)
      setIsRolling(false)
    }

    // Use a small timeout to allow UI to update before heavy calculation
    setTimeout(simulateRolls, 100)
  }

  const handleStopRolling = () => {
    if (rollIntervalRef.current) {
      clearInterval(rollIntervalRef.current)
      rollIntervalRef.current = null
    }
    setIsRolling(false)
    setShowResults(true)
  }

  const handleRollAgain = () => {
    setRolls([])
    setRollCount(0)
    setHasRolled(false)
    setShowResults(false)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <header className="w-full max-w-4xl text-center mb-8 mt-8">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          Trait Roller
        </h1>
        <p className="text-gray-400">Simulate trait rolls for Anime Vanguards</p>
      </header>

      <div className="w-full max-w-4xl flex flex-col items-center gap-8">
        <TraitSelector traits={traits} selectedTrait={selectedTrait} onSelect={handleTraitSelect} />

        <div className="flex flex-col items-center gap-4 w-full">
          <RollButton
            onRoll={handleRoll}
            onStop={handleStopRolling}
            disabled={!selectedTrait || isRolling}
            isRolling={isRolling}
          />

          {isRolling && (
            <div className="text-xl font-bold text-blue-400">
              Rolls: <span className="text-green-400">{rollCount}</span>
            </div>
          )}
        </div>

        {hasRolled && showResults && (
          <ResultsDisplay rolls={rolls} onRollAgain={handleRollAgain} isRolling={isRolling} />
        )}
      </div>
    </main>
  )
}
