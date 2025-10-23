import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata = {
  title: "FAQ - PromptVault",
  description: "Frequently asked questions about PromptVault",
}

export default async function FAQPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  let username: string | undefined = undefined
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("is_admin, username").eq("id", user.id).single()
    isAdmin = profile?.is_admin || false
    username = profile?.username || undefined
  }

  const faqs = [
    {
      question: "What is PromptVault?",
      answer:
        "PromptVault is a curated collection of high-quality AI prompts designed to help you get the best results from AI tools like ChatGPT, Gemini, and more.",
    },
    {
      question: "How do I use a prompt?",
      answer:
        "Simply browse our collection, find a prompt you like, and click the copy button. Then paste it into your favorite AI tool.",
    },
    {
      question: "Can I submit my own prompts?",
      answer:
        "Yes! Create an account and go to your dashboard to submit prompts. All submissions go through an approval process.",
    },
    {
      question: "Is PromptVault free?",
      answer: "Yes, PromptVault is completely free to use. Browse and copy prompts without any cost.",
    },
    {
      question: "How long does it take for my prompt to be approved?",
      answer: "Our admin team reviews submissions regularly. Most prompts are approved within 24-48 hours.",
    },
    {
      question: "Can I edit my submitted prompts?",
      answer:
        "You can edit prompts that are still pending approval. Once approved, contact our support team for modifications.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/10 flex flex-col">
      <Header user={user} isAdmin={isAdmin} username={username} />

      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent mb-8">
            Frequently Asked Questions
          </h1>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-purple-500/20 rounded-lg px-4"
              >
                <AccordionTrigger className="hover:text-purple-300">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 p-6 border border-purple-500/20 rounded-lg bg-card/50 backdrop-blur">
            <h2 className="text-xl font-semibold text-foreground mb-2">Still have questions?</h2>
            <p className="text-muted-foreground">
              Visit our{" "}
              <a href="/contact" className="text-purple-400 hover:text-purple-300">
                Contact page
              </a>{" "}
              to get in touch with our support team.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
