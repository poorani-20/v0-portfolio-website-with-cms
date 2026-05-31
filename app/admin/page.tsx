import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, Award, Image, Code, GraduationCap, Trophy, Users, MessageSquare } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: projectsCount },
    { count: skillsCount },
    { count: educationCount },
    { count: certificatesCount },
    { count: achievementsCount },
    { count: workshopsCount },
    { count: galleryCount },
    { count: messagesCount },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase.from("education").select("*", { count: "exact", head: true }),
    supabase.from("certificates").select("*", { count: "exact", head: true }),
    supabase.from("achievements").select("*", { count: "exact", head: true }),
    supabase.from("workshops").select("*", { count: "exact", head: true }),
    supabase.from("gallery").select("*", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("is_read", false),
  ])

  const stats = [
    { label: "Projects", value: projectsCount || 0, icon: FolderKanban, href: "/admin/projects" },
    { label: "Skills", value: skillsCount || 0, icon: Code, href: "/admin/skills" },
    { label: "Education", value: educationCount || 0, icon: GraduationCap, href: "/admin/education" },
    { label: "Certificates", value: certificatesCount || 0, icon: Award, href: "/admin/certificates" },
    { label: "Achievements", value: achievementsCount || 0, icon: Trophy, href: "/admin/achievements" },
    { label: "Workshops", value: workshopsCount || 0, icon: Users, href: "/admin/workshops" },
    { label: "Gallery Images", value: galleryCount || 0, icon: Image, href: "/admin/gallery" },
    { label: "Unread Messages", value: messagesCount || 0, icon: MessageSquare, href: "/admin/messages" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your portfolio admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Use the sidebar navigation to manage your portfolio content. You can add, edit, and delete 
            projects, certificates, skills, and more.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
