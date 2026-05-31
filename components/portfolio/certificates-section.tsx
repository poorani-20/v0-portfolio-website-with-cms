import type { Certificate } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"

interface CertificatesSectionProps {
  certificates: Certificate[]
}

export function CertificatesSection({ certificates }: CertificatesSectionProps) {
  if (certificates.length === 0) {
    return (
      <section id="certificates" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Certificates</h2>
            <p className="text-muted-foreground">No certificates added yet. Add some from the admin dashboard.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="certificates" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Certificates</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional certifications and credentials
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden group">
              {cert.image_url && (
                <div className="relative aspect-[4/3] bg-muted">
                  <Image
                    src={cert.image_url}
                    alt={cert.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg flex items-start gap-2">
                  <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  {cert.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cert.issuer && (
                    <p className="text-sm text-muted-foreground">Issued by: {cert.issuer}</p>
                  )}
                  {cert.issue_date && (
                    <Badge variant="secondary" className="text-xs">
                      {format(new Date(cert.issue_date), "MMM yyyy")}
                    </Badge>
                  )}
                  {cert.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{cert.description}</p>
                  )}
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                    >
                      View Credential <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
