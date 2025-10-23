"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-2">
      <Button
        variant={selectedCategory === "All" ? "default" : "outline"}
        onClick={() => onSelectCategory("All")}
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
          onClick={() => onSelectCategory(category)}
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
}
