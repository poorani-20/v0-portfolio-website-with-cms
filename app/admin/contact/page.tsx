import { createClient } from "@/lib/supabase/server"
import { ContactClient } from "@/components/admin/contact-client"
import type { Contact } from "@/lib/types/database"

export const dynamic = "force-dynamic"

export default async function ContactPage() {
  const supabase = await createClient()
  const { data: contact } = await supabase.from("contact").select("*").limit(1).single()
  return <ContactClient initialContact={(contact as Contact) || null} />
}
