import { createClient } from "@/lib/supabase/server"
import { GalleryClient } from "@/components/admin/gallery-client"
import type { GalleryImage } from "@/lib/types/database"

export const dynamic = "force-dynamic"

export default async function GalleryPage() {
  const supabase = await createClient()
  const { data: gallery } = await supabase.from("gallery").select("*").order("display_order", { ascending: true })
  return <GalleryClient initialGallery={(gallery as GalleryImage[]) || []} />
}
