import { createClient } from "@/lib/supabase/server"
import { CertificatesClient } from "@/components/admin/certificates-client"
import type { Certificate } from "@/lib/types/database"

export const dynamic = "force-dynamic"

export default async function CertificatesPage() {
  const supabase = await createClient()
  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .order("display_order", { ascending: true })

  return <CertificatesClient initialCertificates={(certificates as Certificate[]) || []} />
}
