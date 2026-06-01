import type { Contact } from "@/lib/types/database"
import { Github, Linkedin, Mail, Heart } from "lucide-react"

interface FooterProps {
  contact: Contact | null
}

export function Footer({ contact }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 px-4 border-t border-border/50 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-primary fill-primary" /> by <span className="text-primary font-medium">POORANI</span>
          </p>
          
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {contact?.github_url && (
              <a
                href={contact.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            )}
            {contact?.linkedin_url && (
              <a
                href={contact.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            )}
            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
