import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, User, ArrowRight } from "lucide-react"

interface PromptCardProps {
  id: string
  title: string
  description: string | null
  category: string
  tags: string[]
  imageUrl: string | null
  ownerName?: string
}

export function PromptCard({
  id,
  title,
  description,
  category,
  tags,
  imageUrl,
  ownerName
}: PromptCardProps) {
  return (
    <Card className="h-full border-purple-500/20 bg-card/50 backdrop-blur hover:border-purple-500/40 transition-all cursor-pointer group overflow-hidden">
      <Link href={`/prompt/${id}`} className="block h-full">
        {/* Featured Image */}
        {imageUrl ? (
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-500/20 to-purple-600/20">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              unoptimized={imageUrl.startsWith("http")}
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Eye className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-sm text-purple-300">Preview</p>
            </div>
          </div>
        )}

        <CardContent className="p-6">
          <div className="space-y-3">
            {/* Category Badge */}
            <Badge variant="secondary" className="text-xs bg-purple-500/10 text-purple-300 border-purple-500/20">
              {category}
            </Badge>

            {/* Title */}
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-purple-300 transition">
              {title}
            </h3>

            {/* Description */}
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-purple-500/20 text-purple-300">
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge variant="outline" className="text-xs border-purple-500/20 text-purple-300">
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-purple-500/10">
              {ownerName && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{ownerName}</span>
                </div>
              )}
              <ArrowRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
