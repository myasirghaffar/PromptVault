import { PromptForm } from "@/components/prompt-form"

export default async function SubmitPromptPage() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Submit a Prompt
          </h1>
          <p className="text-muted-foreground mt-2">
            Share your creative AI prompt with the community. It will be reviewed by our team before going live.
          </p>
        </div>

        <PromptForm isUserSubmission={true} />
      </div>
    </div>
  )
}
