import type { Contact, Resume } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Download, Github, Linkedin, Mail, Code, Cpu, Database } from "lucide-react"

interface HeroSectionProps {
  contact: Contact | null
  resume: Resume | null
}

export function HeroSection({ contact, resume }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 pb-12 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <div className="space-y-6">
          <div className="inline-block px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium text-primary">
            Welcome to my portfolio
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground text-balance">
            Hi, I&apos;m <span className="text-primary">POORANI</span>
          </h1>
          
          <p className="text-xl md:text-2xl font-medium text-foreground/90">
            Student | Web Developer | Full Stack | Embedded Systems
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            A passionate student skilled in web development, full stack applications, and embedded systems.
            I love building solutions that bridge software and hardware.
          </p>

          {/* Skills badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/80 rounded-full text-sm">
              <Code className="h-4 w-4 text-primary" />
              <span>Java / Spring</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/80 rounded-full text-sm">
              <Database className="h-4 w-4 text-primary" />
              <span>Python / Django</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/80 rounded-full text-sm">
              <Cpu className="h-4 w-4 text-primary" />
              <span>C Programming</span>
            </div>
          </div>

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
              <Button variant="outline" size="lg" className="gap-2 border-primary/50 hover:bg-primary/10">
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
                className="p-3 rounded-full bg-secondary hover:bg-primary/20 border border-border hover:border-primary/50 transition-all"
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
                className="p-3 rounded-full bg-secondary hover:bg-primary/20 border border-border hover:border-primary/50 transition-all"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            )}
            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="p-3 rounded-full bg-secondary hover:bg-primary/20 border border-border hover:border-primary/50 transition-all"
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
