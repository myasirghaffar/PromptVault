"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { CategoryFilter } from "@/components/category-filter"
import { PromptCard } from "@/components/prompt-card"

interface Prompt {
  id: string
  title: string
  description: string | null
  prompt_text: string
  category: string
  tags: string[]
  image_url: string | null
  profiles?: { username?: string | null; is_admin?: boolean | null } //
}

interface HomeClientProps {
  prompts: Prompt[]
  categories: string[]
}

export function HomeClient({ prompts, categories }: HomeClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || prompt.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <>
      {/* Search and Filter */}
      <div className="mb-8 space-y-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search prompts, tags, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 border-purple-500/20 focus:border-purple-500 bg-card/50 backdrop-blur-sm"
          />
        </div>

        <div className="flex justify-center">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </div>

      {/* Prompts Grid */}
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
          {filteredPrompts.map((prompt) => {
            const ownerName =
              prompt.profiles?.username || (prompt.profiles?.is_admin ? "Admin" : undefined) || undefined
            return (
              <PromptCard
                key={prompt.id}
                id={prompt.id}
                title={prompt.title}
                description={prompt.description}
                category={prompt.category}
                tags={prompt.tags}
                imageUrl={prompt.image_url}
                ownerName={ownerName} //
              />
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No prompts found matching your search.</p>
        </div>
      )}
    </>
  )
}
