"use client"

import Image from "next/image"
import type { Trait } from "@/types"

interface TraitIconProps {
  trait: Trait
  size?: "xs" | "sm" | "md" | "lg"
  isTarget?: boolean
}

export default function TraitIcon({ trait, size = "md", isTarget = false }: TraitIconProps) {
  const sizeMap = {
    xs: "w-8 h-8",
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  }

  const imageSizeMap = {
    xs: 32,
    sm: 48,
    md: 64,
    lg: 80,
  }

  // Determine border color based on trait rarity
  const getBorderColor = () => {
    if (["solar", "deadeye", "ethereal", "monarch"].includes(trait.id)) {
      return "border-purple-500" // Mythic
    } else if (["scholar", "marksman", "fortune", "blitz"].includes(trait.id)) {
      return "border-yellow-500" // Legendary
    } else {
      return "border-gray-500" // Common
    }
  }

  return (
    <div
      className={`
        relative rounded-md overflow-hidden
        ${sizeMap[size]}
        ${isTarget ? "ring-2 ring-green-400 animate-pulse" : `border ${getBorderColor()}`}
        ${trait.levels ? "bg-gradient-to-br from-gray-800 to-gray-900" : "bg-gray-800"}
      `}
    >
      <Image
        src={trait.imageUrl || "/placeholder.svg"}
        alt={trait.name}
        width={imageSizeMap[size]}
        height={imageSizeMap[size]}
        className="object-contain p-1"
        unoptimized // Use this to bypass image optimization for external URLs
      />

      {trait.currentLevel && (
        <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs font-bold rounded-tl-md px-1">
          {trait.currentLevel}
        </div>
      )}
    </div>
  )
}
