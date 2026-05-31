import type { Contact, Resume } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Download, Github, Linkedin, Mail } from "lucide-react"

interface HeroSectionProps {
  contact: Contact | null
  resume: Resume | null
}

export function HeroSection({ contact, resume }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 pb-12 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="space-y-6">
          <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-sm font-medium text-primary">
            Welcome to my portfolio
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground text-balance">
            Hi, I&apos;m <span className="text-primary">Poorani M</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            A passionate developer crafting digital experiences with modern technologies. 
            I love building applications that make a difference.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {resume?.file_url && (
              <a href={resume.file_url} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Resume
                </Button>
              </a>
            )}
            <a href="#contact">
              <Button variant="outline" size="lg" className="gap-2">
                <Mail className="h-4 w-4" />
                Contact Me
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 pt-6">
            {contact?.github_url && (
              <a
                href={contact.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
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
                className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            )}
            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
