"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Share2, ExternalLink, Check } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface Prompt {
  id: string
  title: string
  description: string | null
  prompt_text: string
  category: string
  tags: string[]
  image_url: string | null
  created_at: string
}

interface PromptDetailProps {
  prompt: Prompt
}

export function PromptDetail({ prompt }: PromptDetailProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.prompt_text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: prompt.title,
        text: prompt.description || prompt.title,
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const openInChatGPT = () => {
    const encodedPrompt = encodeURIComponent(prompt.prompt_text)
    window.open(`https://chat.openai.com/?q=${encodedPrompt}`, "_blank")
  }

  const openInGemini = () => {
    window.open("https://gemini.google.com/", "_blank")
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors">
        ← Back to prompts
      </Link>

      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border-purple-500/20 bg-card/50 backdrop-blur-xl py-6">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-3xl bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  {prompt.title}
                </CardTitle>
                {prompt.description && <CardDescription className="text-base">{prompt.description}</CardDescription>}
              </div>
              <Badge
                variant="secondary"
                className="shrink-0 bg-purple-500/20 text-purple-300 border-purple-500/30 text-sm px-3 py-1"
              >
                {prompt.category}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              {prompt.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-purple-500/30 text-purple-400">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>

          {prompt.image_url && (
            <div className="relative w-full h-96 md:h-[800px] overflow-hidden p-6">
              <Image
                src={prompt.image_url || "/placeholder.svg"}
                alt={prompt.title}
                fill
                className="object-cover object-top rounded-lg"
              />
            </div>
          )}
        </Card>

        {/* Prompt Text Card */}
        <Card className="border-purple-500/20 bg-card/50 backdrop-blur-xl py-6">
          <CardHeader>
            <CardTitle className="text-xl">Prompt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <pre className="whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-lg border border-purple-500/20 leading-relaxed">
                {prompt.prompt_text}
              </pre>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleCopy}
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 flex-1 sm:flex-none"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Prompt
                  </>
                )}
              </Button>

              <Button
                onClick={handleShare}
                variant="outline"
                className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 flex-1 sm:flex-none bg-transparent"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button
                onClick={openInChatGPT}
                variant="outline"
                className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 flex-1 sm:flex-none bg-transparent"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in ChatGPT
              </Button>

              <Button
                onClick={openInGemini}
                variant="outline"
                className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 flex-1 sm:flex-none bg-transparent"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Gemini
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
