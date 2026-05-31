"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Resume } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Loader2, FileText, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface ResumeClientProps {
  initialResumes: Resume[]
}

export function ResumeClient({ initialResumes }: ResumeClientProps) {
  const router = useRouter()
  const [resumes, setResumes] = useState(initialResumes)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ file_url: "", file_name: "" })

  const resetForm = () => setFormData({ file_url: "", file_name: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const supabase = createClient()
      // Deactivate all existing resumes first
      await supabase.from("resume").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000")
      // Insert new active resume
      const { error } = await supabase.from("resume").insert({ file_url: formData.file_url, file_name: formData.file_name || null, is_active: true })
      if (error) throw error
      toast.success("Resume uploaded!")
      setIsDialogOpen(false)
      resetForm()
      router.refresh()
      const { data: refreshed } = await supabase.from("resume").select("*").order("uploaded_at", { ascending: false })
      if (refreshed) setResumes(refreshed)
    } catch { toast.error("Failed to upload resume.") } finally { setIsLoading(false) }
  }

  const handleSetActive = async (id: string) => {
    try {
      const supabase = createClient()
      await supabase.from("resume").update({ is_active: false }).neq("id", id)
      const { error } = await supabase.from("resume").update({ is_active: true }).eq("id", id)
      if (error) throw error
      toast.success("Resume set as active!")
      const { data: refreshed } = await supabase.from("resume").select("*").order("uploaded_at", { ascending: false })
      if (refreshed) setResumes(refreshed)
    } catch { toast.error("Failed to update resume.") }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resume?")) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from("resume").delete().eq("id", id)
      if (error) throw error
      toast.success("Resume deleted!")
      setResumes(resumes.filter((r) => r.id !== id))
    } catch { toast.error("Failed to delete resume.") }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resume</h1>
          <p className="text-muted-foreground">Manage your resume files</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Upload Resume</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Upload New Resume</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file_url">Resume URL *</Label>
                <Input id="file_url" type="url" required value={formData.file_url} onChange={(e) => setFormData({ ...formData, file_url: e.target.value })} placeholder="https://example.com/resume.pdf" />
                <p className="text-xs text-muted-foreground">Upload your resume to a cloud storage (Google Drive, Dropbox, etc.) and paste the public link here.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file_name">File Name</Label>
                <Input id="file_name" value={formData.file_name} onChange={(e) => setFormData({ ...formData, file_name: e.target.value })} placeholder="My_Resume_2024.pdf" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Upload</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {resumes.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No resumes uploaded. Add your first resume!</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {resumes.map((resume) => (
            <Card key={resume.id} className={resume.is_active ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  {resume.file_name || "Resume"}
                  {resume.is_active && <Badge>Active</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Uploaded: {format(new Date(resume.uploaded_at), "MMM dd, yyyy")}</p>
                <div className="flex gap-2">
                  <a href={resume.file_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2"><ExternalLink className="h-4 w-4" />View</Button>
                  </a>
                  {!resume.is_active && (
                    <Button variant="outline" size="sm" onClick={() => handleSetActive(resume.id)}>Set as Active</Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(resume.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
