import { User, Code, Briefcase, Cpu } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">About Me</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get to know more about who I am and what I do
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/20 rounded-full mb-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Who I Am</h3>
                <p className="text-muted-foreground text-sm">
                  A dedicated student with a passion for technology and innovation. 
                  I believe in continuous learning and hands-on experience.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/20 rounded-full mb-4">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Full Stack Dev</h3>
                <p className="text-muted-foreground text-sm">
                  Building web applications from frontend to backend using 
                  Java/Spring, Python/Django, and modern frameworks.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/20 rounded-full mb-4">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Embedded Systems</h3>
                <p className="text-muted-foreground text-sm">
                  Working with hardware and C programming to create embedded solutions
                  that bridge software and physical systems.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/20 rounded-full mb-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">My Goals</h3>
                <p className="text-muted-foreground text-sm">
                  To contribute to impactful projects and grow as a developer 
                  while building innovative solutions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
