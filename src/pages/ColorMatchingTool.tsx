import { useState } from 'react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Link } from 'react-router-dom';

const sareeColors = [
  {
    name: 'Red / Maroon',
    hex: '#8B1A1A',
    swatch: 'bg-[#8B1A1A]',
    blouse: [
      { color: 'Gold', hex: '#C5A55A', note: 'Classic bridal pairing' },
      { color: 'Deep Green', hex: '#1B4332', note: 'Rich contrast for weddings' },
      { color: 'Matching Red', hex: '#8B1A1A', note: 'Monochrome elegance' },
      { color: 'Cream / Off-White', hex: '#F5F0E1', note: 'Soft & regal look' },
    ],
    jewelry: ['Temple gold jewelry', 'Ruby-studded necklace', 'Gold jhumkas', 'Kundan maang tikka'],
    occasions: ['Weddings', 'Festivals', 'Puja ceremonies'],
  },
  {
    name: 'Royal Blue',
    hex: '#1A3A6B',
    swatch: 'bg-[#1A3A6B]',
    blouse: [
      { color: 'Gold', hex: '#C5A55A', note: 'Regal and striking' },
      { color: 'Silver Grey', hex: '#A8A8A8', note: 'Contemporary cool' },
      { color: 'Coral Pink', hex: '#E8836B', note: 'Playful contrast' },
      { color: 'Matching Blue', hex: '#1A3A6B', note: 'Sophisticated monochrome' },
    ],
    jewelry: ['Pearl necklace set', 'Sapphire-toned studs', 'Oxidized silver bangles', 'Diamond pendant'],
    occasions: ['Evening events', 'Sangeet', 'Receptions'],
  },
  {
    name: 'Emerald Green',
    hex: '#1B5E3B',
    swatch: 'bg-[#1B5E3B]',
    blouse: [
      { color: 'Gold', hex: '#C5A55A', note: 'Traditional & luxurious' },
      { color: 'Magenta Pink', hex: '#C23078', note: 'Vibrant Banarasi pairing' },
      { color: 'Peach', hex: '#FFDAB9', note: 'Soft & elegant' },
      { color: 'Beige', hex: '#D4C5A0', note: 'Understated charm' },
    ],
    jewelry: ['Emerald-studded gold set', 'Polki choker', 'Green enamel jhumkas', 'Gold waist chain'],
    occasions: ['Mehendi', 'Festivals', 'Traditional gatherings'],
  },
  {
    name: 'Pink / Magenta',
    hex: '#C23078',
    swatch: 'bg-[#C23078]',
    blouse: [
      { color: 'Navy Blue', hex: '#1A3A6B', note: 'Bold & modern' },
      { color: 'Gold', hex: '#C5A55A', note: 'Festive glamour' },
      { color: 'Bottle Green', hex: '#1B4332', note: 'Classic contrast' },
      { color: 'Ivory', hex: '#FFFFF0', note: 'Soft romantic look' },
    ],
    jewelry: ['Rose gold set', 'Pearl choker', 'Pink stone jhumkas', 'Kundan bangles'],
    occasions: ['Engagement', 'Birthday celebrations', 'Baby showers'],
  },
  {
    name: 'Yellow / Mustard',
    hex: '#C59D1D',
    swatch: 'bg-[#C59D1D]',
    blouse: [
      { color: 'Teal Green', hex: '#2E8B8B', note: 'Vibrant festive combo' },
      { color: 'Deep Purple', hex: '#5B2C6F', note: 'Royal & dramatic' },
      { color: 'Rust Orange', hex: '#B7410E', note: 'Warm tonal pairing' },
      { color: 'Off-White', hex: '#F5F0E1', note: 'Fresh & clean' },
    ],
    jewelry: ['Antique gold haram', 'Meenakari jewelry', 'Gold temple bangles', 'Chandbali earrings'],
    occasions: ['Haldi ceremony', 'Pongal', 'Casual ethnic wear'],
  },
  {
    name: 'Purple / Lavender',
    hex: '#6A3D9A',
    swatch: 'bg-[#6A3D9A]',
    blouse: [
      { color: 'Gold', hex: '#C5A55A', note: 'Luxurious pairing' },
      { color: 'Silver', hex: '#C0C0C0', note: 'Elegant & refined' },
      { color: 'Pastel Pink', hex: '#F4C2C2', note: 'Soft & dreamy' },
      { color: 'Cream', hex: '#F5F0E1', note: 'Light & graceful' },
    ],
    jewelry: ['Amethyst pendant set', 'White gold studs', 'Platinum chain', 'Crystal bangles'],
    occasions: ['Cocktail parties', 'Receptions', 'Art exhibitions'],
  },
  {
    name: 'White / Ivory',
    hex: '#F5F0E1',
    swatch: 'bg-[#F5F0E1] border border-border',
    blouse: [
      { color: 'Gold', hex: '#C5A55A', note: 'Kerala kasavu style' },
      { color: 'Red', hex: '#8B1A1A', note: 'Bold traditional contrast' },
      { color: 'Pastel Blue', hex: '#A7C7E7', note: 'Serene & modern' },
      { color: 'Black', hex: '#1A1A1A', note: 'Sharp monochrome' },
    ],
    jewelry: ['Gold temple set', 'Pearl multi-strand', 'Gold jhumkas with red stones', 'Simple gold chain'],
    occasions: ['Onam', 'Prayer ceremonies', 'South Indian weddings'],
  },
  {
    name: 'Orange / Rust',
    hex: '#B7410E',
    swatch: 'bg-[#B7410E]',
    blouse: [
      { color: 'Dark Green', hex: '#1B4332', note: 'Earthy traditional' },
      { color: 'Gold', hex: '#C5A55A', note: 'Warm & festive' },
      { color: 'Maroon', hex: '#6B1A1A', note: 'Rich autumn palette' },
      { color: 'Cream', hex: '#F5F0E1', note: 'Bright & fresh' },
    ],
    jewelry: ['Coral bead set', 'Gold coin necklace', 'Antique bangles', 'Temple earrings'],
    occasions: ['Navratri', 'Durga Puja', 'Casual festive wear'],
  },
];

