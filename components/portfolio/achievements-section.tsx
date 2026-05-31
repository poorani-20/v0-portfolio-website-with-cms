import type { Achievement } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Calendar } from "lucide-react"
import { format } from "date-fns"

interface AchievementsSectionProps {
  achievements: Achievement[]
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  if (achievements.length === 0) {
    return (
      <section id="achievements" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Achievements</h2>
            <p className="text-muted-foreground">No achievements added yet. Add some from the admin dashboard.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="achievements" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Achievements</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Recognition and milestones in my journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {achievements.map((achievement) => (
            <Card key={achievement.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <span>{achievement.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievement.description && (
                  <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                )}
                {achievement.date && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(achievement.date), "MMM yyyy")}
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
