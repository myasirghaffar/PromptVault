import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";

interface PromptCardProps {
  id: string;
  imageUrl: string | null;
  ownerName?: string;
}

export function PromptCard({ id, imageUrl, ownerName }: PromptCardProps) {
  return (
    <Card className="h-full border-purple-500/20 bg-card/50 backdrop-blur hover:border-purple-500/40 transition-all cursor-pointer group overflow-hidden relative">
      <Link href={`/prompt/${id}`} className="block h-full">
        {/* Featured Image - Full Height */}
        <div className="relative h-64 sm:h-72 lg:h-80">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Prompt preview"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              unoptimized={imageUrl.startsWith("http")}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-purple-500/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <User className="h-8 w-8 text-purple-400" />
                </div>
                <p className="text-sm text-purple-300">No Preview</p>
              </div>
            </div>
          )}

          {/* Username - Top Right Corner */}
          {ownerName && (
            <div className="absolute top-3 right-3 z-10">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 text-white">
                <User className="h-3 w-3" />
                <span className="text-xs font-medium">{ownerName}</span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
}
