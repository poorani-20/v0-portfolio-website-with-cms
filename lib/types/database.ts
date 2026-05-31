export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string | null
  image_url: string | null
  technologies: string[] | null
  github_url: string | null
  live_url: string | null
  featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Certificate {
  id: string
  title: string
  issuer: string | null
  issue_date: string | null
  image_url: string | null
  credential_url: string | null
  description: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  title: string | null
  description: string | null
  image_url: string
  category: string
  display_order: number
  created_at: string
}

export interface Resume {
  id: string
  file_url: string
  file_name: string | null
  uploaded_at: string
  is_active: boolean
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  display_order: number
  created_at: string
}

export interface Education {
  id: string
  institution: string
  degree: string | null
  field_of_study: string | null
  start_date: string | null
  end_date: string | null
  grade: string | null
  description: string | null
  display_order: number
  created_at: string
}

export interface Achievement {
  id: string
  title: string
  description: string | null
  date: string | null
  display_order: number
  created_at: string
}

export interface Workshop {
  id: string
  title: string
  organizer: string | null
  date: string | null
  description: string | null
  display_order: number
  created_at: string
}

export interface Contact {
  id: string
  email: string | null
  phone: string | null
  linkedin_url: string | null
  github_url: string | null
  location: string | null
  updated_at: string
}

export interface VisitorCount {
  id: string
  count: number
  last_updated: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}
