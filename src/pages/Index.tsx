import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { NewCollections } from '@/components/NewCollections';
import { BestSellers } from '@/components/BestSellers';
import { CategoriesSection } from '@/components/CategoriesSection';
import { BannerSlider } from '@/components/BannerSlider';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { GoogleReviewsSection } from '@/components/GoogleReviewsSection';
import { StoreLocationsSection } from '@/components/StoreLocationsSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';
import { HeritageSection } from '@/components/HeritageSection';

import { OccasionsBanner } from '@/components/OccasionsBanner';
import { HomepageSection } from '@/components/HomepageSection';
import { InstagramSection } from '@/components/InstagramSection';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: "Manchala Gadwal Sarees",
  description: 'Authentic handwoven Gadwal silk sarees from Telangana. Pure zari, temple borders, bridal & festive collections with free shipping across India.',
  url: 'https://manchalagadwalsarees.lovable.app',
  telephone: '+919885879188',
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
        <HomepageSection sectionKey="hero"><HeroSection /></HomepageSection>
        <HomepageSection sectionKey="featured"><ScrollReveal><FeaturedCarousel /></ScrollReveal></HomepageSection>
        <HomepageSection sectionKey="new_arrivals"><NewCollections /></HomepageSection>
        <HomepageSection sectionKey="categories"><CategoriesSection /></HomepageSection>
        <HomepageSection sectionKey="heritage"><ScrollReveal><HeritageSection /></ScrollReveal></HomepageSection>
        <HomepageSection sectionKey="banner"><ScrollReveal><BannerSlider /></ScrollReveal></HomepageSection>
        <HomepageSection sectionKey="occasions"><ScrollReveal><OccasionsBanner /></ScrollReveal></HomepageSection>
        <HomepageSection sectionKey="best_sellers"><ScrollReveal><BestSellers /></ScrollReveal></HomepageSection>
        <HomepageSection sectionKey="testimonials"><ScrollReveal><TestimonialsSection /></ScrollReveal></HomepageSection>
        <HomepageSection sectionKey="google_reviews"><ScrollReveal><GoogleReviewsSection /></ScrollReveal></HomepageSection>
        <HomepageSection sectionKey="store_locations"><ScrollReveal><StoreLocationsSection /></ScrollReveal></HomepageSection>
        <HomepageSection sectionKey="instagram"><ScrollReveal><InstagramSection /></ScrollReveal></HomepageSection>
        <HomepageSection sectionKey="newsletter"><ScrollReveal><NewsletterSection /></ScrollReveal></HomepageSection>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
