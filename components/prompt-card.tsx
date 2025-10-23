import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface PromptCardProps {
  id: string
  title: string
  description: string | null
  category: string
  tags: string[]
  imageUrl: string | null
  ownerName?: string //
}

export function PromptCard({ id, title, description, category, tags, imageUrl, ownerName }: PromptCardProps) {
  return (
    <Link href={`/prompt/${id}`} className="cursor-pointer">
      <Card className="group h-full overflow-hidden border-purple-500/20 bg-card/50 backdrop-blur-sm hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
        {imageUrl && (
          <div className="relative h-96 w-full overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
            />
            {ownerName && (
              <div className="absolute top-2 right-2 rounded-md bg-black/60 text-white text-xs px-2 py-1">
                {ownerName.startsWith("@") ? ownerName : `@${ownerName}`}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        )}
        <CardHeader className="hidden md:block">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg group-hover:text-purple-400 transition-colors line-clamp-2">
              {title}
            </CardTitle>
            <Badge
              variant="secondary"
              className="shrink-0 bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30"
            >
              {category}
            </Badge>
          </div>
          {description && (
            <CardDescription className="line-clamp-2 text-muted-foreground">{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="hidden md:block pb-3">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-purple-500/30 text-purple-400">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-400">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
