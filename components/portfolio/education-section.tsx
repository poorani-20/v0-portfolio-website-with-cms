import type { Education } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Calendar } from "lucide-react"
import { format } from "date-fns"

interface EducationSectionProps {
  education: Education[]
}

export function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) {
    return (
      <section id="education" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Education</h2>
            <p className="text-muted-foreground">No education entries added yet. Add some from the admin dashboard.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="education" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Education</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My academic background and qualifications
          </p>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          {education.map((edu) => (
            <Card key={edu.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{edu.institution}</CardTitle>
                    {edu.degree && (
                      <p className="text-muted-foreground">
                        {edu.degree}
                        {edu.field_of_study && ` in ${edu.field_of_study}`}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {edu.start_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(edu.start_date), "MMM yyyy")}
                      {edu.end_date ? ` - ${format(new Date(edu.end_date), "MMM yyyy")}` : " - Present"}
                    </div>
                  )}
                  {edu.grade && (
                    <span className="bg-secondary px-2 py-0.5 rounded">
                      Grade: {edu.grade}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <p className="mt-3 text-sm text-muted-foreground">{edu.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
