import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Phone, Clock, Star, Navigation, ExternalLink, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface LocationRow {
  id: string;
  name: string;
  address: string;
  city: string | null;
  state: string | null;
  pincode: string | null;
  phone: string | null;
  hours: string | null;
  map_url: string | null;
  directions_url: string | null;
  rating: number | null;
  reviews_count: number | null;
  photo_url: string | null;
}

export function StoreLocationsSection() {
  const isMobile = useIsMobile();
  const [mapLoc, setMapLoc] = useState<LocationRow | null>(null);
  const { data: locations = [] } = useQuery({
    queryKey: ['store-locations-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_locations')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return (data || []) as LocationRow[];
    },
  });

  if (locations.length === 0) return null;

  const buildEmbedUrl = (loc: LocationRow) => {
    const q = encodeURIComponent(
      [loc.name, loc.address, loc.city, loc.state, loc.pincode].filter(Boolean).join(', ')
    );
    return `https://maps.google.com/maps?q=${q}&output=embed`;
  };

  return (
    <section className="py-12 md:py-28 bg-muted/30">
      <div className="container px-4">
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-accent" />
            <span className="font-display text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-muted-foreground">
              Visit Us
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-5xl font-bold text-foreground tracking-wide">
            Our Store Locations
          </h2>
          <div className="w-20 ornate-line mt-4 mb-4 md:mt-5 md:mb-5" />
          <p className="font-body text-sm md:text-base text-muted-foreground max-w-xl">
            Experience our exquisite saree collections in person at our boutiques across Hyderabad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
          {locations.map((loc) => {
            const fullAddr = [loc.address, loc.city, loc.state, loc.pincode]
              .filter(Boolean)
              .join(', ');
            return (
              <article
                key={loc.id}
                className="group bg-card border border-border hover:border-accent/40 transition-colors overflow-hidden flex flex-col"
              >
                <div className="p-5 md:p-8 flex flex-col gap-4 flex-1">
                  <header className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-base md:text-xl font-bold text-foreground leading-tight">
                      {loc.name}
                    </h3>
                    {loc.rating != null && (
                      <div className="flex items-center gap-1 shrink-0 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-body text-xs font-bold text-foreground">
                          {Number(loc.rating).toFixed(1)}
                        </span>
                        {loc.reviews_count != null && (
                          <span className="font-body text-[11px] text-muted-foreground">
                            ({loc.reviews_count})
                          </span>
                        )}
                      </div>
                    )}
                  </header>

                  <ul className="space-y-3 flex-1">
                    <li className="flex items-start gap-3">
                      <span className="w-8 h-8 border border-accent/20 flex items-center justify-center shrink-0">
                        <MapPin className="h-3.5 w-3.5 text-accent" />
                      </span>
                      <p className="font-body text-sm text-foreground/80 leading-relaxed pt-1">
                        {fullAddr}
                      </p>
                    </li>
                    {loc.hours && (
                      <li className="flex items-center gap-3">
                        <span className="w-8 h-8 border border-accent/20 flex items-center justify-center shrink-0">
                          <Clock className="h-3.5 w-3.5 text-accent" />
                        </span>
                        <p className="font-body text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                          {loc.hours}
                        </p>
                      </li>
                    )}
                    {loc.phone && (
                      <li className="flex items-center gap-3">
                        <span className="w-8 h-8 border border-accent/20 flex items-center justify-center shrink-0">
                          <Phone className="h-3.5 w-3.5 text-accent" />
                        </span>
                        <a
                          href={`tel:${loc.phone.replace(/\s/g, '')}`}
                          className="font-body text-sm text-foreground/80 hover:text-accent transition-colors"
                        >
                          {loc.phone}
                        </a>
                      </li>
                    )}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    {loc.directions_url && (
                      <a
                        href={loc.directions_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-display text-[11px] font-bold tracking-[0.2em] uppercase"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        Get Directions
                      </a>
                    )}
                    {(loc.map_url || loc.address) && (
                      <a
                        href={loc.map_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (isMobile) {
                            e.preventDefault();
                            setMapLoc(loc);
                          }
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-display text-[11px] font-bold tracking-[0.2em] uppercase"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View on Map
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <Dialog open={!!mapLoc} onOpenChange={(o) => !o && setMapLoc(null)}>
        <DialogContent className="p-0 max-w-full w-screen h-[100dvh] sm:h-[100dvh] sm:max-w-full rounded-none border-0 gap-0 flex flex-col [&>button]:hidden">
          <DialogTitle className="sr-only">{mapLoc?.name} map</DialogTitle>
          {mapLoc && (
            <>
              <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-background shrink-0">
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-bold truncate">{mapLoc.name}</p>
                  <p className="font-body text-xs text-muted-foreground truncate">
                    {[mapLoc.address, mapLoc.city].filter(Boolean).join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => setMapLoc(null)}
                  className="h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-muted shrink-0"
                  aria-label="Close map"
                >
                  <X className="h-5 w-5" />
                </button>
              </header>
              <div className="flex-1 relative bg-muted">
                <iframe
                  title={`Map of ${mapLoc.name}`}
                  src={buildEmbedUrl(mapLoc)}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="flex gap-2 px-4 py-3 border-t border-border bg-background shrink-0" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
                {mapLoc.directions_url && (
                  <a
                    href={mapLoc.directions_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-display text-[11px] font-bold tracking-[0.2em] uppercase"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    Directions
                  </a>
                )}
                {mapLoc.phone && (
                  <a
                    href={`tel:${mapLoc.phone.replace(/\s/g, '')}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-display text-[11px] font-bold tracking-[0.2em] uppercase"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