export default function ColorMatchingTool() {
  const [selected, setSelected] = useState<number | null>(null);
  const current = selected !== null ? sareeColors[selected] : null;

  return (
    <div className="min-h-screen pattern-bg">
      <PageMeta
        title="Saree Color Matching Tool | Manchala Gadwal Sarees"
        description="Find the perfect blouse color and jewelry pairing for your saree. Our expert guide helps you style any saree beautifully."
        canonicalPath="/color-matching"
      />
      <AnnouncementBar />
      <Navbar /><Breadcrumbs />

      <main className="py-12 md:py-20">
        <div className="container max-w-5xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">Styling Tool</span>
              <h1 className="font-display text-3xl md:text-5xl font-bold mt-2">
                Saree Color <span className="text-primary italic">Matching</span>
              </h1>
              <div className="w-16 h-[2px] bg-accent mx-auto mt-4" />
              <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto text-sm">
                Select your saree color to discover perfect blouse and jewelry pairings curated by our stylists.
              </p>
            </div>
          </ScrollReveal>

          {/* Color Picker */}
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {sareeColors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setSelected(i)}
                  className={`group flex flex-col items-center gap-2 p-3 rounded-sm border transition-all duration-300 ${
                    selected === i
                      ? 'border-accent shadow-lg scale-105 bg-accent/5'
                      : 'border-border hover:border-accent/50 hover:shadow-md'
                  }`}
                >
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${c.swatch} shadow-inner transition-transform group-hover:scale-110`}
                  />
                  <span className="font-body text-xs text-foreground whitespace-nowrap">{c.name}</span>
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Results */}
          {current && (
            <ScrollReveal key={current.name}>
              <div className="bg-card border border-border rounded-sm overflow-hidden shadow-lg">
                {/* Header */}
                <div className="p-6 md:p-8 flex items-center gap-4 border-b border-border" style={{ background: `linear-gradient(135deg, ${current.hex}15, transparent)` }}>
                  <div className={`w-16 h-16 rounded-full ${current.swatch} shadow-lg flex-shrink-0`} />
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold">{current.name} Saree</h2>
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      Best for: {current.occasions.join(' • ')}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                  {/* Blouse Pairings */}
                  <div className="p-6 md:p-8">
                    <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                      <span className="text-xl">👚</span> Blouse Color Pairings
                    </h3>
                    <div className="space-y-3">
                      {current.blouse.map((b) => (
                        <div key={b.color} className="flex items-center gap-3 p-3 rounded-sm bg-background border border-border/50 hover:border-accent/30 transition-colors">
                          <div
                            className="w-10 h-10 rounded-full shadow-inner flex-shrink-0 border border-border/30"
                            style={{ backgroundColor: b.hex }}
                          />
                          <div>
                            <p className="font-body text-sm font-semibold text-foreground">{b.color}</p>
                            <p className="font-body text-xs text-muted-foreground">{b.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Jewelry Suggestions */}
                  <div className="p-6 md:p-8">
                    <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                      <span className="text-xl">💎</span> Jewelry Recommendations
                    </h3>
                    <ul className="space-y-3">
                      {current.jewelry.map((j) => (
                        <li key={j} className="flex items-center gap-3 p-3 rounded-sm bg-background border border-border/50 hover:border-accent/30 transition-colors">
                          <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                          <span className="font-body text-sm text-foreground">{j}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-sm">
                      <p className="font-body text-xs text-muted-foreground italic">
                        💡 Pro tip: Match your jewelry metal tone to the saree's zari — gold zari pairs with gold jewelry, silver zari with oxidized or silver pieces.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          {!current && (
            <div className="text-center py-16 text-muted-foreground">
              <span className="text-5xl block mb-4">🎨</span>
              <p className="font-body text-sm">Select a saree color above to see styling suggestions</p>
            </div>
          )}

          {/* CTA */}
          <ScrollReveal>
            <div className="text-center mt-12">
              <Link
                to="/collections"
                className="inline-block border border-primary text-primary px-8 py-3 text-xs tracking-[0.15em] font-body uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Shop Sarees by Color
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
