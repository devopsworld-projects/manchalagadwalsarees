import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import heroImage from '@/assets/hero-woman.jpg';

const About = () => {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
          <img src={heroImage} alt="About O Maguva" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
          <div className="relative text-center text-primary-foreground">
            <h1 className="font-display text-4xl md:text-5xl font-bold">Our Story</h1>
            <p className="font-body text-primary-foreground/80 mt-2">The heritage behind every thread</p>
          </div>
        </section>

        <section className="container py-16 max-w-3xl">
          <div className="space-y-6 font-body text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground font-display text-xl">O Maguva</strong> — meaning "O Woman" in Telugu — is a celebration of the modern Indian woman who carries her heritage with pride and grace.
            </p>
            <p>
              Founded with a passion for preserving the timeless art of handloom weaving, we curate the finest collection of sarees from master weavers across India. Each piece in our collection tells a story — of tradition, craftsmanship, and the countless hours of dedication that go into every thread.
            </p>
            <p>
              From the rich silk Kanjivaram sarees of Tamil Nadu to the intricate Banarasi weaves of Uttar Pradesh, we bring you sarees that are not just garments, but heirlooms meant to be cherished for generations.
            </p>
            <p>
              Our mission is simple: to make authentic, high-quality handcrafted sarees accessible to women everywhere, while supporting the artisan communities that keep these centuries-old traditions alive.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
