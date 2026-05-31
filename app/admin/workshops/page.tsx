import { createClient } from "@/lib/supabase/server"
import { WorkshopsClient } from "@/components/admin/workshops-client"
import type { Workshop } from "@/lib/types/database"

export const dynamic = "force-dynamic"

export default async function WorkshopsPage() {
  const supabase = await createClient()
  const { data: workshops } = await supabase.from("workshops").select("*").order("display_order", { ascending: true })
  return <WorkshopsClient initialWorkshops={(workshops as Workshop[]) || []} />
}
