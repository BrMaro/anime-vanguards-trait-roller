export interface Trait {
  id: string
  name: string
  probability: number
  imageUrl: string
  levels: number | null
  pity: number | null
  currentLevel?: number
}
