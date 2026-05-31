import { createClient } from "@/lib/supabase/server"
import { MessagesClient } from "@/components/admin/messages-client"
import type { ContactSubmission } from "@/lib/types/database"

export const dynamic = "force-dynamic"

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: messages } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false })
  return <MessagesClient initialMessages={(messages as ContactSubmission[]) || []} />
}
