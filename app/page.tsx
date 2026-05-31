import { createClient } from "@/lib/supabase/server"
import type { Project, Certificate, GalleryImage, Skill, Education, Achievement, Workshop, Contact, Resume } from "@/lib/types/database"
import { HeroSection } from "@/components/portfolio/hero-section"
import { AboutSection } from "@/components/portfolio/about-section"
import { ProjectsSection } from "@/components/portfolio/projects-section"
import { SkillsSection } from "@/components/portfolio/skills-section"
import { EducationSection } from "@/components/portfolio/education-section"
import { CertificatesSection } from "@/components/portfolio/certificates-section"
import { AchievementsSection } from "@/components/portfolio/achievements-section"
import { WorkshopsSection } from "@/components/portfolio/workshops-section"
import { GallerySection } from "@/components/portfolio/gallery-section"
import { ContactSection } from "@/components/portfolio/contact-section"
import { Navbar } from "@/components/portfolio/navbar"
import { Footer } from "@/components/portfolio/footer"

export const dynamic = "force-dynamic"

export default async function PortfolioPage() {
  const supabase = await createClient()
  
  const [
    { data: projects },
    { data: certificates },
    { data: gallery },
    { data: skills },
    { data: education },
    { data: achievements },
    { data: workshops },
    { data: contact },
    { data: resume },
  ] = await Promise.all([
    supabase.from("projects").select("*").order("display_order", { ascending: true }),
    supabase.from("certificates").select("*").order("display_order", { ascending: true }),
    supabase.from("gallery").select("*").order("display_order", { ascending: true }),
    supabase.from("skills").select("*").order("display_order", { ascending: true }),
    supabase.from("education").select("*").order("display_order", { ascending: true }),
    supabase.from("achievements").select("*").order("display_order", { ascending: true }),
    supabase.from("workshops").select("*").order("display_order", { ascending: true }),
    supabase.from("contact").select("*").limit(1).single(),
    supabase.from("resume").select("*").eq("is_active", true).limit(1).single(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection contact={contact as Contact | null} resume={resume as Resume | null} />
        <AboutSection />
        <SkillsSection skills={(skills as Skill[]) || []} />
        <ProjectsSection projects={(projects as Project[]) || []} />
        <EducationSection education={(education as Education[]) || []} />
        <CertificatesSection certificates={(certificates as Certificate[]) || []} />
        <AchievementsSection achievements={(achievements as Achievement[]) || []} />
        <WorkshopsSection workshops={(workshops as Workshop[]) || []} />
        <GallerySection gallery={(gallery as GalleryImage[]) || []} />
        <ContactSection contact={contact as Contact | null} />
      </main>
      <Footer contact={contact as Contact | null} />
    </div>
  )
}
