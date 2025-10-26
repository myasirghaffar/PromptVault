import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-purple-800/10 flex items-center justify-center p-6">
      <Card className="max-w-md border-purple-500/20 bg-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-3xl bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            404 - Not Found
          </CardTitle>
          <CardDescription>The page you&apos;re looking for doesn&apos;t exist.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            asChild
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 mb-3"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
