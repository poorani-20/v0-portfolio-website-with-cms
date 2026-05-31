"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { GalleryImage } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface GalleryClientProps {
  initialGallery: GalleryImage[]
}

export function GalleryClient({ initialGallery }: GalleryClientProps) {
  const router = useRouter()
  const [gallery, setGallery] = useState(initialGallery)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editing, setEditing] = useState<GalleryImage | null>(null)
  const [formData, setFormData] = useState({ title: "", description: "", image_url: "", category: "general", display_order: 0 })

  const resetForm = () => { setFormData({ title: "", description: "", image_url: "", category: "general", display_order: 0 }); setEditing(null) }

  const openEditDialog = (g: GalleryImage) => {
    setEditing(g)
    setFormData({ title: g.title || "", description: g.description || "", image_url: g.image_url, category: g.category, display_order: g.display_order })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const supabase = createClient()
      const data = { title: formData.title || null, description: formData.description || null, image_url: formData.image_url, category: formData.category, display_order: formData.display_order }
      if (editing) {
        const { error } = await supabase.from("gallery").update(data).eq("id", editing.id)
        if (error) throw error
        toast.success("Image updated!")
      } else {
        const { error } = await supabase.from("gallery").insert(data)
        if (error) throw error
        toast.success("Image added!")
      }
      setIsDialogOpen(false)
      resetForm()
      router.refresh()
      const { data: refreshed } = await supabase.from("gallery").select("*").order("display_order", { ascending: true })
      if (refreshed) setGallery(refreshed)
    } catch { toast.error("Failed to save image.") } finally { setIsLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from("gallery").delete().eq("id", id)
      if (error) throw error
      toast.success("Image deleted!")
      setGallery(gallery.filter((g) => g.id !== id))
    } catch { toast.error("Failed to delete image.") }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">Manage your photo gallery</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Image</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Image" : "Add Image"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL *</Label>
                <Input id="image_url" type="url" required value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://example.com/image.jpg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input id="display_order" type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{editing ? "Update" : "Add"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {gallery.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No images found. Add your first image!</CardContent></Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((img) => (
            <Card key={img.id} className="overflow-hidden group relative">
              <div className="relative aspect-square">
                <Image src={img.image_url} alt={img.title || "Gallery image"} fill className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="secondary" size="icon" onClick={() => openEditDialog(img)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(img.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              {img.title && (
                <div className="p-2 bg-card">
                  <p className="text-sm font-medium truncate">{img.title}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
