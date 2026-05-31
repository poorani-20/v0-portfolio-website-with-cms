import { createClient } from "@/lib/supabase/server"
import { EducationClient } from "@/components/admin/education-client"
import type { Education } from "@/lib/types/database"

export const dynamic = "force-dynamic"

export default async function EducationPage() {
  const supabase = await createClient()
  const { data: education } = await supabase
    .from("education")
    .select("*")
    .order("display_order", { ascending: true })

  return <EducationClient initialEducation={(education as Education[]) || []} />
}
