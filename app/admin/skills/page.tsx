import { createClient } from "@/lib/supabase/server"
import { SkillsClient } from "@/components/admin/skills-client"
import type { Skill } from "@/lib/types/database"

export const dynamic = "force-dynamic"

export default async function SkillsPage() {
  const supabase = await createClient()
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("display_order", { ascending: true })

  return <SkillsClient initialSkills={(skills as Skill[]) || []} />
}
