import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

const modules = [
  {
    title: "المقدمة والأساسيات",
    topics: [
      "مقدمة عن البرمجة والذكاء الاصطناعي",
      "إعداد بيئة العمل والأدوات",
      "أساسيات HTML و CSS",
      "مقدمة في JavaScript",
    ],
  },
  {
    title: "البرمجة بمساعدة AI",
    topics: [
      "استخدام ChatGPT و GitHub Copilot",
      "كتابة الأكواد بكفاءة مع AI",
      "تصحيح الأخطاء البرمجية",
      "أفضل الممارسات في البرمجة",
    ],
  },
  {
    title: "تطوير المواقع الحديثة",
    topics: ["React و Next.js", "التصميم باستخدام Tailwind CSS", "إدارة الحالة والبيانات", "التعامل مع APIs"],
  },
  {
    title: "قواعد البيانات والمصادقة",
    topics: ["قواعد البيانات SQL و NoSQL", "أنظمة المصادقة والأمان", "إدارة المستخدمين", "حماية التطبيقات"],
  },
  {
    title: "النشر والإطلاق",
    topics: ["نشر التطبيقات على Vercel", "إعداد النطاقات المخصصة", "مراقبة الأداء", "الصيانة والتحديثات"],
  },
  {
    title: "مشاريع عملية",
    topics: ["بناء متجر إلكتروني كامل", "تطبيق إدارة المهام", "منصة تواصل اجتماعي", "مشروع التخرج الخاص بك"],
  },
]

export function CourseContentSection() {
  return (
    <section className="border-y border-border/40 bg-muted/20 py-24">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold md:text-5xl">محتوى الكورس</h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            منهج شامل ومنظم يغطي كل ما تحتاجه لتصبح مطور محترف
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => (
            <Card key={index} className="border-border/50">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                  {index + 1}
                </div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {module.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm leading-relaxed text-muted-foreground">{topic}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
