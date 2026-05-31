"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Certificate } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface CertificatesClientProps {
  initialCertificates: Certificate[]
}

export function CertificatesClient({ initialCertificates }: CertificatesClientProps) {
  const router = useRouter()
  const [certificates, setCertificates] = useState(initialCertificates)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editing, setEditing] = useState<Certificate | null>(null)
  const [formData, setFormData] = useState({
    title: "", issuer: "", issue_date: "", image_url: "", credential_url: "", description: "", display_order: 0,
  })

  const resetForm = () => {
    setFormData({ title: "", issuer: "", issue_date: "", image_url: "", credential_url: "", description: "", display_order: 0 })
    setEditing(null)
  }

  const openEditDialog = (cert: Certificate) => {
    setEditing(cert)
    setFormData({
      title: cert.title, issuer: cert.issuer || "", issue_date: cert.issue_date || "",
      image_url: cert.image_url || "", credential_url: cert.credential_url || "",
      description: cert.description || "", display_order: cert.display_order,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const supabase = createClient()
      const data = {
        title: formData.title, issuer: formData.issuer || null, issue_date: formData.issue_date || null,
        image_url: formData.image_url || null, credential_url: formData.credential_url || null,
        description: formData.description || null, display_order: formData.display_order,
      }
      if (editing) {
        const { error } = await supabase.from("certificates").update(data).eq("id", editing.id)
        if (error) throw error
        toast.success("Certificate updated!")
      } else {
        const { error } = await supabase.from("certificates").insert(data)
        if (error) throw error
        toast.success("Certificate created!")
      }
      setIsDialogOpen(false)
      resetForm()
      router.refresh()
      const { data: refreshed } = await supabase.from("certificates").select("*").order("display_order", { ascending: true })
      if (refreshed) setCertificates(refreshed)
    } catch {
      toast.error("Failed to save certificate.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this certificate?")) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from("certificates").delete().eq("id", id)
      if (error) throw error
      toast.success("Certificate deleted!")
      setCertificates(certificates.filter((c) => c.id !== id))
    } catch {
      toast.error("Failed to delete certificate.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Certificates</h1>
          <p className="text-muted-foreground">Manage your certifications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />Add Certificate</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Certificate" : "Add Certificate"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuer</Label>
                  <Input id="issuer" value={formData.issuer} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="issue_date">Issue Date</Label>
                  <Input id="issue_date" type="date" value={formData.issue_date} onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input id="display_order" type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Certificate Image URL</Label>
                <Input id="image_url" type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credential_url">Credential URL</Label>
                <Input id="credential_url" type="url" value={formData.credential_url} onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
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
              <TableHead>Title</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No certificates found.</TableCell></TableRow>
            ) : (
              certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">{cert.title}</TableCell>
                  <TableCell>{cert.issuer || "-"}</TableCell>
                  <TableCell>{cert.issue_date ? format(new Date(cert.issue_date), "MMM yyyy") : "-"}</TableCell>
                  <TableCell>{cert.display_order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(cert)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cert.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
