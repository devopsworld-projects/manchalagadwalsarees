import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { NewCollections } from '@/components/NewCollections';
import { BestSellers } from '@/components/BestSellers';
import { CategoriesSection } from '@/components/CategoriesSection';
import { BannerSlider } from '@/components/BannerSlider';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';
import { HeritageSection } from '@/components/HeritageSection';

import { OccasionsBanner } from '@/components/OccasionsBanner';


const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: "Manchala Gadwal Sarees",
  description: 'Authentic handwoven Gadwal silk sarees from Telangana. Pure zari, temple borders, bridal & festive collections with free shipping across India.',
  url: 'https://manchalagadwalsarees.lovable.app',
  telephone: '+919494644998',
  priceRange: '₹₹',
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <PageMeta
        title="Manchala Gadwal Sarees"
        description="Authentic handwoven Gadwal silk sarees from Telangana. Pure zari temple borders, bridal & festive sarees crafted by master weavers. Free shipping across India."
        canonicalPath="/"
        jsonLd={jsonLd}
      />
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedCarousel />
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
