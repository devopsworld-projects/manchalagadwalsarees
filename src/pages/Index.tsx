import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { NewCollections } from '@/components/NewCollections';
import { BestSellers } from '@/components/BestSellers';
import { CategoriesSection } from '@/components/CategoriesSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroSection />
        <NewCollections />
        <CategoriesSection />
        <BestSellers />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
