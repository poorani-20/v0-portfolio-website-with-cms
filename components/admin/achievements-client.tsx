"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Achievement } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface AchievementsClientProps {
  initialAchievements: Achievement[]
}

export function AchievementsClient({ initialAchievements }: AchievementsClientProps) {
  const router = useRouter()
  const [achievements, setAchievements] = useState(initialAchievements)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editing, setEditing] = useState<Achievement | null>(null)
  const [formData, setFormData] = useState({ title: "", description: "", date: "", display_order: 0 })

  const resetForm = () => { setFormData({ title: "", description: "", date: "", display_order: 0 }); setEditing(null) }

  const openEditDialog = (a: Achievement) => {
    setEditing(a)
    setFormData({ title: a.title, description: a.description || "", date: a.date || "", display_order: a.display_order })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const supabase = createClient()
      const data = { title: formData.title, description: formData.description || null, date: formData.date || null, display_order: formData.display_order }
      if (editing) {
        const { error } = await supabase.from("achievements").update(data).eq("id", editing.id)
        if (error) throw error
        toast.success("Achievement updated!")
      } else {
        const { error } = await supabase.from("achievements").insert(data)
        if (error) throw error
        toast.success("Achievement created!")
      }
      setIsDialogOpen(false)
      resetForm()
      router.refresh()
      const { data: refreshed } = await supabase.from("achievements").select("*").order("display_order", { ascending: true })
      if (refreshed) setAchievements(refreshed)
    } catch { toast.error("Failed to save achievement.") } finally { setIsLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this achievement?")) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from("achievements").delete().eq("id", id)
      if (error) throw error
      toast.success("Achievement deleted!")
      setAchievements(achievements.filter((a) => a.id !== id))
    } catch { toast.error("Failed to delete achievement.") }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-muted-foreground">Manage your achievements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Achievement</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Achievement" : "Add Achievement"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input id="display_order" type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{editing ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {achievements.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No achievements found.</TableCell></TableRow>
            ) : (
              achievements.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{a.description || "-"}</TableCell>
                  <TableCell>{a.date ? format(new Date(a.date), "MMM yyyy") : "-"}</TableCell>
                  <TableCell>{a.display_order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(a)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
