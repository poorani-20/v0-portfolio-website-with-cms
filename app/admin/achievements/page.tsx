import { createClient } from "@/lib/supabase/server"
import { AchievementsClient } from "@/components/admin/achievements-client"
import type { Achievement } from "@/lib/types/database"

export const dynamic = "force-dynamic"

export default async function AchievementsPage() {
  const supabase = await createClient()
  const { data: achievements } = await supabase.from("achievements").select("*").order("display_order", { ascending: true })
  return <AchievementsClient initialAchievements={(achievements as Achievement[]) || []} />
}
