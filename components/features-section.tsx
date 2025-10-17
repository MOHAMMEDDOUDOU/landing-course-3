import { Card, CardContent } from "@/components/ui/card"
import { Brain, Rocket, Target, Users, Award, Clock } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "تعلم ذكي",
    description: "منهج مصمم بعناية يستخدم الذكاء الاصطناعي لتسريع عملية التعلم",
  },
  {
    icon: Rocket,
    title: "مشاريع حقيقية",
    description: "ابني تطبيقات ومواقع احترافية من اليوم الأول",
  },
  {
    icon: Target,
    title: "مسار واضح",
    description: "خطة تعليمية منظمة تأخذك من المبتدئ إلى المحترف",
  },
  {
    icon: Users,
    title: "مجتمع داعم",
    description: "انضم لمجتمع من المتعلمين والمطورين المحترفين",
  },
  {
    icon: Award,
    title: "شهادة معتمدة",
    description: "احصل على شهادة إتمام الكورس بعد إنهاء جميع المشاريع",
  },
  {
    icon: Clock,
    title: "تعلم بمرونة",
    description: "ادرس في أي وقت ومن أي مكان بالسرعة التي تناسبك",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold md:text-5xl">لماذا هذا الكورس؟</h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            كورس شامل ومتكامل يجمع بين النظرية والتطبيق العملي مع استخدام أحدث تقنيات الذكاء الاصطناعي
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
