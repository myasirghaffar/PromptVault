"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { memo, useCallback } from "react"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

/**
 * CategoryFilter component with memoization
 * Prevents unnecessary re-renders when parent re-renders
 */
export const CategoryFilter = memo(function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  // Memoize category selection handlers
  const handleSelectAll = useCallback(() => {
    onSelectCategory("All")
  }, [onSelectCategory])

  const handleSelectCategory = useCallback(
    (category: string) => {
      onSelectCategory(category)
    },
    [onSelectCategory]
  )
  return (
    <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-2">
      <Button
        variant={selectedCategory === "All" ? "default" : "outline"}
        onClick={handleSelectAll}
        className={cn(
          "transition-all flex-shrink-0",
          selectedCategory === "All"
            ? "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
            : "border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50",
        )}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => handleSelectCategory(category)}
          className={cn(
            "transition-all flex-shrink-0",
            selectedCategory === category
              ? "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
              : "border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50",
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  )
})
