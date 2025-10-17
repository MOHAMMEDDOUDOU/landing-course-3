import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { CourseContentSection } from "@/components/course-content-section"
import { CTASection } from "@/components/cta-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SetupBanner } from "@/components/setup-banner"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SetupBanner />
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CourseContentSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
