import HeroSection from "@/components/home/HeroSection";
import TopFundedCampaigns from "@/components/home/TopFundedCampaigns";
import Testimonials from "@/components/home/Testimonials";
import HowItWorks from "@/components/home/HowItWorks";
import ExploreCategories from "@/components/home/ExploreCategories";
import PlatformImpact from "@/components/home/PlatformImpact";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TopFundedCampaigns />
      <Testimonials />
      <HowItWorks />
      <ExploreCategories />
      <PlatformImpact />
      <CTASection/>
    </main>
  );
}