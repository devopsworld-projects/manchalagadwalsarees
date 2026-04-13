import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { NewCollections } from '@/components/NewCollections';
import { BestSellers } from '@/components/BestSellers';
import { CategoriesSection } from '@/components/CategoriesSection';
import { BannerSlider } from '@/components/BannerSlider';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';
import { HeritageSection } from '@/components/HeritageSection';
import { FabricGuideSection } from '@/components/FabricGuideSection';
import { OccasionsBanner } from '@/components/OccasionsBanner';
import { ScrollReveal } from '@/components/ScrollReveal';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: "Kavi Women's World",
  description: 'Premium handcrafted sarees — Kanjivaram, Banarasi, Silk & Cotton collections with free shipping across India.',
  url: 'https://kaviwomensworld.lovable.app',
  telephone: '+919494644998',
  priceRange: '₹₹',
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <PageMeta
        title="Kavi Women's World"
        description="Discover the finest collection of handcrafted sarees. Traditional Kanjivaram, Banarasi & Premium silk sarees with free shipping across India."
        canonicalPath="/"
        jsonLd={jsonLd}
      />
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroSection />
        <NewCollections />
        <CategoriesSection />
        <HeritageSection />
        <BannerSlider />
        <FabricGuideSection />
        <OccasionsBanner />
        <BestSellers />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
