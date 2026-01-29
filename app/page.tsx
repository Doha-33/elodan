import PageLayout from '@/components/PageLayout'
import { HeroSection } from '@/components/features/home/HeroSection'
import { FeaturedGuides } from '@/components/features/home/FeaturedGuides'
import { TemplatesSection } from '@/components/features/home/TemplatesSection'
import { ExploreImagineSection } from '@/components/features/home/ExploreImagineSection'
import { OfferPopup } from '@/components/features/home/OfferPopup'

export default function Home() {
  return (
    <PageLayout isPublic={true}>
      <main>
        {/* Welcome Offer Popup */}
        <OfferPopup />

        {/* Hero Section */}
        <HeroSection />

        {/* Featured Guides Section */}
        <FeaturedGuides />

        {/* Start with Templates Section */}
        <TemplatesSection />

        {/* Explore Imagine Section */}
        <ExploreImagineSection />
      </main>

      <footer className="border-t border-gray-100 py-12 mt-16 text-center">
        <p className="text-gray-400 text-sm font-medium">
          © {new Date().getFullYear()} Elodan AI. All rights reserved.
        </p>
      </footer>
    </PageLayout>
  )
}
