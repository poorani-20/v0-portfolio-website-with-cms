"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Education } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface EducationClientProps {
  initialEducation: Education[]
}

export function EducationClient({ initialEducation }: EducationClientProps) {
  const router = useRouter()
  const [education, setEducation] = useState(initialEducation)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editing, setEditing] = useState<Education | null>(null)
  const [formData, setFormData] = useState({
    institution: "", degree: "", field_of_study: "", start_date: "", end_date: "", grade: "", description: "", display_order: 0,
  })

  const resetForm = () => {
    setFormData({ institution: "", degree: "", field_of_study: "", start_date: "", end_date: "", grade: "", description: "", display_order: 0 })
    setEditing(null)
  }

  const openEditDialog = (edu: Education) => {
    setEditing(edu)
    setFormData({
      institution: edu.institution, degree: edu.degree || "", field_of_study: edu.field_of_study || "",
      start_date: edu.start_date || "", end_date: edu.end_date || "", grade: edu.grade || "",
      description: edu.description || "", display_order: edu.display_order,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const supabase = createClient()
      const data = {
        institution: formData.institution, degree: formData.degree || null, field_of_study: formData.field_of_study || null,
        start_date: formData.start_date || null, end_date: formData.end_date || null, grade: formData.grade || null,
        description: formData.description || null, display_order: formData.display_order,
      }
      if (editing) {
        const { error } = await supabase.from("education").update(data).eq("id", editing.id)
        if (error) throw error
        toast.success("Education updated!")
      } else {
        const { error } = await supabase.from("education").insert(data)
        if (error) throw error
        toast.success("Education created!")
      }
      setIsDialogOpen(false)
      resetForm()
      router.refresh()
      const { data: refreshed } = await supabase.from("education").select("*").order("display_order", { ascending: true })
      if (refreshed) setEducation(refreshed)
    } catch {
      toast.error("Failed to save education.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this education entry?")) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from("education").delete().eq("id", id)
      if (error) throw error
      toast.success("Education deleted!")
      setEducation(education.filter((e) => e.id !== id))
    } catch {
      toast.error("Failed to delete education.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Education</h1>
          <p className="text-muted-foreground">Manage your education history</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />Add Education</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Education" : "Add Education"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="institution">Institution *</Label>
                <Input id="institution" required value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Input id="degree" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} placeholder="e.g., Bachelor of Science" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field_of_study">Field of Study</Label>
                  <Input id="field_of_study" value={formData.field_of_study} onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })} placeholder="e.g., Computer Science" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input id="start_date" type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input id="end_date" type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/GPA</Label>
                  <Input id="grade" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input id="display_order" type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {editing ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Institution</TableHead>
              <TableHead>Degree</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {education.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No education entries found.</TableCell></TableRow>
            ) : (
              education.map((edu) => (
                <TableRow key={edu.id}>
                  <TableCell className="font-medium">{edu.institution}</TableCell>
                  <TableCell>{edu.degree || "-"}</TableCell>
                  <TableCell>
                    {edu.start_date ? format(new Date(edu.start_date), "MMM yyyy") : "-"}
                    {edu.end_date ? ` - ${format(new Date(edu.end_date), "MMM yyyy")}` : edu.start_date ? " - Present" : ""}
                  </TableCell>
                  <TableCell>{edu.display_order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(edu)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(edu.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
