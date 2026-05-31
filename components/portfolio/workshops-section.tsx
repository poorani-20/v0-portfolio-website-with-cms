import type { Workshop } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar } from "lucide-react"
import { format } from "date-fns"

interface WorkshopsSectionProps {
  workshops: Workshop[]
}

export function WorkshopsSection({ workshops }: WorkshopsSectionProps) {
  if (workshops.length === 0) {
    return (
      <section id="workshops" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Workshops</h2>
            <p className="text-muted-foreground">No workshops added yet. Add some from the admin dashboard.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="workshops" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Workshops</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Training sessions and workshops I&apos;ve attended
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((workshop) => (
            <Card key={workshop.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span>{workshop.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workshop.organizer && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Organized by: {workshop.organizer}
                  </p>
                )}
                {workshop.description && (
                  <p className="text-sm text-muted-foreground mb-3">{workshop.description}</p>
                )}
                {workshop.date && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(workshop.date), "MMM dd, yyyy")}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
