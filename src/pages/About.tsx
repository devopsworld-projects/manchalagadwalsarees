import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';
import aboutHero from '@/assets/about-hero.jpg';
import founderImg from '@/assets/founder-manchala-madappa.jpg';

const About = () => {
  return (
    <div className="min-h-screen">
      <PageMeta
        title="About Us"
        description="The story of Manchala Gadwal Sarees — founded in 1986 by master weaver Manchala Madappa, carrying forward a legacy of authentic handloom Gadwal sarees."
        canonicalPath="/about"
      />
      <AnnouncementBar />
      <Navbar /><Breadcrumbs />
      <main>
        <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
          <img src={aboutHero} alt="About Manchala Gadwal Sarees" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
          <div className="relative text-center text-primary-foreground">
            <h1 className="font-display text-4xl md:text-5xl font-bold">Our Story</h1>
            <p className="font-body text-primary-foreground/80 mt-2">A legacy woven since 1986</p>
          </div>
        </section>

        <section className="container py-16 md:py-24 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative">
              <img
                src={founderImg}
                alt="Manchala Madappa, master weaver and founder of Manchala Gadwal Sarees"
                className="w-full h-auto object-cover shadow-xl"
                loading="lazy"
                width={1280}
                height={896}
              />
              <div className="absolute -bottom-3 -right-3 w-24 h-24 border-b-2 border-r-2 border-accent pointer-events-none" />
              <div className="absolute -top-3 -left-3 w-24 h-24 border-t-2 border-l-2 border-accent pointer-events-none" />
            </div>
            <div>
              <span className="font-display text-[10px] tracking-[0.4em] text-accent uppercase">Our Founder</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 text-foreground">
                Manchala Madappa
              </h2>
              <p className="font-serif italic text-muted-foreground mt-1">Master Weaver</p>
              <div className="w-16 h-[2px] bg-accent mt-5 mb-6" />
              <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                <p>
                  In <strong className="text-foreground">1986</strong>, Mr. Manchala Madappa founded
                  <strong className="text-foreground"> Manchala Gadwal Handloom Sarees</strong> weaving firm
                  in a town called Yemmiganur, a short distance from Gadwal.
                </p>
                <p>
                  He began with <strong className="text-foreground">20 looms</strong>, and by 1988 the
                  workshop had grown to <strong className="text-foreground">200 looms</strong>. He produced
                  every variety of Gadwal saree — cotton, sico, silk, tussar and more.
                </p>
                <p>
                  His vision was transparent and unwavering: deliver the finest handcrafted sarees to every
                  client. Today his legacy is carried forward by his sons and grandson, who continue to
                  uphold his values in the industry.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted/40 py-16 md:py-20">
          <div className="container max-w-3xl text-center">
            <span className="font-display text-[10px] tracking-[0.4em] text-accent uppercase">Today</span>
            <h2 className="font-display text-2xl md:text-3xl font-bold mt-3 text-foreground">
              Serving Customers Across the World
            </h2>
            <div className="w-16 h-[2px] bg-accent mx-auto mt-5 mb-6" />
            <p className="font-body text-muted-foreground leading-relaxed">
              Manchala Gadwal Sarees now serves customers in <strong className="text-foreground">Hyderabad
              City through 2 stores</strong>, and online to clients across the globe — bringing authentic
              handwoven Gadwal heritage directly to your doorstep.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
