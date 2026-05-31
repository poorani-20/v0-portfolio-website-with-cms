import { createClient } from "@/lib/supabase/server"
import { ResumeClient } from "@/components/admin/resume-client"
import type { Resume } from "@/lib/types/database"

export const dynamic = "force-dynamic"

export default async function ResumePage() {
  const supabase = await createClient()
  const { data: resumes } = await supabase.from("resume").select("*").order("uploaded_at", { ascending: false })
  return <ResumeClient initialResumes={(resumes as Resume[]) || []} />
}
