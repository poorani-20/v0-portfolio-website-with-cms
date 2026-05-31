"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { ContactSubmission } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, Mail, Eye } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface MessagesClientProps {
  initialMessages: ContactSubmission[]
}

export function MessagesClient({ initialMessages }: MessagesClientProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null)

  const handleMarkAsRead = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id)
      if (error) throw error
      setMessages(messages.map((m) => (m.id === id ? { ...m, is_read: true } : m)))
    } catch {
      toast.error("Failed to mark as read.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id)
      if (error) throw error
      toast.success("Message deleted!")
      setMessages(messages.filter((m) => m.id !== id))
      if (selectedMessage?.id === id) setSelectedMessage(null)
    } catch {
      toast.error("Failed to delete message.")
    }
  }

  const openMessage = (message: ContactSubmission) => {
    setSelectedMessage(message)
    if (!message.is_read) handleMarkAsRead(message.id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Contact form submissions from visitors</p>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">No messages yet.</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className={!message.is_read ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {message.name}
                      {!message.is_read && <Badge variant="default" className="text-xs">New</Badge>}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{message.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{format(new Date(message.created_at), "MMM dd, yyyy HH:mm")}</p>
                </div>
              </CardHeader>
              <CardContent>
                {message.subject && <p className="font-medium mb-1">{message.subject}</p>}
                <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => openMessage(message)}>
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <a href={`mailto:${message.email}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Reply
                    </Button>
                  </a>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(message.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">From</p>
                  <p>{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p>{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p>{format(new Date(selectedMessage.created_at), "MMM dd, yyyy HH:mm")}</p>
                </div>
                {selectedMessage.subject && (
                  <div>
                    <p className="text-muted-foreground">Subject</p>
                    <p>{selectedMessage.subject}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-2">Message</p>
                <div className="p-4 bg-secondary rounded-md">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`mailto:${selectedMessage.email}`} className="flex-1">
                  <Button className="w-full gap-2">
                    <Mail className="h-4 w-4" />
                    Reply via Email
                  </Button>
                </a>
                <Button variant="destructive" onClick={() => handleDelete(selectedMessage.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
