import { createClient } from "@/lib/supabase/server"
import { ProjectsClient } from "@/components/admin/projects-client"
import type { Project } from "@/lib/types/database"

export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })

  return <ProjectsClient initialProjects={(projects as Project[]) || []} />
}
